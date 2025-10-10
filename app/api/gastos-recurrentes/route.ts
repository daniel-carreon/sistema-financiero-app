import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// GET: Obtener todos los gastos recurrentes
export async function GET() {
  const { data, error } = await supabase
    .from('gastos_recurrentes')
    .select('*')
    .order('dia_cobro', { ascending: true })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data })
}

// POST: Crear nuevo gasto recurrente
export async function POST(request: Request) {
  const body = await request.json()

  const { data, error } = await supabase
    .from('gastos_recurrentes')
    .insert({
      nombre: body.nombre,
      dia_cobro: body.dia_cobro,
      monto: body.monto,
      activo: body.activo ?? true,
      categoria: body.categoria || 'Otros Gastos',
      metodo_pago: body.metodo_pago || 'Tarjeta',
      cuenta: body.cuenta || null,
    })
    .select()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data }, { status: 201 })
}

// PUT: Actualizar gasto recurrente
export async function PUT(request: Request) {
  const body = await request.json()

  if (!body.id) {
    return NextResponse.json({ error: 'ID requerido' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('gastos_recurrentes')
    .update({
      nombre: body.nombre,
      dia_cobro: body.dia_cobro,
      monto: body.monto,
      activo: body.activo,
      categoria: body.categoria,
      metodo_pago: body.metodo_pago,
      cuenta: body.cuenta,
      updated_at: new Date().toISOString(),
    })
    .eq('id', body.id)
    .select()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data })
}

// DELETE: Eliminar gasto recurrente
export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')

  if (!id) {
    return NextResponse.json({ error: 'ID requerido' }, { status: 400 })
  }

  const { error } = await supabase
    .from('gastos_recurrentes')
    .delete()
    .eq('id', id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
