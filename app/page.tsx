'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { supabase } from '@/lib/supabase'
import { KPICard } from '@/components/KPICard'
import { DataViews } from '@/components/DataViews'
import { Calendar, TrendingUp, DollarSign } from 'lucide-react'

// Dynamic import for TrendChart to avoid SSR issues with Chart.js
const TrendChart = dynamic(() => import('@/components/TrendChart').then(mod => ({ default: mod.TrendChart })), {
  ssr: false,
  loading: () => <div className="text-center py-12 text-gray-600 dark:text-gray-400">Cargando gráfica...</div>
})

type Vista = 'diaria' | 'semanal' | 'mensual' | 'personalizada'

export default function HomePage() {
  const [vista, setVista] = useState<Vista>('mensual')
  const [fechaInicio, setFechaInicio] = useState('')
  const [fechaFin, setFechaFin] = useState('')
  const [showDatePicker, setShowDatePicker] = useState(false)

  const [kpis, setKpis] = useState({
    ingresos: 0,
    gastos: 0,
    balance: 0,
    transacciones: 0,
  })

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchKPIs()
  }, [vista, fechaInicio, fechaFin])

  const fetchKPIs = async () => {
    setLoading(true)

    let startDate: Date
    const endDate = new Date()

    // Calcular fecha de inicio según vista
    switch (vista) {
      case 'diaria':
        startDate = new Date()
        startDate.setHours(0, 0, 0, 0)
        break
      case 'semanal':
        startDate = new Date()
        startDate.setDate(startDate.getDate() - 7)
        break
      case 'mensual':
        startDate = new Date()
        startDate.setDate(startDate.getDate() - 30)
        break
      case 'personalizada':
        if (!fechaInicio || !fechaFin) {
          setLoading(false)
          return
        }
        startDate = new Date(fechaInicio)
        endDate.setTime(new Date(fechaFin).getTime())
        break
      default:
        startDate = new Date()
        startDate.setDate(startDate.getDate() - 30)
    }

    const { data, error } = await supabase
      .from('resumen_diario')
      .select('*')
      .gte('fecha', startDate.toISOString().split('T')[0])
      .lte('fecha', endDate.toISOString().split('T')[0])

    if (data) {
      const totalIngresos = data.reduce((sum, row) => sum + parseFloat(row.total_ingresos || 0), 0)
      const totalGastos = data.reduce((sum, row) => sum + parseFloat(row.total_gastos || 0), 0)
      const totalTransacciones = data.reduce((sum, row) => sum + parseInt(row.num_transacciones || 0), 0)

      setKpis({
        ingresos: totalIngresos,
        gastos: totalGastos,
        balance: totalIngresos - totalGastos,
        transacciones: totalTransacciones,
      })
    }

    setLoading(false)
  }

  const aplicarFechasPersonalizadas = () => {
    if (fechaInicio && fechaFin) {
      setVista('personalizada')
      setShowDatePicker(false)
    }
  }

  const getVistaLabel = () => {
    switch (vista) {
      case 'diaria': return 'Hoy'
      case 'semanal': return 'Últimos 7 días'
      case 'mensual': return 'Últimos 30 días'
      case 'personalizada': return `${fechaInicio} - ${fechaFin}`
      default: return 'Últimos 30 días'
    }
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-xl text-gray-900 dark:text-white">Cargando...</div>
    </div>
  )

  return (
    <main className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto">
      {/* Header con gradiente */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-emerald-600 to-cyan-600 dark:from-emerald-400 dark:to-cyan-400 bg-clip-text text-transparent mb-2">
          Dashboard Financiero
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          Vista general de tus finanzas · {getVistaLabel()}
        </p>
      </div>

      {/* Selector de Vista - AHORA EN EL DASHBOARD */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            📅 Período de Análisis
          </h3>
          <div className="flex gap-2 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg flex-wrap">
            <button
              onClick={() => setVista('diaria')}
              className={`px-4 py-2 rounded-md font-medium transition-all flex items-center gap-2 ${
                vista === 'diaria'
                  ? 'bg-white dark:bg-gray-700 text-emerald-600 dark:text-emerald-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Calendar className="w-4 h-4" />
              Diaria
            </button>
            <button
              onClick={() => setVista('semanal')}
              className={`px-4 py-2 rounded-md font-medium transition-all flex items-center gap-2 ${
                vista === 'semanal'
                  ? 'bg-white dark:bg-gray-700 text-emerald-600 dark:text-emerald-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              Semanal
            </button>
            <button
              onClick={() => setVista('mensual')}
              className={`px-4 py-2 rounded-md font-medium transition-all flex items-center gap-2 ${
                vista === 'mensual'
                  ? 'bg-white dark:bg-gray-700 text-emerald-600 dark:text-emerald-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <DollarSign className="w-4 h-4" />
              Mensual
            </button>
            <button
              onClick={() => setShowDatePicker(!showDatePicker)}
              className={`px-4 py-2 rounded-md font-medium transition-all flex items-center gap-2 ${
                vista === 'personalizada'
                  ? 'bg-white dark:bg-gray-700 text-emerald-600 dark:text-emerald-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Calendar className="w-4 h-4" />
              Personalizada
            </button>
          </div>
        </div>

        {/* Selector de Fechas Personalizado con Shortcuts */}
        {showDatePicker && (
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl p-6 border-2 border-blue-200 dark:border-blue-800">
            <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              📅 Selecciona Periodo Personalizado
            </h4>

            {/* Date inputs */}
            <div className="flex flex-col sm:flex-row gap-4 items-end">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Fecha Inicio
                </label>
                <input
                  type="date"
                  value={fechaInicio}
                  onChange={(e) => setFechaInicio(e.target.value)}
                  className="w-full p-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Fecha Fin
                </label>
                <input
                  type="date"
                  value={fechaFin}
                  onChange={(e) => setFechaFin(e.target.value)}
                  className="w-full p-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <button
                onClick={aplicarFechasPersonalizadas}
                disabled={!fechaInicio || !fechaFin}
                className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-lg font-semibold hover:from-emerald-600 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Aplicar
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KPICard
          title={`Ingresos (${getVistaLabel()})`}
          value={kpis.ingresos}
          icon="income"
          color="green"
        />
        <KPICard
          title={`Gastos (${getVistaLabel()})`}
          value={kpis.gastos}
          icon="expense"
          color="red"
        />
        <KPICard
          title="Balance Neto"
          value={kpis.balance}
          icon="balance"
          color={kpis.balance > 0 ? 'green' : 'red'}
        />
        <KPICard
          title="Transacciones"
          value={kpis.transacciones}
          icon="transactions"
          color="blue"
        />
      </div>

      {/* Gráfica de tendencia con GLASSMORPHISM INTENSO */}
      <div className="relative overflow-hidden bg-white/90 dark:bg-gray-800/90 backdrop-blur-3xl rounded-3xl shadow-2xl border-2 border-white/50 dark:border-gray-700/50 p-6 mb-8 hover:shadow-3xl transition-all duration-300">
        {/* Múltiples capas de cristal */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-transparent to-white/40 dark:from-white/10 dark:via-transparent dark:to-white/5 -z-10" />
        <div className="absolute -right-10 -top-10 w-48 h-48 rounded-full bg-gradient-to-br from-emerald-500/30 to-cyan-500/30 blur-3xl" />
        <div className="absolute right-20 top-20 w-32 h-32 rounded-full bg-gradient-to-tl from-emerald-400/20 to-transparent blur-2xl" />

        <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-2 relative z-10">
          📈 Tendencia · {getVistaLabel()}
        </h2>
        <div className="w-full overflow-x-auto relative z-10">
          <TrendChart vista={vista} fechaInicio={fechaInicio} fechaFin={fechaFin} />
        </div>
      </div>

      {/* Tabla de transacciones con GLASSMORPHISM INTENSO */}
      <div className="relative overflow-hidden bg-white/90 dark:bg-gray-800/90 backdrop-blur-3xl rounded-3xl shadow-2xl border-2 border-white/50 dark:border-gray-700/50 p-6 hover:shadow-3xl transition-all duration-300">
        {/* Múltiples capas de cristal */}
        <div className="absolute inset-0 bg-gradient-to-bl from-white/60 via-transparent to-white/40 dark:from-white/10 dark:via-transparent dark:to-white/5 -z-10" />
        <div className="absolute -left-10 -bottom-10 w-48 h-48 rounded-full bg-gradient-to-tr from-cyan-500/30 to-blue-500/30 blur-3xl" />
        <div className="absolute left-32 bottom-32 w-32 h-32 rounded-full bg-gradient-to-br from-blue-400/20 to-transparent blur-2xl" />

        <div className="relative z-10">
          <DataViews vista={vista} fechaInicio={fechaInicio} fechaFin={fechaFin} hideControls={true} />
        </div>
      </div>
    </main>
  )
}
