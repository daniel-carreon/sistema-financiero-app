'use client'

import { useState, useEffect } from 'react'
import { Calendar, TrendingUp, DollarSign } from 'lucide-react'

type Vista = 'diaria' | 'semanal' | 'mensual' | 'personalizada'

interface Transaccion {
  id: string
  fecha: string
  tipo: 'gasto' | 'ingreso'
  categoria: string
  monto: number
  descripcion: string
  metodo_pago: string
}

interface DataViewsProps {
  vista?: Vista
  fechaInicio?: string
  fechaFin?: string
  hideControls?: boolean
}

export function DataViews({ vista: vistaProp, fechaInicio: fechaInicioProp, fechaFin: fechaFinProp, hideControls = false }: DataViewsProps = {}) {
  const [vista, setVista] = useState<Vista>(vistaProp || 'mensual')
  const [transacciones, setTransacciones] = useState<Transaccion[]>([])
  const [loading, setLoading] = useState(false)
  const [fechaInicio, setFechaInicio] = useState(fechaInicioProp || '')
  const [fechaFin, setFechaFin] = useState(fechaFinProp || '')
  const [showDatePicker, setShowDatePicker] = useState(false)

  // Estados para filtros y sorting
  const [filtroTipo, setFiltroTipo] = useState<'todos' | 'gasto' | 'ingreso'>('todos')
  const [ordenColumna, setOrdenColumna] = useState<string | null>(null)
  const [ordenDireccion, setOrdenDireccion] = useState<'asc' | 'desc'>('desc')

  // Estados para paginación
  const [paginaActual, setPaginaActual] = useState(1)
  const [itemsPorPagina, setItemsPorPagina] = useState(20)

  useEffect(() => {
    if (vistaProp) setVista(vistaProp)
  }, [vistaProp])

  useEffect(() => {
    if (fechaInicioProp) setFechaInicio(fechaInicioProp)
  }, [fechaInicioProp])

  useEffect(() => {
    if (fechaFinProp) setFechaFin(fechaFinProp)
  }, [fechaFinProp])

  useEffect(() => {
    fetchData()
  }, [vista, fechaInicio, fechaFin])

  const fetchData = async () => {
    setLoading(true)
    try {
      let url = `/api/transacciones?vista=${vista}`
      if (vista === 'personalizada' && fechaInicio && fechaFin) {
        url += `&fecha_inicio=${fechaInicio}&fecha_fin=${fechaFin}`
      }
      const res = await fetch(url)
      const json = await res.json()
      setTransacciones(json.data || [])
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const aplicarFechasPersonalizadas = () => {
    if (fechaInicio && fechaFin) {
      setVista('personalizada')
      setShowDatePicker(false)
    }
  }

  // Calcular totales
  const totales = transacciones.reduce(
    (acc, t) => {
      if (t.tipo === 'ingreso') {
        acc.ingresos += t.monto
      } else {
        acc.gastos += t.monto
      }
      return acc
    },
    { ingresos: 0, gastos: 0 }
  )

  const balance = totales.ingresos - totales.gastos

  // Aplicar filtros y sorting
  const transaccionesFiltradas = transacciones
    .filter(t => filtroTipo === 'todos' || t.tipo === filtroTipo)
    .sort((a, b) => {
      if (!ordenColumna) return 0

      let valorA: any, valorB: any

      switch (ordenColumna) {
        case 'fecha':
          valorA = new Date(a.fecha).getTime()
          valorB = new Date(b.fecha).getTime()
          break
        case 'tipo':
          valorA = a.tipo
          valorB = b.tipo
          break
        case 'categoria':
          valorA = a.categoria
          valorB = b.categoria
          break
        case 'monto':
          valorA = a.monto
          valorB = b.monto
          break
        case 'metodo':
          valorA = a.metodo_pago
          valorB = b.metodo_pago
          break
        default:
          return 0
      }

      if (valorA < valorB) return ordenDireccion === 'asc' ? -1 : 1
      if (valorA > valorB) return ordenDireccion === 'asc' ? 1 : -1
      return 0
    })

  // Toggle sorting direction
  const toggleSort = (columna: string) => {
    if (ordenColumna === columna) {
      setOrdenDireccion(prev => prev === 'asc' ? 'desc' : 'asc')
    } else {
      setOrdenColumna(columna)
      setOrdenDireccion('asc')
    }
  }

  // Calcular paginación
  const indiceInicio = (paginaActual - 1) * itemsPorPagina
  const indiceFin = indiceInicio + itemsPorPagina
  const transaccionesPaginadas = transaccionesFiltradas.slice(indiceInicio, indiceFin)
  const totalPaginas = Math.ceil(transaccionesFiltradas.length / itemsPorPagina)

  // Reset página al cambiar filtros
  useEffect(() => {
    setPaginaActual(1)
  }, [filtroTipo, ordenColumna, ordenDireccion])

  // Agrupar por fecha según vista
  const agruparPorPeriodo = () => {
    const grupos: { [key: string]: Transaccion[] } = {}

    transaccionesPaginadas.forEach((t) => {
      const fecha = new Date(t.fecha)
      let key = ''

      if (vista === 'diaria') {
        key = fecha.toLocaleDateString('es-MX', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        })
      } else if (vista === 'semanal') {
        const weekNum = Math.ceil((fecha.getDate()) / 7)
        key = `${fecha.toLocaleDateString('es-MX', { month: 'long', year: 'numeric' })} - Semana ${weekNum}`
      } else {
        key = fecha.toLocaleDateString('es-MX', { month: 'long', year: 'numeric' })
      }

      if (!grupos[key]) grupos[key] = []
      grupos[key].push(t)
    })

    return Object.entries(grupos).sort((a, b) => b[0].localeCompare(a[0]))
  }

  const gruposData = agruparPorPeriodo()

  return (
    <div className="space-y-8">
      {/* Selector de Vista - Ocultar si hideControls es true */}
      {!hideControls && (
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
            📊 Vistas de Datos
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
      )}

      {/* Selector de Fechas Personalizado */}
      {!hideControls && showDatePicker && (
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl p-6 border-2 border-blue-200 dark:border-blue-800">
          <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            📅 Selecciona Periodo Personalizado
          </h4>
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

      {/* Filtros */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md border border-gray-200 dark:border-gray-700">
        <div className="flex flex-wrap gap-4 items-center">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filtrar por tipo:</span>
          <div className="flex gap-2">
            <button
              onClick={() => setFiltroTipo('todos')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filtroTipo === 'todos'
                  ? 'bg-emerald-500 text-white shadow-md'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setFiltroTipo('ingreso')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filtroTipo === 'ingreso'
                  ? 'bg-green-500 text-white shadow-md'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              Ingresos
            </button>
            <button
              onClick={() => setFiltroTipo('gasto')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filtroTipo === 'gasto'
                  ? 'bg-red-500 text-white shadow-md'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              Gastos
            </button>
          </div>
          <div className="ml-auto text-sm text-gray-600 dark:text-gray-400">
            {transaccionesFiltradas.length} transacciones
          </div>
        </div>
      </div>

      {/* Resumen de Totales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-6 rounded-xl border-2 border-green-200 dark:border-green-800">
          <div className="text-sm text-green-700 dark:text-green-300 mb-1">Total Ingresos</div>
          <div className="text-2xl font-bold text-green-900 dark:text-green-100">
            ${totales.ingresos.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 p-6 rounded-xl border-2 border-red-200 dark:border-red-800">
          <div className="text-sm text-red-700 dark:text-red-300 mb-1">Total Gastos</div>
          <div className="text-2xl font-bold text-red-900 dark:text-red-100">
            ${totales.gastos.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
          </div>
        </div>

        <div className={`bg-gradient-to-br p-6 rounded-xl border-2 ${
          balance >= 0
            ? 'from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-blue-200 dark:border-blue-800'
            : 'from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 border-orange-200 dark:border-orange-800'
        }`}>
          <div className={`text-sm mb-1 ${balance >= 0 ? 'text-blue-700 dark:text-blue-300' : 'text-orange-700 dark:text-orange-300'}`}>
            Balance Neto
          </div>
          <div className={`text-2xl font-bold ${balance >= 0 ? 'text-blue-900 dark:text-blue-100' : 'text-orange-900 dark:text-orange-100'}`}>
            ${balance.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
          </div>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Cargando datos...</p>
        </div>
      )}

      {/* Tablas agrupadas */}
      {!loading && gruposData.length === 0 && (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-xl">
          <p className="text-gray-600 dark:text-gray-400">No hay transacciones en este periodo</p>
        </div>
      )}

      {!loading && gruposData.map(([periodo, txs]) => {
        const totalPeriodo = txs.reduce((sum, t) => sum + (t.tipo === 'ingreso' ? t.monto : -t.monto), 0)

        return (
          <div key={periodo} className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-6 py-4">
              <div className="flex justify-between items-center">
                <h4 className="text-lg font-bold">{periodo}</h4>
                <span className={`font-bold ${totalPeriodo >= 0 ? 'text-green-200' : 'text-red-200'}`}>
                  ${totalPeriodo.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th
                      onClick={() => toggleSort('fecha')}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                      <div className="flex items-center gap-1">
                        Fecha/Hora
                        {ordenColumna === 'fecha' && (
                          <span className="text-emerald-500">{ordenDireccion === 'asc' ? '↑' : '↓'}</span>
                        )}
                      </div>
                    </th>
                    <th
                      onClick={() => toggleSort('tipo')}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                      <div className="flex items-center gap-1">
                        Tipo
                        {ordenColumna === 'tipo' && (
                          <span className="text-emerald-500">{ordenDireccion === 'asc' ? '↑' : '↓'}</span>
                        )}
                      </div>
                    </th>
                    <th
                      onClick={() => toggleSort('categoria')}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                      <div className="flex items-center gap-1">
                        Categoría
                        {ordenColumna === 'categoria' && (
                          <span className="text-emerald-500">{ordenDireccion === 'asc' ? '↑' : '↓'}</span>
                        )}
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Descripción
                    </th>
                    <th
                      onClick={() => toggleSort('metodo')}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                      <div className="flex items-center gap-1">
                        Método
                        {ordenColumna === 'metodo' && (
                          <span className="text-emerald-500">{ordenDireccion === 'asc' ? '↑' : '↓'}</span>
                        )}
                      </div>
                    </th>
                    <th
                      onClick={() => toggleSort('monto')}
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                      <div className="flex items-center justify-end gap-1">
                        Monto
                        {ordenColumna === 'monto' && (
                          <span className="text-emerald-500">{ordenDireccion === 'asc' ? '↑' : '↓'}</span>
                        )}
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {txs.map((tx) => (
                    <tr key={tx.id} className={`transition-colors ${
                      tx.tipo === 'ingreso'
                        ? 'bg-green-200/95 dark:bg-green-800/50 hover:bg-green-300 dark:hover:bg-green-700/60'
                        : 'bg-red-200/95 dark:bg-red-800/50 hover:bg-red-300 dark:hover:bg-red-700/60'
                    }`}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                        {new Date(tx.fecha).toLocaleString('es-MX', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 text-xs font-bold rounded-full ${
                            tx.tipo === 'ingreso'
                              ? 'bg-green-500 text-white dark:bg-green-600'
                              : 'bg-red-500 text-white dark:bg-red-600'
                          }`}
                        >
                          {tx.tipo === 'ingreso' ? 'Ingreso' : 'Gasto'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                        {tx.categoria}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300 max-w-xs truncate">
                        {tx.descripcion || '-'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300 capitalize">
                        {tx.metodo_pago || '-'}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold text-right ${
                        tx.tipo === 'ingreso'
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-red-600 dark:text-red-400'
                      }`}>
                        {tx.tipo === 'ingreso' ? '+' : '-'}${tx.monto.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      })}

      {/* Controles de Paginación */}
      <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
        {/* Info de registros */}
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Mostrando{' '}
          <span className="font-semibold text-gray-900 dark:text-white">
            {transaccionesFiltradas.length === 0 ? 0 : indiceInicio + 1}
          </span>
          {' '}-{' '}
          <span className="font-semibold text-gray-900 dark:text-white">
            {Math.min(indiceFin, transaccionesFiltradas.length)}
          </span>
          {' '}de{' '}
          <span className="font-semibold text-gray-900 dark:text-white">
            {transaccionesFiltradas.length}
          </span>
          {' '}transacciones
        </div>

        {/* Controles de navegación */}
        <div className="flex items-center gap-3">
          {/* Items por página */}
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600 dark:text-gray-400">
              Por página:
            </label>
            <select
              value={itemsPorPagina}
              onChange={(e) => {
                setItemsPorPagina(Number(e.target.value))
                setPaginaActual(1)
              }}
              className="px-3 py-1.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
            >
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
              <option value={500}>500</option>
            </select>
          </div>

          {/* Botones de navegación */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPaginaActual(prev => Math.max(1, prev - 1))}
              disabled={paginaActual === 1}
              className="px-3 py-1.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Anterior
            </button>

            <span className="px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400">
              Página{' '}
              <span className="font-semibold text-gray-900 dark:text-white">
                {paginaActual}
              </span>
              {' '}de{' '}
              <span className="font-semibold text-gray-900 dark:text-white">
                {totalPaginas || 1}
              </span>
            </span>

            <button
              onClick={() => setPaginaActual(prev => Math.min(totalPaginas, prev + 1))}
              disabled={paginaActual >= totalPaginas}
              className="px-3 py-1.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Siguiente
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
