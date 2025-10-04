"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AnalysisResult() {
  const [confidence, setConfidence] = useState(0.0)
  const [label, setLabel] = useState<string>("Awaiting analysis…")

  useEffect(() => {
    const onResult = (e: Event) => {
      const detail = (e as CustomEvent).detail as { confidence: number; label: string }
      setLabel(detail.label)
      // animate confidence progress
      const target = detail.confidence
      let current = 0
      const step = () => {
        current += 0.02
        if (current >= target) current = target
        setConfidence(Number(current.toFixed(3)))
        if (current < target) requestAnimationFrame(step)
      }
      requestAnimationFrame(step)
    }
    window.addEventListener("analysis:result", onResult as EventListener)
    return () => window.removeEventListener("analysis:result", onResult as EventListener)
  }, [])

  const pct = Math.round(confidence * 100)
  const radius = 64
  const circumference = 2 * Math.PI * radius
  const dash = circumference * confidence

  return (
    <Card className="glass glow-accent">
      <CardHeader>
        <CardTitle className="text-xl md:text-2xl">Analysis Result</CardTitle>
      </CardHeader>
      <CardContent className="grid md:grid-cols-[200px_1fr] gap-8 items-center">
        <div className="relative w-[180px] h-[180px] mx-auto">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <circle
              cx="100"
              cy="100"
              r={radius}
              className="fill-none"
              stroke="oklch(0.2 0.03 260)"
              strokeWidth="12"
              opacity={0.4}
            />
            <circle
              cx="100"
              cy="100"
              r={radius}
              className="fill-none"
              stroke="oklch(0.78 0.14 190)"
              strokeWidth="12"
              strokeDasharray={`${dash} ${circumference - dash}`}
              strokeLinecap="round"
              style={{ transition: "stroke-dasharray 600ms ease" }}
            />
            <defs>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-3xl font-semibold">{pct}%</div>
              <div className="text-xs text-muted-foreground">confidence</div>
            </div>
          </div>
        </div>
        <div>
          <p className="text-lg md:text-xl">
            {label === "Awaiting analysis…"
              ? "Run an analysis from the Upload section to see results."
              : `✅ ${label} (${pct}%)`}
          </p>
          <div className="mt-4 h-2 w-full rounded-full bg-muted overflow-hidden">
            <div className="h-full bg-[oklch(0.78_0.14_190)] transition-all" style={{ width: `${pct}%` }} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
