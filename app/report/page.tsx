'use client'

import { Mermaid } from '@/components/Mermaid'

export default function ReportPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-emerald-600 to-cyan-600 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            Zazil Tunich - Sistema de Gestión Financiera
          </h1>
          <p className="text-xl sm:text-2xl opacity-90">
            Registra tus gastos e ingresos hablando con tu teléfono
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">

        {/* Resumen Ejecutivo */}
        <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            📋 ¿Qué hace el sistema?
          </h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-8 leading-relaxed">
            Un sistema que te permite <strong>registrar gastos e ingresos usando Telegram</strong> —como si le hablaras a un contador.
            El bot entiende lo que dices, lo guarda automáticamente, y te envía reportes diarios de cómo va tu negocio.
          </p>

          {/* Tarjetas de beneficios */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-emerald-50 dark:bg-emerald-900/20 p-6 rounded-xl border-2 border-emerald-200 dark:border-emerald-800">
              <div className="text-4xl mb-3">⏱️</div>
              <div className="text-emerald-900 dark:text-emerald-100 font-semibold mb-2">Ahorra Tiempo</div>
              <div className="text-emerald-700 dark:text-emerald-300 text-sm">
                Registra gastos en 10 segundos hablando con el bot
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border-2 border-blue-200 dark:border-blue-800">
              <div className="text-4xl mb-3">🎯</div>
              <div className="text-blue-900 dark:text-blue-100 font-semibold mb-2">Automático</div>
              <div className="text-blue-700 dark:text-blue-300 text-sm">
                El bot categoriza y organiza todo por ti
              </div>
            </div>

            <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-xl border-2 border-purple-200 dark:border-purple-800">
              <div className="text-4xl mb-3">📊</div>
              <div className="text-purple-900 dark:text-purple-100 font-semibold mb-2">Siempre Visible</div>
              <div className="text-purple-700 dark:text-purple-300 text-sm">
                Dashboard con tus números actualizados 24/7
              </div>
            </div>
          </div>
        </section>

        {/* Cómo Funciona */}
        <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            💬 ¿Cómo lo usas?
          </h2>

          <div className="space-y-6">
            {/* Ejemplo 1: Registrar gasto */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                1️⃣ Le hablas al bot de Telegram
              </h3>
              <div className="bg-white dark:bg-gray-600 rounded-lg p-4 mb-4 border-l-4 border-blue-500">
                <p className="text-gray-800 dark:text-gray-200 font-mono">
                  Tú: "Gasté 500 en gasolina para la camioneta"
                </p>
              </div>
              <div className="bg-emerald-50 dark:bg-emerald-900/30 rounded-lg p-4 border-l-4 border-emerald-500">
                <p className="text-gray-800 dark:text-gray-200 mb-2">✅ Gasto registrado</p>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  💰 Monto: $500 MXN<br/>
                  📁 Categoría: Gasolina<br/>
                  📝 Descripción: Llenado camioneta<br/>
                  <br/>
                  <strong>Balance del día: $8,600 MXN</strong>
                </p>
              </div>
            </div>

            {/* Ejemplo 2: Registrar ingreso */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                2️⃣ También funciona para ingresos
              </h3>
              <div className="bg-white dark:bg-gray-600 rounded-lg p-4 mb-4 border-l-4 border-blue-500">
                <p className="text-gray-800 dark:text-gray-200 font-mono">
                  Tú: "Vendí un tour de 10 personas por 8,500 pesos, pagaron con tarjeta"
                </p>
              </div>
              <div className="bg-emerald-50 dark:bg-emerald-900/30 rounded-lg p-4 border-l-4 border-emerald-500">
                <p className="text-gray-800 dark:text-gray-200 mb-2">✅ Ingreso registrado</p>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  💵 Monto: $8,500 MXN<br/>
                  🏖️ Categoría: Tours<br/>
                  👥 Personas: 10<br/>
                  💳 Método: Tarjeta<br/>
                  <br/>
                  <strong>Balance del día: $17,100 MXN</strong>
                </p>
              </div>
            </div>

            {/* Ejemplo 3: Consultar */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                3️⃣ Pregúntale lo que sea
              </h3>
              <div className="bg-white dark:bg-gray-600 rounded-lg p-4 mb-4 border-l-4 border-blue-500">
                <p className="text-gray-800 dark:text-gray-200 font-mono">
                  Tú: "¿Cuánto he gastado hoy?"
                </p>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-4 border-l-4 border-blue-500">
                <p className="text-gray-800 dark:text-gray-200 text-sm">
                  Hoy has gastado $2,150 MXN:<br/>
                  • ⛽ Gasolina: $500<br/>
                  • 🛒 Compras: $1,200<br/>
                  • 💰 Comisiones: $450<br/>
                  <br/>
                  Tu balance del día es <strong>$6,350 MXN</strong> ✅
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Diagrama Simple */}
        <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            🔄 Flujo del Sistema
          </h2>

          <Mermaid chart={`
graph LR
    A[👤 Tú hablas<br/>con el bot] --> B[🤖 Bot entiende<br/>con IA]
    B --> C[💾 Se guarda<br/>automáticamente]
    C --> D[📊 Lo ves en<br/>el dashboard]

    style A fill:#10b981
    style B fill:#3b82f6
    style C fill:#8b5cf6
    style D fill:#f59e0b
          `} />

          <div className="mt-8 bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              Puedes enviar:
            </h3>
            <ul className="space-y-2 text-gray-700 dark:text-gray-300">
              <li className="flex items-start">
                <span className="mr-3">💬</span>
                <span><strong>Texto:</strong> "Gasté 500 en gasolina"</span>
              </li>
              <li className="flex items-start">
                <span className="mr-3">🎤</span>
                <span><strong>Voz:</strong> Le hablas y el bot te entiende</span>
              </li>
              <li className="flex items-start">
                <span className="mr-3">📸</span>
                <span><strong>Foto:</strong> Ticket/factura y el bot lo guarda</span>
              </li>
            </ul>
          </div>
        </section>

        {/* Reporte Diario */}
        <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            📨 Reporte Diario Automático
          </h2>

          <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
            Cada día a las <strong>6:00 PM</strong>, el bot te envía un resumen automático por Telegram:
          </p>

          <div className="bg-gray-900 text-green-400 rounded-xl p-6 font-mono text-sm overflow-x-auto">
            <pre>{`📊 REPORTE DIARIO - 5 de Octubre 2025

💵 INGRESOS: $12,500 MXN
   🏖️ Tours: $10,500 (13 clientes)
   🍽️ Comedor: $2,000

💸 GASTOS: $3,400 MXN
   ⛽ Gasolina: $500
   🛒 Compras: $1,200
   💰 Comisiones: $1,700

💰 BALANCE NETO: $9,100 MXN ✅

📈 ESTADÍSTICAS:
   👥 13 clientes
   💵 Promedio por cliente: $808 MXN
   💳 Efectivo: $2,100 (17%)
   🏦 Tarjeta: $10,400 (83%)

🔗 Ver dashboard: dashboard-zaziltunich.vercel.app`}</pre>
          </div>
        </section>

        {/* Dashboard */}
        <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            💻 Dashboard Web
          </h2>

          <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
            Accede desde cualquier computadora o celular para ver tus números en tiempo real:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-6 rounded-xl border-2 border-green-200 dark:border-green-800">
              <div className="text-sm text-green-700 dark:text-green-300 mb-1">Ingresos (Mes)</div>
              <div className="text-3xl font-bold text-green-900 dark:text-green-100">$245,000</div>
            </div>

            <div className="bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 p-6 rounded-xl border-2 border-red-200 dark:border-red-800">
              <div className="text-sm text-red-700 dark:text-red-300 mb-1">Gastos (Mes)</div>
              <div className="text-3xl font-bold text-red-900 dark:text-red-100">$180,000</div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 p-6 rounded-xl border-2 border-blue-200 dark:border-blue-800">
              <div className="text-sm text-blue-700 dark:text-blue-300 mb-1">Balance Neto</div>
              <div className="text-3xl font-bold text-blue-900 dark:text-blue-100">$65,000</div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 p-6 rounded-xl border-2 border-purple-200 dark:border-purple-800">
              <div className="text-sm text-purple-700 dark:text-purple-300 mb-1">Transacciones</div>
              <div className="text-3xl font-bold text-purple-900 dark:text-purple-100">287</div>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              Incluye:
            </h3>
            <ul className="space-y-2 text-gray-700 dark:text-gray-300">
              <li className="flex items-start">
                <span className="mr-3">📊</span>
                <span>Gráficas de tendencia (últimos 30 días)</span>
              </li>
              <li className="flex items-start">
                <span className="mr-3">📋</span>
                <span>Tabla completa de todas tus transacciones</span>
              </li>
              <li className="flex items-start">
                <span className="mr-3">🔍</span>
                <span>Filtros por fecha, categoría y tipo</span>
              </li>
              <li className="flex items-start">
                <span className="mr-3">📸</span>
                <span>Ver las fotos de tus facturas guardadas</span>
              </li>
              <li className="flex items-start">
                <span className="mr-3">🌙</span>
                <span>Modo claro/oscuro para trabajar de día o noche</span>
              </li>
            </ul>
          </div>
        </section>

        {/* Lo que se construyó */}
        <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            ✅ Lo que está listo
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 p-6 rounded-xl border-l-4 border-emerald-500">
              <div className="text-2xl mb-2">🤖</div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">Bot de Telegram</h3>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Registra gastos e ingresos hablando, escribiendo o enviando fotos
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 p-6 rounded-xl border-l-4 border-blue-500">
              <div className="text-2xl mb-2">💻</div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">Dashboard Web</h3>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                KPIs en tiempo real, gráficas y tabla completa de transacciones
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 p-6 rounded-xl border-l-4 border-purple-500">
              <div className="text-2xl mb-2">📨</div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">Reportes Automáticos</h3>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Reporte diario a las 6 PM con resumen completo del día
              </p>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 p-6 rounded-xl border-l-4 border-amber-500">
              <div className="text-2xl mb-2">💾</div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">Base de Datos</h3>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                150 transacciones de demo para que veas cómo funciona
              </p>
            </div>

            <div className="bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20 p-6 rounded-xl border-l-4 border-pink-500">
              <div className="text-2xl mb-2">📸</div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">Almacenamiento</h3>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Guarda fotos de facturas y tickets automáticamente
              </p>
            </div>

            <div className="bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 p-6 rounded-xl border-l-4 border-teal-500">
              <div className="text-2xl mb-2">📱</div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">Multi-dispositivo</h3>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Funciona en computadora, tablet y celular perfectamente
              </p>
            </div>
          </div>
        </section>

        {/* Cómo Funciona Por Dentro */}
        <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            🔧 Cómo funciona por dentro
          </h2>

          <p className="text-lg text-gray-700 dark:text-gray-300 mb-8 leading-relaxed">
            El sistema está construido con <strong>5 flujos de trabajo automáticos</strong> que trabajan en segundo plano
            para que tú solo te preocupes por hablar con el bot. Aquí te explicamos qué hace cada pieza:
          </p>

          {/* Workflow 1: Agente Telegram */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
              <span className="bg-emerald-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm">1</span>
              🤖 Agente de Telegram (El Cerebro)
            </h3>

            <p className="text-gray-700 dark:text-gray-300 mb-6">
              Este es el flujo principal. Cuando le hablas al bot, pasa por estas etapas:
            </p>

            <Mermaid chart={`
graph TD
    A[📱 Recibes mensaje<br/>en Telegram] --> B{¿Qué tipo<br/>de mensaje?}

    B -->|📸 Foto| C[Guardar foto<br/>en almacenamiento]
    B -->|💬 Texto| D[Leer tu mensaje]
    B -->|🎤 Voz| E[Convertir voz<br/>a texto]

    C --> F[Entender qué<br/>quieres hacer]
    E --> D
    D --> F

    F --> G{Intención}

    G -->|💸 Registrar Gasto| H[Guardar en<br/>base de datos]
    G -->|💵 Registrar Ingreso| H
    G -->|❓ Consultar Datos| I[Buscar en<br/>base de datos]
    G -->|✏️ Editar| J[Actualizar<br/>registro]

    H --> K[Calcular<br/>balance del día]
    I --> L[Responder con<br/>los datos]
    J --> K

    K --> M[📨 Enviarte<br/>respuesta]
    L --> M

    style A fill:#4CAF50,color:#fff
    style F fill:#9C27B0,color:#fff
    style H fill:#2196F3,color:#fff
    style M fill:#8BC34A,color:#fff
            `} />

            <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border-l-4 border-blue-500">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                <strong>💡 En resumen:</strong> El bot usa inteligencia artificial (GPT-4o-mini) para entender exactamente
                qué quieres hacer, sin importar cómo lo digas. Puede recibir texto, voz o fotos, y automáticamente
                registra, edita o consulta tus datos.
              </p>
            </div>
          </div>

          {/* Workflow 2: Reporte Diario */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
              <span className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm">2</span>
              📊 Reporte Diario Automático
            </h3>

            <p className="text-gray-700 dark:text-gray-300 mb-6">
              Todos los días a las <strong>6:00 PM</strong>, este flujo revisa todo lo que pasó en el día y te envía un resumen:
            </p>

            <Mermaid chart={`
graph TD
    A[⏰ 6:00 PM<br/>cada día] --> B[Buscar todas las<br/>transacciones del día]

    B --> C[Calcular totales]

    C --> D[💵 Total de<br/>ingresos]
    C --> E[💸 Total de<br/>gastos]
    C --> F[💰 Balance<br/>del día]

    D --> G[Ver detalles<br/>adicionales]
    E --> G
    F --> G

    G --> H[Por categorías:<br/>Tours, Gasolina, etc.]
    G --> I[Efectivo vs<br/>Tarjeta]
    G --> J[Comparar con<br/>el día anterior]

    H --> K[Armar mensaje<br/>con formato bonito]
    I --> K
    J --> K

    K --> L[📨 Enviarte por<br/>Telegram]

    style A fill:#FF9800,color:#fff
    style K fill:#2196F3,color:#fff
    style L fill:#8BC34A,color:#fff
            `} />

            <div className="mt-6 bg-purple-50 dark:bg-purple-900/20 rounded-xl p-6 border-l-4 border-purple-500">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                <strong>💡 En resumen:</strong> Sin que hagas nada, cada tarde recibes un mensaje automático con
                cuánto vendiste, cuánto gastaste, y si el día fue mejor o peor que ayer. Todo calculado y formateado para ti.
              </p>
            </div>
          </div>

          {/* Workflow 3: Reporte Semanal */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
              <span className="bg-purple-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm">3</span>
              📅 Reporte Semanal
            </h3>

            <p className="text-gray-700 dark:text-gray-300 mb-6">
              Cada <strong>lunes a las 8:00 AM</strong>, recibes un resumen de cómo te fue en toda la semana anterior:
            </p>

            <Mermaid chart={`
graph TD
    A[⏰ Lunes<br/>8:00 AM] --> B[Buscar transacciones<br/>de los últimos 7 días]

    B --> C[Calcular estadísticas<br/>de la semana]

    C --> D[💰 Total<br/>de la semana]
    C --> E[📊 Promedio<br/>por día]
    C --> F[🏆 Mejor día<br/>de la semana]
    C --> G[🏷️ Categoría más<br/>gastada]

    D --> H[Comparar con<br/>semana anterior]
    E --> H
    F --> H
    G --> H

    H --> I[Armar mensaje<br/>con resumen]
    I --> J[📨 Enviarte por<br/>Telegram]

    style A fill:#FF5722,color:#fff
    style H fill:#9C27B0,color:#fff
    style J fill:#8BC34A,color:#fff
            `} />

            <div className="mt-6 bg-amber-50 dark:bg-amber-900/20 rounded-xl p-6 border-l-4 border-amber-500">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                <strong>💡 En resumen:</strong> Te da una vista panorámica de la semana: cuál fue tu mejor día,
                en qué gastaste más, y si la semana fue mejor que la anterior. Perfecto para planear la siguiente.
              </p>
            </div>
          </div>

          {/* Workflow 4: Reporte Mensual */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
              <span className="bg-pink-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm">4</span>
              📆 Reporte Mensual (PDF Completo)
            </h3>

            <p className="text-gray-700 dark:text-gray-300 mb-6">
              El <strong>primer día de cada mes</strong>, el sistema genera un reporte completo del mes anterior con gráficas y tablas:
            </p>

            <Mermaid chart={`
graph TD
    A[⏰ Día 1<br/>del mes<br/>9:00 AM] --> B[Buscar todas las<br/>transacciones del<br/>mes anterior]

    B --> C[Calcular TODOS<br/>los números]

    C --> D[💵 Ingresos<br/>totales]
    C --> E[💸 Gastos por<br/>categoría]
    C --> F[👥 Total de<br/>clientes]
    C --> G[📈 Promedios y<br/>tendencias]

    D --> H[Crear gráficas<br/>y tablas]
    E --> H
    F --> H
    G --> H

    H --> I[📄 Generar documento<br/>PDF profesional]
    I --> J[☁️ Guardar en<br/>almacenamiento]
    J --> K[📨 Enviarte el link<br/>por Telegram]

    style A fill:#F44336,color:#fff
    style I fill:#9C27B0,color:#fff
    style K fill:#8BC34A,color:#fff
            `} />

            <div className="mt-6 bg-rose-50 dark:bg-rose-900/20 rounded-xl p-6 border-l-4 border-rose-500">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                <strong>💡 En resumen:</strong> Un reporte profesional en PDF que puedes descargar, imprimir o compartir.
                Incluye gráficas de barras, gráficas circulares, y una tabla con todas las transacciones del mes.
                Perfecto para tu contador o para tus registros.
              </p>
            </div>
          </div>

          {/* Workflow 5: Backup */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
              <span className="bg-gray-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm">5</span>
              🔐 Respaldo Automático
            </h3>

            <p className="text-gray-700 dark:text-gray-300 mb-6">
              Cada día a las <strong>3:00 AM</strong> (mientras duermes), el sistema hace una copia de seguridad de todos tus datos:
            </p>

            <Mermaid chart={`
graph TD
    A[⏰ 3:00 AM<br/>cada día] --> B[Hacer copia de<br/>toda la base de datos]

    B --> C[Comprimir datos<br/>para ahorrar espacio]
    C --> D[☁️ Guardar copia<br/>en almacenamiento seguro]

    D --> E{¿Hay más de<br/>30 copias?}

    E -->|Sí| F[Eliminar las<br/>copias más viejas]
    E -->|No| G[✅ Listo]

    F --> G

    style A fill:#607D8B,color:#fff
    style D fill:#2196F3,color:#fff
    style G fill:#8BC34A,color:#fff
            `} />

            <div className="mt-6 bg-teal-50 dark:bg-teal-900/20 rounded-xl p-6 border-l-4 border-teal-500">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                <strong>💡 En resumen:</strong> Tus datos están siempre protegidos. El sistema guarda automáticamente
                una copia completa cada día y mantiene los últimos 30 días por si algo pasa. Nunca perderás tu información.
              </p>
            </div>
          </div>

          {/* Base de Datos */}
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              💾 ¿Dónde se guardan tus datos?
            </h3>

            <p className="text-gray-700 dark:text-gray-300 mb-6">
              Todo está guardado de forma organizada en <strong>3 tablas principales</strong> en una base de datos segura (Supabase):
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 p-6 rounded-xl border-2 border-blue-200 dark:border-blue-800">
                <div className="text-3xl mb-3">📊</div>
                <h4 className="font-bold text-gray-900 dark:text-white mb-2">transacciones</h4>
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                  La tabla principal donde se guarda cada gasto e ingreso que registras.
                </p>
                <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                  <li>• Fecha y hora</li>
                  <li>• Tipo (gasto/ingreso)</li>
                  <li>• Monto y categoría</li>
                  <li>• Descripción</li>
                  <li>• Método de pago</li>
                  <li>• Link a foto (si enviaste)</li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 p-6 rounded-xl border-2 border-purple-200 dark:border-purple-800">
                <div className="text-3xl mb-3">🏷️</div>
                <h4 className="font-bold text-gray-900 dark:text-white mb-2">categorias</h4>
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                  Las 14 categorías predefinidas para organizar tus gastos e ingresos.
                </p>
                <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                  <li><strong>Gastos (8):</strong></li>
                  <li>Nómina, Mantenimiento, Compras, Gasolina, Comisiones, Publicidad, Servicios, Otros</li>
                  <li className="pt-2"><strong>Ingresos (6):</strong></li>
                  <li>Tours, Comedor, Reservaciones, Anticipos, Otros</li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 p-6 rounded-xl border-2 border-emerald-200 dark:border-emerald-800">
                <div className="text-3xl mb-3">📈</div>
                <h4 className="font-bold text-gray-900 dark:text-white mb-2">resumen_diario</h4>
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                  Vista automática que calcula los totales de cada día para reportes rápidos.
                </p>
                <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                  <li>• Total ingresos del día</li>
                  <li>• Total gastos del día</li>
                  <li>• Balance neto</li>
                  <li>• Número de transacciones</li>
                  <li>• Total de clientes</li>
                </ul>
              </div>
            </div>

            <div className="mt-8 bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
              <h4 className="font-bold text-gray-900 dark:text-white mb-3">📦 Almacenamiento de Archivos</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700 dark:text-gray-300">
                <div>
                  <span className="font-semibold">📸 Facturas:</span> Cuando envías fotos de tickets o facturas,
                  se guardan en una carpeta segura con acceso público para que puedas verlas cuando quieras.
                </div>
                <div>
                  <span className="font-semibold">🔐 Respaldos:</span> Las copias automáticas de toda tu base de datos
                  se guardan en una carpeta privada protegida. Solo tú puedes acceder a ellas.
                </div>
              </div>
            </div>
          </div>

          {/* Resumen Final */}
          <div className="bg-gradient-to-br from-emerald-50 to-cyan-50 dark:from-emerald-900/20 dark:to-cyan-900/20 rounded-xl p-6 border-2 border-emerald-300 dark:border-emerald-700">
            <h4 className="font-bold text-gray-900 dark:text-white mb-3 text-lg">✨ Todo trabaja en conjunto</h4>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Estos 5 flujos de trabajo están corriendo 24/7 en segundo plano. Tú solo hablas con el bot como si fuera
              un asistente humano, y todo lo demás (guardar datos, generar reportes, hacer respaldos) sucede automáticamente.
              El dashboard siempre muestra la información más reciente porque todos estos sistemas están conectados a la misma
              base de datos en tiempo real.
            </p>
          </div>
        </section>

        {/* Acceso */}
        <section className="bg-gradient-to-r from-emerald-600 to-cyan-600 text-white rounded-2xl shadow-xl p-8">
          <h2 className="text-3xl font-bold mb-6">
            🔗 Cómo acceder
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <h3 className="text-xl font-bold mb-3">💻 Dashboard Web</h3>
              <a
                href="https://dashboard-zaziltunich.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-200 hover:text-white underline text-lg break-all"
              >
                dashboard-zaziltunich.vercel.app
              </a>
              <p className="mt-3 text-emerald-100">
                🔐 Contraseña: <code className="bg-black/20 px-2 py-1 rounded">zaziltunich2025</code>
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <h3 className="text-xl font-bold mb-3">📱 Bot de Telegram</h3>
              <p className="text-cyan-100 mb-3">
                Busca el bot en Telegram y envía <code className="bg-black/20 px-2 py-1 rounded">/start</code>
              </p>
              <p className="text-sm text-emerald-100">
                (El token del bot está configurado y listo para conectarse)
              </p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <section className="text-center text-gray-600 dark:text-gray-400 py-8">
          <p className="mb-2">Sistema desarrollado para Zazil Tunich</p>
          <p className="text-sm">© 2025 · Todos los derechos reservados</p>
        </section>

      </div>
    </div>
  )
}
