"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts"
import { useMemo } from "react"

export default function Visualization() {
  // Fake transit light curve
  const data = useMemo(() => {
    const arr: Array<{ t: number; intensity: number }> = []
    for (let t = 0; t <= 100; t++) {
      // base curve with a dip between t=40..60
      const dipCenter = 50
      const depth = 0.03
      const width = 10
      const dip = Math.exp(-((t - dipCenter) ** 2) / (2 * width ** 2)) * depth
      const noise = (Math.random() - 0.5) * 0.002
      const intensity = 1 - dip + noise
      arr.push({ t, intensity: Number(intensity.toFixed(4)) })
    }
    return arr
  }, [])

  return (
    <div className="grid lg:grid-cols-[2fr_1fr] gap-8">
      <Card className="glass glow-accent">
        <CardHeader>
          <CardTitle className="text-xl md:text-2xl">Light Curve: Intensity vs. Time</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px] md:h-[380px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid stroke="color-mix(in oklch, var(--color-border) 60%, transparent)" strokeDasharray="3 3" />
              <XAxis dataKey="t" tick={{ fill: "oklch(0.925 0 0)" }} />
              <YAxis domain={[0.96, 1.01]} tick={{ fill: "oklch(0.925 0 0)" }} />
              <Tooltip
                contentStyle={{
                  background: "oklch(0.108 0.002 0)",
                  border: "1px solid oklch(0.687 0.18 45)",
                  color: "oklch(0.925 0 0)",
                }}
              />
              <Line type="monotone" dataKey="intensity" stroke="oklch(0.687 0.18 45)" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="glass glow-primary">
        <CardHeader>
          <CardTitle className="text-xl md:text-2xl">Orbital Visualization</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px] md:h-[380px] grid place-items-center">
          {/* Simple radial orbit */}
          <div className="relative w-64 h-64">
            <div className="absolute inset-0 rounded-full border neon-border" />
            <div className="absolute inset-8 rounded-full border neon-border opacity-60" />
            <div className="absolute inset-[72px] rounded-full border neon-border opacity-40" />
            {/* star */}
            <div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[oklch(0.780_0.14_65)] glow-accent"
              aria-label="Star"
            />
            {/* planet animating */}
            <div
              className="absolute left-1/2 top-0 -translate-x-1/2 w-3 h-3 rounded-full bg-[oklch(0.687_0.18_45)] glow-primary animate-[spin_8s_linear_infinite] origin-[50%_128px]"
              aria-label="Planet"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
