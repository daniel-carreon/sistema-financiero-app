'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { KPICard } from '@/components/KPICard'
import { TrendChart } from '@/components/TrendChart'
import { DataViews } from '@/components/DataViews'

export default function HomePage() {
  const [kpis, setKpis] = useState({
    ingresos: 0,
    gastos: 0,
    balance: 0,
    transacciones: 0,
  })

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchKPIs()
  }, [])

  const fetchKPIs = async () => {
    // Query últimos 30 días (incluye transacciones de Septiembre)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const { data, error } = await supabase
      .from('resumen_diario')
      .select('*')
      .gte('fecha', thirtyDaysAgo.toISOString().split('T')[0])

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
          Vista general de tus finanzas en tiempo real
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KPICard
          title="Ingresos (30 días)"
          value={kpis.ingresos}
          icon="income"
          color="green"
        />
        <KPICard
          title="Gastos (30 días)"
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

      {/* Gráfica de tendencia con glassmorphism */}
      <div className="relative overflow-hidden bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-6 mb-8 hover:shadow-2xl transition-all duration-300">
        <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 blur-3xl" />
        <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-2">
          📈 Tendencia (Últimos 30 días)
        </h2>
        <div className="w-full overflow-x-auto">
          <TrendChart />
        </div>
      </div>

      {/* Tabla de transacciones con glassmorphism */}
      <div className="relative overflow-hidden bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-6 hover:shadow-2xl transition-all duration-300">
        <div className="absolute -left-10 -bottom-10 w-40 h-40 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 blur-3xl" />
        <DataViews />
      </div>
    </main>
  )
}
