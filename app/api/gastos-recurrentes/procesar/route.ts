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
      .from('gastos_mensuales')
      .select('*')
      .eq('activo', true)
      .eq('dia_de_cobro', diaActual)

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

    // 2. Verificar qué gastos ya fueron procesados hoy
    for (const gasto of gastosRecurrentes) {
      // Verificar si ya existe una transacción para este gasto hoy
      const { data: transaccionExistente } = await supabase
        .from('transacciones')
        .select('id')
        .eq('concepto', `${gasto.nombre_app} (Recurrente)`)
        .gte('fecha', `${fechaHoy}T00:00:00`)
        .lte('fecha', `${fechaHoy}T23:59:59`)
        .limit(1)

      if (transaccionExistente && transaccionExistente.length > 0) {
        console.log(`⏭️ Gasto "${gasto.nombre_app}" ya procesado hoy`)
        continue // Ya se procesó hoy, skip
      }

      // Crear transacción
      const { data: transaccion, error: errorTransaccion } = await supabase
        .from('transacciones')
        .insert({
          tipo: 'gasto',
          monto: gasto.monto,
          categoria: 'Suscripciones',
          concepto: `${gasto.nombre_app} (Recurrente)`,
          descripcion: `Gasto recurrente automático: ${gasto.nombre_app}`,
          metodo_pago: 'Tarjeta',
          registrado_por: 'Sistema Automático',
          fecha: hoy.toISOString(),
        })
        .select()

      if (errorTransaccion) {
        console.error(`❌ Error al crear transacción para ${gasto.nombre_app}:`, errorTransaccion)
        continue
      }

      transaccionesCreadas.push(transaccion?.[0])
      gastosActualizados.push(gasto.nombre_app)
      console.log(`✅ Gasto "${gasto.nombre_app}" procesado: $${gasto.monto}`)
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
