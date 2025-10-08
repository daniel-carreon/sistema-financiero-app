'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { DollarSign, Calendar, CheckCircle, AlertCircle } from 'lucide-react'

interface IngresoItem {
  categoria: string
  cantidad: number
  monto: number
}

const CATEGORIAS_INGRESO = [
  { nombre: 'Tours', icon: '🏛️' },
  { nombre: 'Comedor', icon: '🍽️' },
  { nombre: 'Reservaciones', icon: '📅' },
  { nombre: 'Anticipos', icon: '💳' },
  { nombre: 'Otros Ingresos', icon: '💰' },
]

export default function CorteDiarioPage() {
  const [ingresos, setIngresos] = useState<IngresoItem[]>(
    CATEGORIAS_INGRESO.map(cat => ({
      categoria: cat.nombre,
      cantidad: 0,
      monto: 0,
    }))
  )
  const [registradoPor, setRegistradoPor] = useState('Armando')
  const [loading, setLoading] = useState(false)
  const [mensaje, setMensaje] = useState<{ tipo: 'success' | 'error'; texto: string } | null>(null)

  const handleChange = (index: number, field: 'cantidad' | 'monto', value: string) => {
    const newIngresos = [...ingresos]
    newIngresos[index][field] = parseFloat(value) || 0
    setIngresos(newIngresos)
  }

  const calcularTotal = () => {
    return ingresos.reduce((sum, item) => sum + item.monto, 0)
  }

  const calcularCantidadTotal = () => {
    return ingresos.reduce((sum, item) => sum + item.cantidad, 0)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMensaje(null)

    try {
      // Filtrar solo los ingresos con monto > 0
      const ingresosValidos = ingresos.filter(item => item.monto > 0)

      if (ingresosValidos.length === 0) {
        setMensaje({ tipo: 'error', texto: 'Debes ingresar al menos un monto mayor a 0' })
        setLoading(false)
        return
      }

      // Preparar transacciones para inserción batch
      const transacciones = ingresosValidos.map(item => ({
        tipo: 'ingreso',
        categoria: item.categoria,
        monto: item.monto,
        descripcion: `Corte diario - ${item.cantidad} unidad(es)`,
        metodo_pago: 'Efectivo',
        registrado_por: registradoPor,
        fecha_hora: new Date().toISOString(),
      }))

      // Insertar en Supabase
      const { error } = await supabase
        .from('transacciones')
        .insert(transacciones)

      if (error) throw error

      setMensaje({
        tipo: 'success',
        texto: `✅ Corte registrado: ${ingresosValidos.length} categorías, $${calcularTotal().toLocaleString('es-MX')} MXN total`
      })

      // Resetear formulario
      setIngresos(
        CATEGORIAS_INGRESO.map(cat => ({
          categoria: cat.nombre,
          cantidad: 0,
          monto: 0,
        }))
      )

    } catch (error: any) {
      setMensaje({ tipo: 'error', texto: `Error: ${error.message}` })
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="p-4 sm:p-6 md:p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-emerald-600 to-cyan-600 dark:from-emerald-400 dark:to-cyan-400 bg-clip-text text-transparent mb-2 flex items-center gap-2">
          <Calendar className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
          Corte Diario
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          Registra todos los ingresos del día en un solo formulario
        </p>
      </div>

      {/* Resumen visual */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <div className="relative overflow-hidden bg-gradient-to-br from-emerald-500/20 to-green-500/20 backdrop-blur-sm rounded-2xl border-2 border-emerald-500/30 p-6">
          <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full bg-gradient-to-br from-white/20 to-transparent blur-2xl" />
          <p className="text-sm font-semibold opacity-90 text-emerald-700 dark:text-emerald-400 mb-2">TOTAL DEL DÍA</p>
          <p className="text-4xl font-bold text-emerald-700 dark:text-emerald-400">
            ${calcularTotal().toLocaleString('es-MX')}
          </p>
        </div>

        <div className="relative overflow-hidden bg-gradient-to-br from-cyan-500/20 to-blue-500/20 backdrop-blur-sm rounded-2xl border-2 border-cyan-500/30 p-6">
          <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full bg-gradient-to-br from-white/20 to-transparent blur-2xl" />
          <p className="text-sm font-semibold opacity-90 text-cyan-700 dark:text-cyan-400 mb-2">TRANSACCIONES</p>
          <p className="text-4xl font-bold text-cyan-700 dark:text-cyan-400">
            {calcularCantidadTotal()}
          </p>
        </div>
      </div>

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="relative overflow-hidden bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-6 space-y-6">
        <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 blur-3xl" />

        {/* Mensaje de feedback */}
        {mensaje && (
          <div className={`p-4 rounded-xl flex items-center gap-3 ${
            mensaje.tipo === 'success'
              ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
              : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800'
          }`}>
            {mensaje.tipo === 'success' ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            <span className="font-medium">{mensaje.texto}</span>
          </div>
        )}

        {/* Selector de usuario */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            👤 Registrado por
          </label>
          <select
            value={registradoPor}
            onChange={(e) => setRegistradoPor(e.target.value)}
            className="w-full p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 transition-all"
          >
            <option value="Armando">Armando</option>
            <option value="Esposa">Esposa</option>
            <option value="Hijo 1">Hijo 1</option>
            <option value="Hijo 2">Hijo 2</option>
            <option value="Hijo 3">Hijo 3</option>
          </select>
        </div>

        {/* Grid de categorías */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-emerald-500" />
            Ingresos por Categoría
          </h3>

          {ingresos.map((item, index) => (
            <div
              key={item.categoria}
              className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700/50 dark:to-gray-800/50 rounded-xl border border-gray-200/50 dark:border-gray-600/50"
            >
              <div className="sm:col-span-1 flex items-center gap-2">
                <span className="text-2xl">{CATEGORIAS_INGRESO[index].icon}</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {item.categoria}
                </span>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Cantidad
                </label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={item.cantidad || ''}
                  onChange={(e) => handleChange(index, 'cantidad', e.target.value)}
                  className="w-full p-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Monto Total ($)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={item.monto || ''}
                  onChange={(e) => handleChange(index, 'monto', e.target.value)}
                  className="w-full p-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                  placeholder="0.00"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Botón submit */}
        <button
          type="submit"
          disabled={loading || calcularTotal() === 0}
          className="w-full p-4 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-xl font-bold text-lg hover:scale-[1.02] hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-200 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Registrando...
            </>
          ) : (
            <>
              <CheckCircle className="w-6 h-6" />
              Registrar Corte Completo
            </>
          )}
        </button>
      </form>
    </main>
  )
}
