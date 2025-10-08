'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Loader2, Upload, X } from 'lucide-react'

interface Message {
  role: 'user' | 'assistant'
  content: string
  images?: string[]
}

export default function AgentePage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [images, setImages] = useState<string[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    Array.from(files).forEach((file) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImages((prev) => [...prev, reader.result as string])
      }
      reader.readAsDataURL(file)
    })
  }

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() && images.length === 0) return

    const userMessage: Message = {
      role: 'user',
      content: input,
      images: images.length > 0 ? [...images] : undefined,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setImages([])
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: input,
          messages,
          images: userMessage.images,
        }),
      })

      const data = await res.json()

      if (data.response) {
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: data.response },
        ])
      } else if (data.error) {
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: `❌ Error: ${data.error}` },
        ])
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: '❌ Error al procesar tu mensaje. Intenta de nuevo.',
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex flex-col h-[calc(100vh-4rem)] max-w-5xl mx-auto p-4">
      {/* Header mejorado */}
      <div className="mb-4">
        <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-emerald-600 to-cyan-600 dark:from-emerald-400 dark:to-cyan-400 bg-clip-text text-transparent mb-2">
          🤖 Agente IA Financiero
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          Habla naturalmente para registrar gastos e ingresos
        </p>
      </div>

      {/* Chat messages con glassmorphism */}
      <div className="flex-1 relative overflow-hidden bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 overflow-y-auto p-4 space-y-4 mb-4">
        <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 blur-3xl pointer-events-none" />
        {messages.length === 0 && (
          <div className="text-center text-gray-500 dark:text-gray-400 mt-8 animate-fade-in">
            <div className="inline-block p-4 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 backdrop-blur-sm mb-4">
              <p className="text-4xl mb-2">👋</p>
            </div>
            <p className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
              ¡Hola! Soy tu asistente financiero
            </p>
            <p className="text-sm mb-6">
              Puedo ayudarte a registrar gastos e ingresos, validar tickets y consultar tus datos.
            </p>
            <div className="inline-flex flex-col gap-2 text-xs text-gray-600 dark:text-gray-400 bg-white/50 dark:bg-gray-700/50 rounded-xl p-4 backdrop-blur-sm">
              <p>💬 "Gasté 500 pesos en gasolina"</p>
              <p>📸 Sube una foto del ticket</p>
              <p>💰 "Vendí un tour de 8,500 pesos"</p>
            </div>
          </div>
        )}

        {messages.map((message, idx) => (
          <div
            key={idx}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-4 rounded-lg ${
                message.role === 'user'
                  ? 'bg-emerald-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
              }`}
            >
              {message.images && message.images.length > 0 && (
                <div className="flex gap-2 mb-2 flex-wrap">
                  {message.images.map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      alt={`Upload ${i + 1}`}
                      className="max-w-[200px] rounded-lg"
                    />
                  ))}
                </div>
              )}
              <p className="whitespace-pre-wrap">{message.content}</p>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg flex items-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin text-emerald-500" />
              <span className="text-gray-700 dark:text-gray-300">Procesando...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Image previews */}
      {images.length > 0 && (
        <div className="flex gap-2 mb-2 overflow-x-auto p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
          {images.map((img, idx) => (
            <div key={idx} className="relative">
              <img src={img} alt={`Preview ${idx + 1}`} className="h-20 rounded-lg" />
              <button
                onClick={() => removeImage(idx)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Input form */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <label className="cursor-pointer">
          <div className="p-3 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
            <Upload className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </div>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            className="hidden"
          />
        </label>

        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Escribe tu mensaje..."
          disabled={loading}
          className="flex-1 p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 disabled:opacity-50"
        />

        <button
          type="submit"
          disabled={loading || (!input.trim() && images.length === 0)}
          className="p-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-lg hover:from-emerald-600 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </main>
  )
}
