'use client'

import { useState } from 'react'
import { Upload, FileText, CheckCircle2, AlertCircle, Download } from 'lucide-react'

export default function UploadExcelPage() {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      if (!selectedFile.name.endsWith('.csv')) {
        setError('Solo se permiten archivos CSV')
        return
      }
      setFile(selectedFile)
      setError(null)
      setResult(null)
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload-excel', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Error al procesar archivo')
      }

      setResult(data)
      setFile(null) // Limpiar archivo después de éxito
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const downloadTemplate = () => {
    const template = `fecha,tipo,categoria,monto,descripcion,num_pax,metodo_pago,registrado_por
2025-10-06,ingreso,Tours,1200,Tour grupal matutino,15,Efectivo,Armando
2025-10-06,ingreso,Comedor,850,Comidas del día,8,Tarjeta,Esposa
2025-10-06,gasto,Gasolina,500,Llenado de camioneta,,Efectivo,Hijo 1
2025-10-06,gasto,Compras,1200,Compras del mercado,,Efectivo,Armando`

    const blob = new Blob([template], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'plantilla_transacciones.csv'
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <main className="p-4 sm:p-6 md:p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-emerald-600 to-cyan-600 dark:from-emerald-400 dark:to-cyan-400 bg-clip-text text-transparent mb-2 flex items-center gap-2">
          <FileText className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
          Upload de Excel/CSV
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          Sube un archivo CSV con tus transacciones para registrarlas automáticamente
        </p>
      </div>

      {/* Template download */}
      <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
        <div className="flex items-start gap-3">
          <Download className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-1">
              ¿Primera vez?
            </h3>
            <p className="text-sm text-blue-700 dark:text-blue-400 mb-3">
              Descarga la plantilla de ejemplo para ver el formato correcto del CSV
            </p>
            <button
              onClick={downloadTemplate}
              className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Descargar Plantilla
            </button>
          </div>
        </div>
      </div>

      {/* Upload area */}
      <div className="relative overflow-hidden bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-8">
        <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 blur-3xl" />

        <div className="relative">
          {/* File input */}
          <label className="cursor-pointer block">
            <div className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all ${
              file
                ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                : 'border-gray-300 dark:border-gray-600 hover:border-emerald-500 dark:hover:border-emerald-500 hover:bg-gray-50 dark:hover:bg-gray-700/50'
            }`}>
              <Upload className={`w-16 h-16 mx-auto mb-4 ${
                file ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-400'
              }`} />

              {file ? (
                <div>
                  <p className="text-lg font-semibold text-emerald-700 dark:text-emerald-400 mb-1">
                    {file.name}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {(file.size / 1024).toFixed(1)} KB
                  </p>
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-2">
                    Click para cambiar archivo
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Click para seleccionar archivo CSV
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    o arrastra y suelta aquí
                  </p>
                </div>
              )}
            </div>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>

          {/* Upload button */}
          {file && (
            <button
              onClick={handleUpload}
              disabled={loading}
              className="w-full mt-6 p-4 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-xl font-bold text-lg hover:scale-[1.02] hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-200 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Procesando...
                </>
              ) : (
                <>
                  <Upload className="w-6 h-6" />
                  Subir y Registrar Transacciones
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Success message */}
      {result && (
        <div className="mt-6 p-6 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-400 rounded-xl border border-emerald-200 dark:border-emerald-800">
          <div className="flex items-start gap-3 mb-4">
            <CheckCircle2 className="w-6 h-6 mt-0.5" />
            <div>
              <h3 className="font-bold text-lg mb-1">¡Éxito!</h3>
              <p className="text-sm">{result.message}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
            <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-3">
              <p className="text-xs font-semibold opacity-70">Transacciones registradas</p>
              <p className="text-2xl font-bold">{result.count}</p>
            </div>
            {result.errors && result.errors.length > 0 && (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-3 border border-yellow-200 dark:border-yellow-800">
                <p className="text-xs font-semibold text-yellow-800 dark:text-yellow-400">Errores/Advertencias</p>
                <p className="text-2xl font-bold text-yellow-800 dark:text-yellow-400">{result.errors.length}</p>
              </div>
            )}
          </div>

          {result.errors && result.errors.length > 0 && (
            <div className="mt-4">
              <details className="cursor-pointer">
                <summary className="text-sm font-semibold">Ver detalles de errores</summary>
                <ul className="mt-2 space-y-1 text-xs">
                  {result.errors.map((err: string, i: number) => (
                    <li key={i} className="opacity-80">• {err}</li>
                  ))}
                </ul>
              </details>
            </div>
          )}
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-400 rounded-xl flex items-center gap-3 border border-red-200 dark:border-red-800">
          <AlertCircle className="w-5 h-5" />
          <span className="font-medium">{error}</span>
        </div>
      )}

      {/* Instructions */}
      <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
        <h3 className="font-bold text-gray-900 dark:text-white mb-3">
          📝 Formato del CSV
        </h3>
        <div className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
          <p><strong>Columnas requeridas:</strong></p>
          <ul className="list-disc list-inside ml-2 space-y-1">
            <li><code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">fecha</code> - Formato: YYYY-MM-DD (ej: 2025-10-06)</li>
            <li><code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">tipo</code> - "gasto" o "ingreso"</li>
            <li><code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">categoria</code> - Nombre de la categoría</li>
            <li><code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">monto</code> - Número (ej: 1200.50)</li>
          </ul>
          <p className="mt-3"><strong>Columnas opcionales:</strong></p>
          <ul className="list-disc list-inside ml-2 space-y-1">
            <li><code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">descripcion</code> - Texto libre</li>
            <li><code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">num_pax</code> - Número de pasajeros (para tours)</li>
            <li><code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">metodo_pago</code> - Efectivo, Tarjeta, Transferencia</li>
            <li><code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">registrado_por</code> - Nombre del usuario</li>
          </ul>
        </div>
      </div>
    </main>
  )
}
