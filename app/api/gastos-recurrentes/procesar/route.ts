import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

/**
 * Procesa gastos recurrentes automáticamente
 * Verifica si hay gastos programados para hoy que no se hayan registrado
 */
export async function POST() {
  const hoy = new Date()
  const diaActual = hoy.getDate()
  const fechaHoy = hoy.toISOString().split('T')[0] // YYYY-MM-DD

  try {
    // 1. Obtener todos los gastos recurrentes activos para el día actual
    const { data: gastosRecurrentes, error: errorGastos } = await supabase
      .from('gastos_recurrentes')
      .select('*')
      .eq('activo', true)
      .eq('dia_cobro', diaActual)

    if (errorGastos) {
      return NextResponse.json({ error: errorGastos.message }, { status: 500 })
    }

    if (!gastosRecurrentes || gastosRecurrentes.length === 0) {
      return NextResponse.json({
        message: 'No hay gastos recurrentes para procesar hoy',
        procesados: 0
      })
    }

    const transaccionesCreadas = []
    const gastosActualizados = []

    // 2. Procesar cada gasto recurrente
    for (const gasto of gastosRecurrentes) {
      // Verificar si ya se procesó hoy
      if (gasto.ultima_ejecucion === fechaHoy) {
        continue // Ya se procesó hoy, skip
      }

      // Crear transacción
      const { data: transaccion, error: errorTransaccion } = await supabase
        .from('transacciones')
        .insert({
          tipo: 'gasto',
          monto: gasto.monto,
          categoria: gasto.categoria || 'Otros Gastos',
          concepto: `${gasto.nombre} (Recurrente)`,
          descripcion: `Gasto recurrente automático: ${gasto.nombre}`,
          metodo_pago: gasto.metodo_pago || 'Tarjeta',
          registrado_por: 'Sistema Automático',
          fecha: hoy.toISOString(),
        })
        .select()

      if (errorTransaccion) {
        console.error(`Error al crear transacción para ${gasto.nombre}:`, errorTransaccion)
        continue
      }

      // Actualizar ultima_ejecucion
      const { error: errorUpdate } = await supabase
        .from('gastos_recurrentes')
        .update({
          ultima_ejecucion: fechaHoy,
          updated_at: hoy.toISOString()
        })
        .eq('id', gasto.id)

      if (errorUpdate) {
        console.error(`Error al actualizar ultima_ejecucion para ${gasto.nombre}:`, errorUpdate)
      }

      transaccionesCreadas.push(transaccion?.[0])
      gastosActualizados.push(gasto.nombre)
    }

    return NextResponse.json({
      success: true,
      message: `Procesados ${transaccionesCreadas.length} gastos recurrentes`,
      procesados: transaccionesCreadas.length,
      gastos: gastosActualizados,
      transacciones: transaccionesCreadas,
    })

  } catch (error: any) {
    return NextResponse.json({
      error: 'Error al procesar gastos recurrentes',
      details: error.message
    }, { status: 500 })
  }
}
