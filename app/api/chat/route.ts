import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

interface ChatRequest {
  message: string
  messages: Array<{
    role: 'user' | 'assistant'
    content: string
  }>
  images?: string[]
}

export async function POST(request: NextRequest) {
  try {
    const body: ChatRequest = await request.json()
    const { message, messages = [], images = [] } = body

    if (!message?.trim() && images.length === 0) {
      return NextResponse.json(
        { error: 'Message or images are required' },
        { status: 400 }
      )
    }

    // Preparar mensajes para OpenRouter
    const openRouterMessages = [
      {
        role: 'system' as const,
        content: `Eres un asistente financiero personal. Tu trabajo es ayudar a registrar gastos e ingresos de forma conversacional.

🎯 HERRAMIENTAS DISPONIBLES:
1. registrar_gasto - Para registrar un gasto
2. registrar_ingreso - Para registrar un ingreso

📋 CATEGORÍAS VÁLIDAS:
**Gastos:** Alimentación, Transporte, Vivienda, Salud, Entretenimiento, Educación, Otros Gastos
**Ingresos:** Salario, Ventas, Servicios, Inversiones, Otros Ingresos

👥 El usuario puede especificar quién registra la transacción (opcional)

💳 MÉTODOS DE PAGO: Efectivo, Tarjeta, Transferencia

🔍 SI EL USUARIO SUBE UNA IMAGEN DE UN TICKET:
- Analiza la imagen con GPT-4 Vision para extraer: monto, fecha, items
- Si el usuario menciona un monto, valida que coincida con el del ticket
- Si no coincide, pregunta cuál usar

💡 INSTRUCCIONES:
- Sé amigable y conversacional
- Confirma los datos antes de registrar
- Si falta información (categoría, monto), pregunta
- Después de registrar, confirma con un resumen
- Si hay imagen, analízala y extrae la información automáticamente`
      },
      ...messages.slice(-10).map(msg => ({
        role: msg.role,
        content: msg.content
      })),
      {
        role: 'user' as const,
        content: message
      }
    ]

    // Añadir contexto de imágenes si existen
    if (images.length > 0) {
      // TODO: Aquí iría la lógica de GPT-4 Vision
      // Por ahora, solo indicamos que hay imágenes
      openRouterMessages[openRouterMessages.length - 1].content += `\n\n[El usuario subió ${images.length} imagen(es). Analiza las imágenes para extraer información del ticket.]`
    }

    const openRouterResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
        'X-Title': 'Sistema Financiero'
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: openRouterMessages,
        max_tokens: 1000,
        temperature: 0.7,
        tools: [
          {
            type: 'function',
            function: {
              name: 'registrar_gasto',
              description: 'Registra un nuevo gasto en la base de datos',
              parameters: {
                type: 'object',
                properties: {
                  monto: {
                    type: 'number',
                    description: 'Monto del gasto en MXN'
                  },
                  categoria: {
                    type: 'string',
                    enum: ['Alimentación', 'Transporte', 'Vivienda', 'Salud', 'Entretenimiento', 'Educación', 'Otros Gastos'],
                    description: 'Categoría del gasto'
                  },
                  descripcion: {
                    type: 'string',
                    description: 'Descripción opcional del gasto'
                  },
                  metodo_pago: {
                    type: 'string',
                    enum: ['Efectivo', 'Tarjeta', 'Transferencia'],
                    default: 'Efectivo'
                  },
                  registrado_por: {
                    type: 'string',
                    description: 'Nombre de quien registra la transacción'
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
              description: 'Registra un nuevo ingreso en la base de datos',
              parameters: {
                type: 'object',
                properties: {
                  monto: {
                    type: 'number',
                    description: 'Monto del ingreso en MXN'
                  },
                  categoria: {
                    type: 'string',
                    enum: ['Salario', 'Ventas', 'Servicios', 'Inversiones', 'Otros Ingresos'],
                    description: 'Categoría del ingreso'
                  },
                  descripcion: {
                    type: 'string',
                    description: 'Descripción opcional del ingreso'
                  },
                  metodo_pago: {
                    type: 'string',
                    enum: ['Efectivo', 'Tarjeta', 'Transferencia'],
                    default: 'Efectivo'
                  },
                  registrado_por: {
                    type: 'string',
                    description: 'Nombre de quien registra la transacción'
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

    if (!openRouterResponse.ok) {
      throw new Error(`OpenRouter error: ${openRouterResponse.statusText}`)
    }

    const data = await openRouterResponse.json()
    const choice = data.choices?.[0]
    const responseMessage = choice?.message

    // Verificar si hay tool calls
    if (responseMessage?.tool_calls && responseMessage.tool_calls.length > 0) {
      const toolCall = responseMessage.tool_calls[0]
      const functionName = toolCall.function.name
      const functionArgs = JSON.parse(toolCall.function.arguments)

      if (functionName === 'registrar_gasto' || functionName === 'registrar_ingreso') {
        const tipo = functionName === 'registrar_gasto' ? 'gasto' : 'ingreso'

        // Insertar en Supabase
        const { error: insertError } = await supabase
          .from('transacciones')
          .insert({
            tipo,
            monto: functionArgs.monto,
            categoria: functionArgs.categoria,
            descripcion: functionArgs.descripcion || null,
            metodo_pago: functionArgs.metodo_pago || 'Efectivo',
            registrado_por: functionArgs.registrado_por || 'Usuario',
            fecha_hora: new Date().toISOString(),
          })

        if (insertError) {
          return NextResponse.json({
            response: `❌ Error al registrar ${tipo}: ${insertError.message}\n\nPor favor, intenta de nuevo o usa el formulario manual.`
          })
        }

        return NextResponse.json({
          response: `✅ ${tipo === 'gasto' ? 'Gasto' : 'Ingreso'} registrado exitosamente!\n\n💰 Monto: $${functionArgs.monto.toLocaleString('es-MX')} MXN\n📁 Categoría: ${functionArgs.categoria}\n📝 Descripción: ${functionArgs.descripcion || 'N/A'}\n💳 Método: ${functionArgs.metodo_pago || 'Efectivo'}\n👤 Registrado por: ${functionArgs.registrado_por || 'Usuario'}\n\nPuedes ver el resumen actualizado en el Dashboard.`
        })
      }
    }

    // Respuesta normal (sin tool calling)
    const assistantResponse = responseMessage?.content || 'No pude procesar tu mensaje. ¿Puedes reformular?'

    return NextResponse.json({
      response: assistantResponse,
      usage: data.usage,
      model: data.model
    })

  } catch (error) {
    console.error('Chat API error:', error)

    return NextResponse.json(
      {
        error: 'Error al procesar tu mensaje',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
