'use client'

import { useEffect, useRef } from 'react'
import mermaid from 'mermaid'

interface MermaidProps {
  chart: string
}

export function Mermaid({ chart }: MermaidProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: true,
      theme: 'neutral',
      securityLevel: 'loose',
      fontFamily: 'system-ui',
    })

    if (ref.current) {
      try {
        const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`
        mermaid.render(id, chart).then(({ svg }) => {
          if (ref.current) {
            ref.current.innerHTML = svg
          }
        })
      } catch (error) {
        console.error('Mermaid rendering error:', error)
        if (ref.current) {
          ref.current.innerHTML = '<p class="text-red-500">Error rendering diagram</p>'
        }
      }
    }
  }, [chart])

  return <div ref={ref} className="mermaid-diagram flex justify-center my-8" />
}
