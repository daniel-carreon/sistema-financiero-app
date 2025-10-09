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
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Detect if mobile on client side only
    const checkMobile = () => setIsMobile(window.innerWidth < 640)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    fetchTrendData()
  }, [vista, fechaInicio, fechaFin])

  const fetchTrendData = async () => {
    let startDate: Date
    const endDate = new Date()

    // Calcular fecha de inicio según vista
    switch (vista) {
      case 'diaria':
        startDate = new Date()
        startDate.setDate(startDate.getDate() - 7) // Últimos 7 días
        break
      case 'semanal':
        startDate = new Date()
        startDate.setDate(startDate.getDate() - 28) // Últimas 4 semanas
        break
      case 'mensual':
        startDate = new Date()
        startDate.setMonth(startDate.getMonth() - 12) // Últimos 12 meses
        break
      case 'personalizada':
        if (!fechaInicio || !fechaFin) {
          return
        }
        startDate = new Date(fechaInicio)
        endDate.setTime(new Date(fechaFin).getTime())
        break
      default:
        startDate = new Date()
        startDate.setDate(startDate.getDate() - 30)
    }

    // Consultar transacciones en lugar de resumen_diario
    const { data } = await supabase
      .from('transacciones')
      .select('*')
      .gte('fecha', startDate.toISOString())
      .lte('fecha', endDate.toISOString())
      .order('fecha', { ascending: true })

    if (data && data.length > 0) {
      // Agrupar por fecha y calcular totales
      const groupedByDate: Record<string, { ingresos: number; gastos: number }> = {}

      data.forEach(row => {
        const fecha = new Date(row.fecha).toISOString().split('T')[0]
        if (!groupedByDate[fecha]) {
          groupedByDate[fecha] = { ingresos: 0, gastos: 0 }
        }

        const monto = parseFloat(row.monto || 0)
        if (row.tipo === 'ingreso') {
          groupedByDate[fecha].ingresos += monto
        } else if (row.tipo === 'gasto') {
          groupedByDate[fecha].gastos += monto
        }
      })

      // Convertir a arrays para Chart.js
      const sortedDates = Object.keys(groupedByDate).sort()
      const labels = sortedDates.map(fecha =>
        new Date(fecha).toLocaleDateString('es-MX', { day: '2-digit', month: 'short' })
      )
      const ingresos = sortedDates.map(fecha => groupedByDate[fecha].ingresos)
      const gastos = sortedDates.map(fecha => groupedByDate[fecha].gastos)

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
    } else {
      // Sin datos - mostrar gráfica vacía
      setChartData({
        labels: [],
        datasets: [
          {
            label: 'Ingresos',
            data: [],
            borderColor: 'rgb(34, 197, 94)',
            backgroundColor: 'rgba(34, 197, 94, 0.1)',
            tension: 0.3,
          },
          {
            label: 'Gastos',
            data: [],
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
        aspectRatio: isMobile ? 1 : 2,
        plugins: {
          legend: {
            position: 'top' as const,
            labels: {
              padding: isMobile ? 10 : 15,
              font: {
                size: isMobile ? 11 : 12,
              },
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              font: {
                size: isMobile ? 10 : 11,
              },
              callback: (value) => `$${value.toLocaleString('es-MX')}`,
            },
          },
          x: {
            ticks: {
              font: {
                size: isMobile ? 10 : 11,
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
