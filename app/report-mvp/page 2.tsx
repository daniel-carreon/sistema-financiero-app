'use client'

import Link from 'next/link'
import { CheckCircle2, Sparkles, Zap, TrendingUp, FileText, Upload, Camera, Brain } from 'lucide-react'

export default function ReportMVPPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-emerald-600 via-cyan-600 to-blue-600 text-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-block mb-6">
            <div className="flex items-center gap-3 bg-white/20 backdrop-blur-sm rounded-full px-6 py-3">
              <Sparkles className="w-6 h-6" />
              <span className="font-semibold">MVP Completado</span>
            </div>
          </div>

          <h1 className="text-4xl sm:text-6xl font-bold mb-6 leading-tight">
            Sistema de Gestión Financiera<br/>
            <span className="text-emerald-200">Zazil Tunich</span>
          </h1>

          <p className="text-xl sm:text-2xl opacity-90 max-w-3xl mx-auto leading-relaxed">
            Dashboard completo para registrar, visualizar y analizar todos los gastos e ingresos de tu negocio
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">

        {/* Resumen Ejecutivo */}
        <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 sm:p-12 border-t-4 border-emerald-500">
          <div className="flex items-center gap-3 mb-6">
            <CheckCircle2 className="w-10 h-10 text-emerald-600" />
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
              ✅ Sistema 100% Funcional
            </h2>
          </div>

          <p className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed mb-8">
            Tu sistema financiero está <strong>completamente operativo</strong>. Puedes comenzar a usarlo hoy mismo
            para registrar transacciones, visualizar reportes y tomar decisiones informadas sobre tu negocio.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 p-6 rounded-xl text-center border-2 border-emerald-200 dark:border-emerald-800">
              <div className="text-5xl font-bold text-emerald-600 dark:text-emerald-400 mb-2">8</div>
              <div className="text-gray-700 dark:text-gray-300 font-semibold">Funcionalidades<br/>Implementadas</div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 p-6 rounded-xl text-center border-2 border-blue-200 dark:border-blue-800">
              <div className="text-5xl font-bold text-blue-600 dark:text-blue-400 mb-2">0</div>
              <div className="text-gray-700 dark:text-gray-300 font-semibold">Errores de<br/>Compilación</div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 p-6 rounded-xl text-center border-2 border-purple-200 dark:border-purple-800">
              <div className="text-5xl font-bold text-purple-600 dark:text-purple-400 mb-2">6</div>
              <div className="text-gray-700 dark:text-gray-300 font-semibold">APIs<br/>Activas</div>
            </div>
          </div>
        </section>

        {/* Roadmap de Funcionalidades */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              🚀 Roadmap de Implementación
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Todo lo que se construyó para tu sistema financiero
            </p>
          </div>

          <div className="space-y-6">
            {/* Feature 1 */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sm:p-8 border-l-4 border-emerald-500 hover:shadow-2xl transition-shadow">
              <div className="flex items-start gap-4">
                <div className="bg-emerald-100 dark:bg-emerald-900/30 p-3 rounded-lg">
                  <TrendingUp className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard Principal</h3>
                    <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold px-3 py-1 rounded-full">
                      IMPLEMENTADO
                    </span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                    Panel de control con KPIs en tiempo real que muestra ingresos, gastos, balance neto y transacciones totales.
                    Incluye gráficas de tendencia de los últimos 30 días y vistas por día, semana y mes.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm px-3 py-1 rounded">
                      📊 Gráficas interactivas
                    </span>
                    <span className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm px-3 py-1 rounded">
                      📈 Tendencias visuales
                    </span>
                    <span className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm px-3 py-1 rounded">
                      🌙 Modo oscuro
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sm:p-8 border-l-4 border-blue-500 hover:shadow-2xl transition-shadow">
              <div className="flex items-start gap-4">
                <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg">
                  <FileText className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Registro Manual de Transacciones</h3>
                    <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-bold px-3 py-1 rounded-full">
                      IMPLEMENTADO
                    </span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                    Formulario completo para registrar gastos e ingresos manualmente. Soporta categorías predefinidas,
                    métodos de pago, número de pasajeros para tours y registro de quién hizo la transacción.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm px-3 py-1 rounded">
                      ✏️ Formulario completo
                    </span>
                    <span className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm px-3 py-1 rounded">
                      🏷️ 14 categorías
                    </span>
                    <span className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm px-3 py-1 rounded">
                      👥 Tracking de usuarios
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sm:p-8 border-l-4 border-purple-500 hover:shadow-2xl transition-shadow">
              <div className="flex items-start gap-4">
                <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-lg">
                  <Zap className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Corte Diario de Ingresos</h3>
                    <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 text-xs font-bold px-3 py-1 rounded-full">
                      IMPLEMENTADO
                    </span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                    Sistema de registro rápido para ingresos del día. Permite registrar múltiples tours o ventas
                    en batch con información de clientes, métodos de pago y cálculos automáticos de totales.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm px-3 py-1 rounded">
                      ⚡ Registro rápido
                    </span>
                    <span className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm px-3 py-1 rounded">
                      💵 Batch processing
                    </span>
                    <span className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm px-3 py-1 rounded">
                      🧮 Cálculos automáticos
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 4 - NEW */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sm:p-8 border-l-4 border-cyan-500 hover:shadow-2xl transition-shadow relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-cyan-500 text-white text-xs font-bold px-4 py-1 rounded-bl-lg">
                NUEVO
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-cyan-100 dark:bg-cyan-900/30 p-3 rounded-lg">
                  <Upload className="w-8 h-8 text-cyan-600 dark:text-cyan-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Upload de CSV/Excel</h3>
                    <span className="bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-400 text-xs font-bold px-3 py-1 rounded-full">
                      IMPLEMENTADO
                    </span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                    Importa múltiples transacciones desde archivos CSV. Incluye plantilla descargable, validación
                    automática de datos, drag & drop, y reporte detallado de éxitos y errores.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm px-3 py-1 rounded">
                      📄 Plantilla incluida
                    </span>
                    <span className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm px-3 py-1 rounded">
                      ✅ Validación automática
                    </span>
                    <span className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm px-3 py-1 rounded">
                      📊 Import batch
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 5 - NEW */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sm:p-8 border-l-4 border-pink-500 hover:shadow-2xl transition-shadow relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-pink-500 text-white text-xs font-bold px-4 py-1 rounded-bl-lg">
                MEJORADO
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-pink-100 dark:bg-pink-900/30 p-3 rounded-lg">
                  <Camera className="w-8 h-8 text-pink-600 dark:text-pink-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">OCR con GPT-4 Vision</h3>
                    <span className="bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-400 text-xs font-bold px-3 py-1 rounded-full">
                      IMPLEMENTADO
                    </span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                    Sube fotos de tickets o facturas y el sistema automáticamente extrae: monto, comercio,
                    categoría sugerida, ítems comprados y fecha. Devuelve datos estructurados en JSON para uso programático.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm px-3 py-1 rounded">
                      🤖 AI-powered OCR
                    </span>
                    <span className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm px-3 py-1 rounded">
                      📸 Auto-extracción
                    </span>
                    <span className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm px-3 py-1 rounded">
                      🏷️ Categorización IA
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 6 - NEW */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sm:p-8 border-l-4 border-amber-500 hover:shadow-2xl transition-shadow relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-amber-500 text-white text-xs font-bold px-4 py-1 rounded-bl-lg">
                NUEVO
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-amber-100 dark:bg-amber-900/30 p-3 rounded-lg">
                  <Brain className="w-8 h-8 text-amber-600 dark:text-amber-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Verificación Inteligente de Montos</h3>
                    <span className="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs font-bold px-3 py-1 rounded-full">
                      IMPLEMENTADO
                    </span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                    Cuando registras un gasto con foto, el sistema compara el monto que declaraste con el del ticket.
                    Si hay diferencia mayor a $50 MXN, te pregunta cuál es el correcto antes de registrar.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm px-3 py-1 rounded">
                      🔍 Comparación automática
                    </span>
                    <span className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm px-3 py-1 rounded">
                      ⚠️ Alertas de discrepancia
                    </span>
                    <span className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm px-3 py-1 rounded">
                      ✅ Validación manual
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 7 */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sm:p-8 border-l-4 border-indigo-500 hover:shadow-2xl transition-shadow">
              <div className="flex items-start gap-4">
                <div className="bg-indigo-100 dark:bg-indigo-900/30 p-3 rounded-lg">
                  <Sparkles className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Agente IA Conversacional</h3>
                    <span className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 text-xs font-bold px-3 py-1 rounded-full">
                      IMPLEMENTADO
                    </span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                    Chat inteligente que entiende lenguaje natural. Registra gastos e ingresos hablando
                    de forma conversacional, con streaming en tiempo real y almacenamiento automático en base de datos.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm px-3 py-1 rounded">
                      💬 Lenguaje natural
                    </span>
                    <span className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm px-3 py-1 rounded">
                      🌊 Streaming SSE
                    </span>
                    <span className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm px-3 py-1 rounded">
                      🧠 GPT-5
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 8 */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sm:p-8 border-l-4 border-teal-500 hover:shadow-2xl transition-shadow">
              <div className="flex items-start gap-4">
                <div className="bg-teal-100 dark:bg-teal-900/30 p-3 rounded-lg">
                  <TrendingUp className="w-8 h-8 text-teal-600 dark:text-teal-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Vistas de Datos Personalizadas</h3>
                    <span className="bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 text-xs font-bold px-3 py-1 rounded-full">
                      IMPLEMENTADO
                    </span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                    Filtra transacciones por día, semana, mes o rango personalizado. Tablas agrupadas con colores
                    diferenciados (verde para ingresos, rojo para gastos) y totales por período.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm px-3 py-1 rounded">
                      📅 Filtros temporales
                    </span>
                    <span className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm px-3 py-1 rounded">
                      🎨 Colores diferenciados
                    </span>
                    <span className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm px-3 py-1 rounded">
                      📊 Agrupación inteligente
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stack Tecnológico */}
        <section className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl p-8 sm:p-12 text-white">
          <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-center">
            🔧 Stack Tecnológico
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div className="text-emerald-400 font-bold mb-2">Frontend</div>
              <ul className="space-y-1 text-gray-300 text-sm">
                <li>• Next.js 15.5.4 (App Router)</li>
                <li>• React 19 + TypeScript</li>
                <li>• Tailwind CSS v4</li>
                <li>• Recharts (gráficas)</li>
              </ul>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div className="text-blue-400 font-bold mb-2">Backend & Database</div>
              <ul className="space-y-1 text-gray-300 text-sm">
                <li>• Next.js API Routes</li>
                <li>• Supabase (PostgreSQL)</li>
                <li>• Supabase Storage</li>
                <li>• Server-Sent Events (SSE)</li>
              </ul>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div className="text-purple-400 font-bold mb-2">IA & Servicios</div>
              <ul className="space-y-1 text-gray-300 text-sm">
                <li>• OpenRouter API</li>
                <li>• GPT-4o (Vision OCR)</li>
                <li>• GPT-4o-mini (Chat)</li>
                <li>• Function Calling</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Cómo Empezar */}
        <section className="bg-gradient-to-r from-emerald-600 via-cyan-600 to-blue-600 text-white rounded-2xl shadow-2xl p-8 sm:p-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-center">
            🎯 Cómo Empezar a Usar el Sistema
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <span className="bg-white text-emerald-600 rounded-full w-8 h-8 flex items-center justify-center text-lg">1</span>
                Accede al Dashboard
              </h3>
              <p className="text-emerald-100 mb-4">
                Abre tu navegador y visita el dashboard web:
              </p>
              <Link
                href="/"
                className="block bg-white text-emerald-600 px-6 py-3 rounded-lg font-bold text-center hover:bg-emerald-50 transition-colors"
              >
                Ir al Dashboard →
              </Link>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <span className="bg-white text-blue-600 rounded-full w-8 h-8 flex items-center justify-center text-lg">2</span>
                Explora las Funcionalidades
              </h3>
              <p className="text-blue-100 mb-4">
                Desde el menú superior, accede a:
              </p>
              <ul className="space-y-2 text-cyan-100">
                <li>• 📊 Dashboard - Visualiza KPIs</li>
                <li>• ✏️ Registro - Agrega transacciones</li>
                <li>• 📅 Corte Diario - Ingresos rápidos</li>
                <li>• 📄 Upload CSV - Importa en batch</li>
                <li>• 🤖 Agente IA - Conversa y registra</li>
              </ul>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
            <p className="text-lg mb-4">
              ¿Necesitas ayuda? Revisa la documentación técnica completa
            </p>
            <Link
              href="/report"
              className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-bold hover:bg-blue-50 transition-colors"
            >
              Ver Reporte Técnico Completo →
            </Link>
          </div>
        </section>

        {/* Footer */}
        <section className="text-center text-gray-600 dark:text-gray-400 pt-8 border-t border-gray-200 dark:border-gray-700">
          <p className="text-lg mb-2">
            Sistema desarrollado para <strong>Zazil Tunich</strong>
          </p>
          <p className="text-sm">
            MVP completado y funcional · Octubre 2025
          </p>
        </section>
      </div>
    </div>
  )
}
