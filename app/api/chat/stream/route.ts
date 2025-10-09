import { NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export async function POST(request: NextRequest) {
  const encoder = new TextEncoder()
  const { message, messages = [], images = [] } = await request.json()

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const openRouterMessages = [
          {
            role: 'system' as const,
            content: `Eres un asistente financiero personal. Registras gastos e ingresos de forma conversacional.

📋 CATEGORÍAS VÁLIDAS:
**Gastos:** Alimentación, Transporte, Vivienda, Salud, Entretenimiento, Educación, Otros Gastos
**Ingresos:** Salario, Ventas, Servicios, Inversiones, Otros Ingresos

💳 MÉTODOS: Efectivo, Tarjeta, Transferencia

Sé amigable y confirma con resumen detallado.`
          },
          ...messages.slice(-10).map((msg: ChatMessage) => ({
            role: msg.role,
            content: msg.content
          })),
          {
            role: 'user' as const,
            content: images.length > 0
              ? `[El usuario subió ${images.length} imagen(es) de tickets]\n\n${message}`
              : message
          }
        ]

        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
            'X-Title': 'Sistema Financiero',
          },
          body: JSON.stringify({
            model: 'google/gemini-2.5-flash',
            messages: openRouterMessages,
            max_tokens: 2000,
            temperature: 0.7,
            stream: true,
            // ✨ Activar thinking mode de Gemini 2.5 Flash
            thinking_config: {
              max_thinking_tokens: 500,  // Tokens dedicados a razonamiento interno
            },
            tools: [
              {
                type: 'function',
                function: {
                  name: 'registrar_gasto',
                  description: 'Registra un gasto',
                  parameters: {
                    type: 'object',
                    properties: {
                      monto: { type: 'number' },
                      categoria: {
                        type: 'string',
                        enum: ['Alimentación', 'Transporte', 'Vivienda', 'Salud', 'Entretenimiento', 'Educación', 'Otros Gastos']
                      },
                      descripcion: { type: 'string' },
                      metodo_pago: {
                        type: 'string',
                        enum: ['Efectivo', 'Tarjeta', 'Transferencia'],
                        default: 'Efectivo'
                      },
                      registrado_por: {
                        type: 'string',
                        description: 'Nombre de quien registra'
                      }
                    },
                    required: ['monto', 'categoria']
                  }
                }
              },
              {
                type: 'function',
                function: {
                  name: 'registrar_ingreso',
                  description: 'Registra un ingreso',
                  parameters: {
                    type: 'object',
                    properties: {
                      monto: { type: 'number' },
                      categoria: {
                        type: 'string',
                        enum: ['Salario', 'Ventas', 'Servicios', 'Inversiones', 'Otros Ingresos']
                      },
                      descripcion: { type: 'string' },
                      metodo_pago: {
                        type: 'string',
                        enum: ['Efectivo', 'Tarjeta', 'Transferencia'],
                        default: 'Efectivo'
                      },
                      registrado_por: {
                        type: 'string',
                        description: 'Nombre de quien registra'
                      }
                    },
                    required: ['monto', 'categoria']
                  }
                }
              }
            ],
            tool_choice: 'auto'
          })
        })

        if (!response.ok || !response.body) {
          const errorText = await response.text()
          console.error('OpenRouter error:', response.status, errorText)
          throw new Error(`OpenRouter error (${response.status}): ${errorText}`)
        }

        const reader = response.body.getReader()
        const decoder = new TextDecoder()

        let buffer = ''
        let toolCallData: any = null
        let collectedToolCall = { name: '', arguments: '' }
        let hasStartedGenerating = false  // ✨ Para detectar la transición de pensando → escribiendo

        // ✨ Enviar evento inicial de "pensando"
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ thinking: true })}\n\n`))

        while (true) {
          const { done, value } = await reader.read()

          if (done) break

          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split('\n')
          buffer = lines.pop() || ''

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6)

              if (data === '[DONE]') continue

              try {
                const json = JSON.parse(data)

                // Recolectar tool calls incrementalmente
                if (json.choices?.[0]?.delta?.tool_calls) {
                  const toolCall = json.choices[0].delta.tool_calls[0]
                  if (toolCall.function?.name) {
                    collectedToolCall.name = toolCall.function.name
                  }
                  if (toolCall.function?.arguments) {
                    collectedToolCall.arguments += toolCall.function.arguments
                  }
                }

                // ✨ Cuando empiece a generar contenido, cambiar a "escribiendo"
                if (json.choices?.[0]?.delta?.content) {
                  // Primera vez que recibimos contenido → transición thinking → writing
                  if (!hasStartedGenerating) {
                    controller.enqueue(encoder.encode(`data: ${JSON.stringify({ thinking: false })}\n\n`))
                    hasStartedGenerating = true
                  }

                  const chunk = json.choices[0].delta.content
                  controller.enqueue(encoder.encode(`data: ${JSON.stringify({ chunk })}\n\n`))
                }

                // Detectar fin de completación
                if (json.choices?.[0]?.finish_reason === 'tool_calls') {
                  toolCallData = collectedToolCall
                }
              } catch (e) {
                // Ignorar errores de parsing
              }
            }
          }
        }

        // ✅ AHORA: Procesar tool call DESPUÉS de stream completo pero ANTES de cerrar
        if (toolCallData && toolCallData.name && toolCallData.arguments) {
          try {
            const functionName = toolCallData.name
            const functionArgs = JSON.parse(toolCallData.arguments)

            const tipo = functionName === 'registrar_gasto' ? 'gasto' : 'ingreso'

            // 1. Enviar mensaje de "procesando..."
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({
              chunk: '\n\n⏳ Registrando en base de datos...'
            })}\n\n`))

            // 2. Insertar en Supabase
            const { error } = await supabase.from('transacciones').insert({
              tipo,
              monto: functionArgs.monto,
              categoria: functionArgs.categoria,
              descripcion: functionArgs.descripcion || null,
              metodo_pago: functionArgs.metodo_pago || 'Efectivo',
              registrado_por: functionArgs.registrado_por || 'Usuario',
              fecha_hora: new Date().toISOString(),
            })

            // 3. Enviar confirmación DESPUÉS de registrar
            if (error) {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({
                chunk: `\n\n❌ Error al registrar: ${error.message}`
              })}\n\n`))
            } else {
              const confirmMsg = `\n\n✅ **${tipo === 'gasto' ? 'Gasto' : 'Ingreso'} registrado exitosamente!**\n\n💰 **Monto:** $${functionArgs.monto.toLocaleString('es-MX')} MXN\n📁 **Categoría:** ${functionArgs.categoria}\n💳 **Método:** ${functionArgs.metodo_pago || 'Efectivo'}\n👤 **Registrado por:** ${functionArgs.registrado_por || 'Usuario'}\n\n🎉 Puedes ver el resumen actualizado en el Dashboard.`

              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ chunk: confirmMsg })}\n\n`))
            }
          } catch (e: any) {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({
              chunk: `\n\n❌ Error procesando función: ${e.message}`
            })}\n\n`))
          }
        }

        // Señal final de stream completo
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ done: true })}\n\n`))
        controller.close()
      } catch (error: any) {
        console.error('Chat stream error:', error)
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({
          chunk: '❌ Error al procesar. Intenta de nuevo.',
          done: true
        })}\n\n`))
        controller.close()
      }
    }
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  })
}
