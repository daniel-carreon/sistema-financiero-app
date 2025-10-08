'use client'

import { useEffect, useState } from 'react'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { supabase } from '@/lib/supabase'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

type Vista = 'diaria' | 'semanal' | 'mensual' | 'personalizada'

interface TrendChartProps {
  vista?: Vista
  fechaInicio?: string
  fechaFin?: string
}

export function TrendChart({ vista = 'mensual', fechaInicio, fechaFin }: TrendChartProps = {}) {
  const [chartData, setChartData] = useState<any>(null)

  useEffect(() => {
    fetchTrendData()
  }, [vista, fechaInicio, fechaFin])

  const fetchTrendData = async () => {
    // Últimos 30 días
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - 30)

    const { data } = await supabase
      .from('resumen_diario')
      .select('*')
      .gte('fecha', startDate.toISOString().split('T')[0])
      .order('fecha', { ascending: true })

    if (data) {
      const labels = data.map(row => new Date(row.fecha).toLocaleDateString('es-MX', { day: '2-digit', month: 'short' }))
      const ingresos = data.map(row => parseFloat(row.total_ingresos || 0))
      const gastos = data.map(row => parseFloat(row.total_gastos || 0))

      setChartData({
        labels,
        datasets: [
          {
            label: 'Ingresos',
            data: ingresos,
            borderColor: 'rgb(34, 197, 94)',
            backgroundColor: 'rgba(34, 197, 94, 0.1)',
            tension: 0.3,
          },
          {
            label: 'Gastos',
            data: gastos,
            borderColor: 'rgb(239, 68, 68)',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            tension: 0.3,
          },
        ],
      })
    }
  }

  if (!chartData) return <div>Cargando gráfica...</div>

  return (
    <Line
      data={chartData}
      options={{
        responsive: true,
        maintainAspectRatio: true,
        aspectRatio: window.innerWidth < 640 ? 1 : 2,
        plugins: {
          legend: {
            position: 'top' as const,
            labels: {
              padding: window.innerWidth < 640 ? 10 : 15,
              font: {
                size: window.innerWidth < 640 ? 11 : 12,
              },
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              font: {
                size: window.innerWidth < 640 ? 10 : 11,
              },
              callback: (value) => `$${value.toLocaleString('es-MX')}`,
            },
          },
          x: {
            ticks: {
              font: {
                size: window.innerWidth < 640 ? 10 : 11,
              },
              maxRotation: 45,
              minRotation: 45,
            },
          },
        },
      }}
    />
  )
}
