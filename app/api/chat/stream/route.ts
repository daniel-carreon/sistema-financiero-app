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
            content: `Eres un asistente financiero para Zazil Tunich. Registras gastos e ingresos de forma conversacional.

📋 CATEGORÍAS VÁLIDAS:
**Gastos:** Nómina, Mantenimiento, Compras, Gasolina, Comisiones, Publicidad, Servicios, Otros Gastos
**Ingresos:** Tours, Comedor, Reservaciones, Anticipos, Otros Ingresos

👥 USUARIOS: Armando, Esposa, Hijo 1, Hijo 2, Hijo 3
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
            'X-Title': 'Zazil Tunich',
          },
          body: JSON.stringify({
            model: 'openai/gpt-5',
            messages: openRouterMessages,
            max_tokens: 2000,
            temperature: 0.7,
            stream: true,
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
                        enum: ['Nómina', 'Mantenimiento', 'Compras', 'Gasolina', 'Comisiones', 'Publicidad', 'Servicios', 'Otros Gastos']
                      },
                      descripcion: { type: 'string' },
                      metodo_pago: {
                        type: 'string',
                        enum: ['Efectivo', 'Tarjeta', 'Transferencia'],
                        default: 'Efectivo'
                      },
                      registrado_por: {
                        type: 'string',
                        enum: ['Armando', 'Esposa', 'Hijo 1', 'Hijo 2', 'Hijo 3'],
                        default: 'Armando'
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
                        enum: ['Tours', 'Comedor', 'Reservaciones', 'Anticipos', 'Otros Ingresos']
                      },
                      descripcion: { type: 'string' },
                      metodo_pago: {
                        type: 'string',
                        enum: ['Efectivo', 'Tarjeta', 'Transferencia'],
                        default: 'Efectivo'
                      },
                      registrado_por: {
                        type: 'string',
                        enum: ['Armando', 'Esposa', 'Hijo 1', 'Hijo 2', 'Hijo 3'],
                        default: 'Armando'
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
          throw new Error('OpenRouter error')
        }

        const reader = response.body.getReader()
        const decoder = new TextDecoder()

        let buffer = ''
        let toolCallBuffer = ''
        let isCollectingToolCall = false

        while (true) {
          const { done, value } = await reader.read()

          if (done) {
            // Procesar tool call si existe
            if (toolCallBuffer) {
              try {
                const toolData = JSON.parse(toolCallBuffer)
                if (toolData.tool_calls?.[0]) {
                  const toolCall = toolData.tool_calls[0]
                  const functionName = toolCall.function.name
                  const functionArgs = JSON.parse(toolCall.function.arguments)

                  const tipo = functionName === 'registrar_gasto' ? 'gasto' : 'ingreso'

                  // Insertar en Supabase
                  await supabase.from('transacciones').insert({
                    tipo,
                    monto: functionArgs.monto,
                    categoria: functionArgs.categoria,
                    descripcion: functionArgs.descripcion || null,
                    metodo_pago: functionArgs.metodo_pago || 'Efectivo',
                    registrado_por: functionArgs.registrado_por || 'Armando',
                    fecha_hora: new Date().toISOString(),
                  })

                  // Enviar confirmación
                  const confirmMsg = `✅ ${tipo === 'gasto' ? 'Gasto' : 'Ingreso'} registrado!\n\n💰 Monto: $${functionArgs.monto.toLocaleString('es-MX')}\n📁 ${functionArgs.categoria}\n👤 ${functionArgs.registrado_por || 'Armando'}`

                  controller.enqueue(encoder.encode(`data: ${JSON.stringify({ chunk: confirmMsg })}\n\n`))
                }
              } catch (e) {
                // Ignorar errores de tool call
              }
            }

            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ done: true })}\n\n`))
            break
          }

          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split('\n')
          buffer = lines.pop() || ''

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6)

              if (data === '[DONE]') continue

              try {
                const json = JSON.parse(data)

                if (json.choices?.[0]?.delta?.tool_calls) {
                  isCollectingToolCall = true
                  toolCallBuffer += JSON.stringify(json.choices[0].delta)
                }

                if (json.choices?.[0]?.delta?.content) {
                  const chunk = json.choices[0].delta.content
                  controller.enqueue(encoder.encode(`data: ${JSON.stringify({ chunk })}\n\n`))
                }
              } catch (e) {
                // Ignorar errores de parsing
              }
            }
          }
        }

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
