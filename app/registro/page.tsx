'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Upload, Loader2, CheckCircle2, XCircle } from 'lucide-react'

const CATEGORIAS_GASTOS = [
  'Nómina', 'Mantenimiento', 'Compras', 'Gasolina',
  'Comisiones', 'Publicidad', 'Servicios', 'Otros Gastos'
]

const CATEGORIAS_INGRESOS = [
  'Tours', 'Comedor', 'Reservaciones', 'Anticipos', 'Otros Ingresos'
]

const USUARIOS = [
  'Armando', 'Esposa', 'Hijo 1', 'Hijo 2', 'Hijo 3'
]

const METODOS_PAGO = ['Efectivo', 'Tarjeta', 'Transferencia']

export default function RegistroPage() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const [tipo, setTipo] = useState<'gasto' | 'ingreso'>('gasto')
  const [monto, setMonto] = useState('')
  const [categoria, setCategoria] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [metodo_pago, setMetodoPago] = useState('Efectivo')
  const [registrado_por, setRegistradoPor] = useState('Armando')
  const [foto, setFoto] = useState<File | null>(null)
  const [fotoPreview, setFotoPreview] = useState<string | null>(null)

  const categoriasActuales = tipo === 'gasto' ? CATEGORIAS_GASTOS : CATEGORIAS_INGRESOS

  const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFoto(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setFotoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess(false)

    try {
      // Validaciones
      if (!monto || parseFloat(monto) <= 0) {
        throw new Error('El monto debe ser mayor a 0')
      }
      if (!categoria) {
        throw new Error('Debe seleccionar una categoría')
      }

      let foto_url = null

      // Subir foto a Supabase Storage si existe
      if (foto) {
        const fileName = `${Date.now()}-${foto.name}`
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('facturas')
          .upload(fileName, foto)

        if (uploadError) throw uploadError

        // Obtener URL pública
        const { data: { publicUrl } } = supabase.storage
          .from('facturas')
          .getPublicUrl(fileName)

        foto_url = publicUrl
      }

      // Insertar transacción en BD
      const { error: insertError } = await supabase
        .from('transacciones')
        .insert({
          tipo,
          monto: parseFloat(monto),
          categoria,
          descripcion: descripcion || null,
          metodo_pago,
          registrado_por,
          foto_url,
          fecha_hora: new Date().toISOString(),
        })

      if (insertError) throw insertError

      setSuccess(true)

      // Limpiar formulario
      setMonto('')
      setCategoria('')
      setDescripcion('')
      setFoto(null)
      setFotoPreview(null)

      // Reset success después de 3 segundos
      setTimeout(() => setSuccess(false), 3000)
    } catch (err: any) {
      setError(err.message || 'Error al registrar transacción')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="p-4 sm:p-6 md:p-8 max-w-3xl mx-auto">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6">
        Registrar Transacción
      </h2>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 space-y-6">
        {/* Tipo de transacción */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Tipo de Transacción
          </label>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => {
                setTipo('gasto')
                setCategoria('')
              }}
              className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg ${
                tipo === 'gasto'
                  ? 'bg-red-500 text-white ring-2 ring-red-600'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              Gasto
            </button>
            <button
              type="button"
              onClick={() => {
                setTipo('ingreso')
                setCategoria('')
              }}
              className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg ${
                tipo === 'ingreso'
                  ? 'bg-green-500 text-white ring-2 ring-green-600'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              Ingreso
            </button>
          </div>
        </div>

        {/* Monto */}
        <div>
          <label htmlFor="monto" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Monto (MXN) *
          </label>
          <input
            type="number"
            id="monto"
            value={monto}
            onChange={(e) => setMonto(e.target.value)}
            step="0.01"
            min="0"
            required
            className="w-full p-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
            placeholder="0.00"
          />
        </div>

        {/* Categoría */}
        <div>
          <label htmlFor="categoria" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Categoría *
          </label>
          <select
            id="categoria"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            required
            className="w-full p-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
          >
            <option value="">Seleccionar categoría...</option>
            {categoriasActuales.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Descripción */}
        <div>
          <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Descripción
          </label>
          <textarea
            id="descripcion"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            rows={3}
            className="w-full p-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
            placeholder="Detalles adicionales..."
          />
        </div>

        {/* Método de pago */}
        <div>
          <label htmlFor="metodo_pago" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Método de Pago
          </label>
          <select
            id="metodo_pago"
            value={metodo_pago}
            onChange={(e) => setMetodoPago(e.target.value)}
            className="w-full p-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
          >
            {METODOS_PAGO.map((metodo) => (
              <option key={metodo} value={metodo}>
                {metodo}
              </option>
            ))}
          </select>
        </div>

        {/* Registrado por */}
        <div>
          <label htmlFor="registrado_por" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Registrado Por
          </label>
          <select
            id="registrado_por"
            value={registrado_por}
            onChange={(e) => setRegistradoPor(e.target.value)}
            className="w-full p-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
          >
            {USUARIOS.map((usuario) => (
              <option key={usuario} value={usuario}>
                {usuario}
              </option>
            ))}
          </select>
        </div>

        {/* Upload foto */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Foto del Ticket/Factura (opcional)
          </label>
          <div className="flex items-center gap-4">
            <label className="flex-1 cursor-pointer">
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-emerald-500 transition-colors">
                <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {foto ? foto.name : 'Click para subir imagen'}
                </span>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleFotoChange}
                className="hidden"
              />
            </label>
          </div>
          {fotoPreview && (
            <div className="mt-4">
              <img src={fotoPreview} alt="Preview" className="max-w-xs rounded-lg shadow-md" />
            </div>
          )}
        </div>

        {/* Success/Error messages */}
        {success && (
          <div className="flex items-center gap-2 p-4 bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-400 rounded-lg">
            <CheckCircle2 className="w-5 h-5" />
            <span>¡Transacción registrada exitosamente!</span>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 p-4 bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-400 rounded-lg">
            <XCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        )}

        {/* Submit button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-6 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-lg font-semibold hover:from-emerald-600 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Registrando...
            </>
          ) : (
            <>Registrar {tipo === 'gasto' ? 'Gasto' : 'Ingreso'}</>
          )}
        </button>
      </form>
    </main>
  )
}
