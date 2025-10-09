import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const image = formData.get('image') as File

    if (!image) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 })
    }

    // 1. Subir imagen a Supabase Storage
    const timestamp = Date.now()
    const fileName = `ticket_${timestamp}_${image.name}`
    const imageBytes = await image.arrayBuffer()

    const { error: uploadError } = await supabase.storage
      .from('facturas')
      .upload(fileName, imageBytes, {
        contentType: image.type,
      })

    if (uploadError) {
      throw new Error(`Upload error: ${uploadError.message}`)
    }

    // 2. Obtener URL pública
    const { data: urlData } = supabase.storage
      .from('facturas')
      .getPublicUrl(fileName)

    const imageUrl = urlData.publicUrl

    // 3. Analizar con Gemini 2.5 Flash (multimodal con OCR mejorado)
    const visionResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
        'X-Title': 'Sistema Financiero - OCR',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: `Analiza esta imagen y determina si es un ticket/factura válido.

**PASO 1: VALIDAR SI ES UN TICKET**
- ¿La imagen muestra un ticket, factura, recibo o comprobante de compra?
- ¿Tiene información de comercio, monto, items comprados?
- Si es screenshot de chat, foto aleatoria, o documento que NO sea ticket → marca "es_ticket": false

**CATEGORÍAS VÁLIDAS DEL SISTEMA:**
- Gastos: Alimentación, Transporte, Vivienda, Salud, Entretenimiento, Educación, Otros Gastos
- Ingresos: Salario, Ventas, Servicios, Inversiones, Otros Ingresos

**INSTRUCCIONES SI ES TICKET:**
1. Extrae el MONTO TOTAL (solo número, sin símbolos)
2. Identifica el COMERCIO/ESTABLECIMIENTO
3. Sugiere UNA categoría de la lista válida (la más apropiada)
4. Lista los items principales si son visibles
5. Extrae fecha si está visible

**RESPONDE SOLO CON JSON (sin markdown, sin explicaciones):**

Si ES ticket:
{
  "es_ticket": true,
  "monto": 450.50,
  "comercio": "Pemex",
  "categoria_sugerida": "Gasolina",
  "items": ["Magna Premium 30L", "Total"],
  "fecha": "2025-10-06",
  "descripcion": "Llenado de combustible en Pemex"
}

Si NO ES ticket (screenshot, foto aleatoria, etc):
{
  "es_ticket": false,
  "razon": "Esta es una captura de pantalla de una conversación de texto, no un ticket o factura",
  "sugerencia": "Por favor sube una foto de un ticket, factura o recibo de compra"
}`
              },
              {
                type: 'image_url',
                image_url: {
                  url: imageUrl
                }
              }
            ]
          }
        ],
        max_tokens: 400,
        temperature: 0.1,
        response_format: { type: 'json_object' }
      })
    })

    if (!visionResponse.ok) {
      const errorText = await visionResponse.text()
      console.error('Vision API error:', errorText)
      throw new Error(`Vision API error: ${visionResponse.statusText}`)
    }

    const visionData = await visionResponse.json()
    const analysisText = visionData.choices?.[0]?.message?.content

    if (!analysisText) {
      throw new Error('No se recibió respuesta del Vision API')
    }

    // Parsear JSON de la respuesta
    let ocrData
    try {
      ocrData = JSON.parse(analysisText)
    } catch (parseError) {
      console.error('Error parsing JSON:', analysisText)
      // Fallback: devolver texto plano si no es JSON válido
      ocrData = {
        monto: null,
        comercio: 'Desconocido',
        categoria_sugerida: 'Otros Gastos',
        items: [],
        descripcion: analysisText,
      }
    }

    // Formatear respuesta para el usuario
    let analysisFormatted

    if (ocrData.es_ticket === false) {
      // NO es un ticket válido
      analysisFormatted = `⚠️ **IMAGEN NO RECONOCIDA COMO TICKET**

${ocrData.razon || 'Esta imagen no parece ser un ticket, factura o recibo de compra.'}

💡 **Sugerencia:** ${ocrData.sugerencia || 'Sube una foto de un ticket o factura de compra para que pueda analizarlo.'}

Si quieres registrar algo manualmente, dime:
- ¿Es gasto o ingreso?
- Monto
- Comercio/Proveedor
- Categoría`
    } else {
      // SÍ es un ticket válido
      analysisFormatted = `📸 **TICKET ANALIZADO:**

💰 **Monto:** $${ocrData.monto?.toLocaleString('es-MX') || 'No detectado'}
🏪 **Comercio:** ${ocrData.comercio || 'No detectado'}
📁 **Categoría sugerida:** ${ocrData.categoria_sugerida || 'Otros Gastos'}
${ocrData.items && ocrData.items.length > 0 ? `📋 **Items:** ${ocrData.items.join(', ')}` : ''}
${ocrData.fecha ? `📅 **Fecha:** ${ocrData.fecha}` : ''}

📝 **Descripción:** ${ocrData.descripcion || ocrData.comercio || 'Ticket analizado'}`
    }

    return NextResponse.json({
      success: true,
      url: imageUrl,
      analysis: analysisFormatted,
      data: ocrData, // JSON estructurado para usar programáticamente
    })

  } catch (error: any) {
    console.error('Upload/OCR error:', error)
    return NextResponse.json(
      { error: error.message || 'Error procesando imagen' },
      { status: 500 }
    )
  }
}
