'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff } from 'lucide-react'

export default function LoginPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })

    if (res.ok) {
      router.push('/')
      router.refresh()
    } else {
      setError('Contraseña incorrecta')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-800 p-4">
      <div className="bg-gradient-to-b from-gray-900 to-black border border-gray-800 p-8 sm:p-10 rounded-2xl shadow-2xl w-full max-w-md backdrop-blur-sm">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-full flex items-center justify-center mb-4 shadow-lg shadow-emerald-500/50">
            <span className="text-2xl">🏛️</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2 tracking-tight">
            Zazil Tunich
          </h1>
          <p className="text-gray-400 text-center text-sm sm:text-base">
            Dashboard Financiero Empresarial
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
              Contraseña de Acceso
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingresa tu contraseña"
                className="w-full p-4 pr-12 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-base outline-none"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors p-1"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-900/30 border border-red-800 rounded-lg p-3">
              <p className="text-red-400 text-sm text-center font-medium">{error}</p>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-white p-4 rounded-xl hover:from-emerald-600 hover:to-cyan-600 transition-all font-semibold shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 transform hover:scale-[1.02]"
          >
            Ingresar al Dashboard
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-800">
          <p className="text-gray-500 text-xs text-center">
            Sistema protegido · Zazil Tunich © 2025
          </p>
        </div>
      </div>
    </div>
  )
}
