import { useState, useCallback, useRef } from 'react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  images?: string[]
  isStreaming?: boolean
  isThinking?: boolean  // ✨ Nuevo: indica si está en modo pensamiento
}

interface UseEnhancedChatReturn {
  messages: Message[]
  isLoading: boolean
  isStreaming: boolean
  isThinking: boolean  // ✨ Nuevo: estado global de pensamiento
  sendMessage: (message: string, images?: string[]) => Promise<void>
  stopGeneration: () => void
  clearMessages: () => void
}

export function useEnhancedChat(): UseEnhancedChatReturn {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isStreaming, setIsStreaming] = useState(false)
  const [isThinking, setIsThinking] = useState(false)  // ✨ Nuevo: estado de pensamiento
  const abortControllerRef = useRef<AbortController | null>(null)

  const stopGeneration = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
    }
    setIsStreaming(false)
    setIsLoading(false)
    setIsThinking(false)  // ✨ Reset thinking state
  }, [])

  const sendMessage = useCallback(async (userMessage: string, images?: string[]) => {
    if (!userMessage.trim() && (!images || images.length === 0)) return

    // Agregar mensaje del usuario
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: userMessage,
      images: images && images.length > 0 ? images : undefined,
    }

    setMessages(prev => [...prev, userMsg])
    setIsLoading(true)

    // Crear mensaje del asistente vacío para streaming
    const assistantMsgId = (Date.now() + 1).toString()
    const assistantMsg: Message = {
      id: assistantMsgId,
      role: 'assistant',
      content: '',
      isStreaming: true,
    }

    setMessages(prev => [...prev, assistantMsg])

    try {
      abortControllerRef.current = new AbortController()

      const response = await fetch('/api/chat/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          messages: messages.slice(-10), // Últimos 10 mensajes
          images,
        }),
        signal: abortControllerRef.current.signal,
      })

      if (!response.ok || !response.body) {
        throw new Error('Error en respuesta del servidor')
      }

      setIsStreaming(true)
      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let accumulatedContent = ''

      while (true) {
        const { done, value } = await reader.read()

        if (done) {
          setIsStreaming(false)
          break
        }

        const chunk = decoder.decode(value, { stream: true })
        const lines = chunk.split('\n')

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6))

              // ✨ Detectar modo pensamiento
              if (data.thinking !== undefined) {
                setIsThinking(data.thinking)
                setMessages(prev =>
                  prev.map(msg =>
                    msg.id === assistantMsgId
                      ? { ...msg, isThinking: data.thinking }
                      : msg
                  )
                )
              }

              if (data.chunk) {
                accumulatedContent += data.chunk

                setMessages(prev =>
                  prev.map(msg =>
                    msg.id === assistantMsgId
                      ? { ...msg, content: accumulatedContent, isThinking: false }
                      : msg
                  )
                )
              }

              if (data.done) {
                setIsThinking(false)
                setMessages(prev =>
                  prev.map(msg =>
                    msg.id === assistantMsgId
                      ? { ...msg, isStreaming: false, isThinking: false }
                      : msg
                  )
                )
              }
            } catch (e) {
              // Ignorar errores de parsing
            }
          }
        }
      }
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.log('Generación detenida por el usuario')
      } else {
        setMessages(prev =>
          prev.map(msg =>
            msg.id === assistantMsgId
              ? { ...msg, content: '❌ Error al procesar. Intenta de nuevo.', isStreaming: false }
              : msg
          )
        )
      }
    } finally {
      setIsLoading(false)
      setIsStreaming(false)
      setIsThinking(false)  // ✨ Reset thinking state
      abortControllerRef.current = null
    }
  }, [messages])

  const clearMessages = useCallback(() => {
    setMessages([])
  }, [])

  return {
    messages,
    isLoading,
    isStreaming,
    isThinking,  // ✨ Exponer estado de pensamiento
    sendMessage,
    stopGeneration,
    clearMessages,
  }
}
