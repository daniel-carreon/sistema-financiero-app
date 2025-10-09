import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const vista = searchParams.get('vista') || 'mensual' // diaria, semanal, mensual, personalizada
  const fechaInicio = searchParams.get('fecha_inicio')
  const fechaFin = searchParams.get('fecha_fin')

  let query = supabase
    .from('transacciones')
    .select('*')
    .order('fecha', { ascending: false })

  // Filtros según la vista
  const now = new Date()

  if (vista === 'personalizada' && fechaInicio && fechaFin) {
    // Rango personalizado
    query = query
      .gte('fecha', `${fechaInicio}T00:00:00`)
      .lte('fecha', `${fechaFin}T23:59:59`)
  } else if (vista === 'diaria') {
    // Últimos 7 días
    const sevenDaysAgo = new Date(now)
    sevenDaysAgo.setDate(now.getDate() - 7)
    query = query.gte('fecha', sevenDaysAgo.toISOString())
  } else if (vista === 'semanal') {
    // Últimas 4 semanas
    const fourWeeksAgo = new Date(now)
    fourWeeksAgo.setDate(now.getDate() - 28)
    query = query.gte('fecha', fourWeeksAgo.toISOString())
  } else {
    // Últimos 12 meses
    const twelveMonthsAgo = new Date(now)
    twelveMonthsAgo.setMonth(now.getMonth() - 12)
    query = query.gte('fecha', twelveMonthsAgo.toISOString())
  }

  const { data, error } = await query.limit(500)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data, vista })
}
