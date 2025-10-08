import { TrendingUp, TrendingDown, Wallet, Activity } from 'lucide-react'

interface KPICardProps {
  title: string
  value: number
  icon: 'income' | 'expense' | 'balance' | 'transactions'
  color: 'green' | 'red' | 'blue'
}

export function KPICard({ title, value, icon, color }: KPICardProps) {
  const colorClasses = {
    green: 'from-emerald-500/20 to-green-500/20 border-emerald-500/30 text-emerald-700 dark:text-emerald-400',
    red: 'from-red-500/20 to-rose-500/20 border-red-500/30 text-red-700 dark:text-red-400',
    blue: 'from-cyan-500/20 to-blue-500/20 border-cyan-500/30 text-cyan-700 dark:text-cyan-400',
  }

  const iconComponents = {
    income: TrendingUp,
    expense: TrendingDown,
    balance: Wallet,
    transactions: Activity,
  }

  const Icon = iconComponents[icon]

  return (
    <div
      className={`
        relative overflow-hidden
        p-6 rounded-3xl border-2
        bg-gradient-to-br ${colorClasses[color]}
        backdrop-blur-xl
        hover:scale-105 hover:shadow-2xl
        transition-all duration-300 ease-out
        group cursor-default
        shadow-xl
      `}
    >
      {/* Efecto glassmorphism INTENSO */}
      <div className="absolute inset-0 bg-white/70 dark:bg-gray-900/70 backdrop-blur-2xl -z-10" />

      {/* Capa adicional de cristal */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-white/20 dark:from-white/10 dark:via-transparent dark:to-white/5 -z-10" />

      {/* Círculo decorativo GRANDE */}
      <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-gradient-to-br from-white/40 to-transparent dark:from-white/20 blur-3xl" />

      {/* Segundo círculo */}
      <div className="absolute -left-4 -bottom-4 w-24 h-24 rounded-full bg-gradient-to-tl from-white/30 to-transparent dark:from-white/15 blur-2xl" />

      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-semibold opacity-90 tracking-wide uppercase">{title}</p>
        <div className="p-2 rounded-xl bg-white/40 dark:bg-gray-800/40 group-hover:scale-110 transition-transform duration-300">
          <Icon className="w-6 h-6" />
        </div>
      </div>

      <p className="text-3xl sm:text-4xl font-bold break-all">
        ${value.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
      </p>
    </div>
  )
}
