import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

/**
 * API para subir y procesar archivos CSV de ingresos/gastos
 *
 * Formato esperado del CSV:
 * fecha,tipo,categoria,monto,descripcion,num_pax,metodo_pago,registrado_por
 * 2025-10-06,ingreso,Tours,1200,Tour grupal,15,Efectivo,Armando
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No se proporcionó archivo' }, { status: 400 })
    }

    // Validar que sea CSV
    if (!file.name.endsWith('.csv') && !file.type.includes('csv')) {
      return NextResponse.json({
        error: 'Solo se permiten archivos CSV (.csv)'
      }, { status: 400 })
    }

    // Leer contenido del archivo
    const content = await file.text()
    const lines = content.split('\n').filter(line => line.trim())

    if (lines.length < 2) {
      return NextResponse.json({
        error: 'El archivo está vacío o no tiene datos'
      }, { status: 400 })
    }

    // Parsear CSV
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase())
    const transacciones = []
    const errors = []

    // Validar headers esperados
    const requiredHeaders = ['fecha', 'tipo', 'categoria', 'monto']
    const missingHeaders = requiredHeaders.filter(h => !headers.includes(h))

    if (missingHeaders.length > 0) {
      return NextResponse.json({
        error: `Faltan columnas requeridas: ${missingHeaders.join(', ')}`,
        hint: 'Formato esperado: fecha,tipo,categoria,monto,descripcion,num_pax,metodo_pago,registrado_por'
      }, { status: 400 })
    }

    // Procesar cada fila
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim()
      if (!line) continue

      const values = line.split(',').map(v => v.trim())

      if (values.length !== headers.length) {
        errors.push(`Fila ${i + 1}: Número de columnas incorrecto`)
        continue
      }

      // Crear objeto con los datos
      const row: any = {}
      headers.forEach((header, index) => {
        row[header] = values[index]
      })

      // Validaciones
      const tipo = row.tipo?.toLowerCase()
      if (tipo !== 'gasto' && tipo !== 'ingreso') {
        errors.push(`Fila ${i + 1}: Tipo debe ser 'gasto' o 'ingreso'`)
        continue
      }

      const monto = parseFloat(row.monto)
      if (isNaN(monto) || monto <= 0) {
        errors.push(`Fila ${i + 1}: Monto inválido`)
        continue
      }

      // Preparar transacción
      const transaccion: any = {
        fecha_hora: row.fecha ? new Date(row.fecha).toISOString() : new Date().toISOString(),
        tipo,
        categoria: row.categoria || 'Otros ' + (tipo === 'gasto' ? 'Gastos' : 'Ingresos'),
        monto,
        descripcion: row.descripcion || null,
        num_pax: row.num_pax ? parseInt(row.num_pax) : null,
        metodo_pago: row.metodo_pago || 'Efectivo',
        registrado_por: row.registrado_por || 'Armando',
      }

      transacciones.push(transaccion)
    }

    if (transacciones.length === 0) {
      return NextResponse.json({
        error: 'No se pudo procesar ninguna transacción',
        details: errors
      }, { status: 400 })
    }

    // Insertar en Supabase (batch)
    const { error: insertError, data } = await supabase
      .from('transacciones')
      .insert(transacciones)
      .select()

    if (insertError) {
      throw new Error(`Error al insertar en BD: ${insertError.message}`)
    }

    return NextResponse.json({
      success: true,
      message: `Se registraron ${transacciones.length} transacciones exitosamente`,
      count: transacciones.length,
      errors: errors.length > 0 ? errors : undefined,
      transactions: data,
    })

  } catch (error: any) {
    console.error('Upload Excel error:', error)
    return NextResponse.json(
      {
        error: 'Error procesando archivo',
        details: error.message
      },
      { status: 500 }
    )
  }
}
