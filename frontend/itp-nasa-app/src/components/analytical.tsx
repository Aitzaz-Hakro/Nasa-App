"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { motion } from "framer-motion"

export default function AnalysisResult() {
  const [confidence, setConfidence] = useState(0.0)
  const [label, setLabel] = useState<string>("Awaiting analysis…")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchAnalysis = async () => {
      setLoading(true)
      try {
              const apiUrl = process.env.NEXT_PUBLIC_API_URL || `http://localhost:8000`
        const res = await fetch(`http://${apiUrl}/api/planet-analysis`)
        const data = await res.json()
        setLabel(data.label)
        // Smoothly animate confidence
        const target = data.confidence
        let current = 0
        const step = () => {
          current += 0.02
          if (current >= target) current = target
          setConfidence(Number(current.toFixed(3)))
          if (current < target) requestAnimationFrame(step)
        }
        requestAnimationFrame(step)
      } catch (error) {
        console.error("Error fetching analysis:", error)
        setLabel("Error fetching data from backend.")
      } finally {
        setLoading(false)
      }
    }

    fetchAnalysis()
  }, [])

  const pct = Math.round(confidence * 100)
  const data = [
    { name: "Probability of Confirmation", value: pct },
    { name: "Probability of Not Confirmation", value: 100 - pct },
  ]

  const COLORS = ["#FF6A00", "#1A1A1A"]
  const exists = pct >= 50

  return (
    <Card className="glass glow-accent bg-[#0B0B0B]/80 backdrop-blur-md border border-[#FF6A00]/20 shadow-[0_0_20px_rgba(255,106,0,0.3)]">
      <CardHeader>
        <CardTitle className="text-xl md:text-2xl text-[#FF6A00]">
          Analysis Result
        </CardTitle>
      </CardHeader>

      <CardContent className="grid gap-8">
        {loading ? (
          <div className="text-center text-gray-400 animate-pulse">Fetching analysis from backend...</div>
        ) : (
          <>
            <div className="w-full h-[300px]">
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    dataKey="value"
                    paddingAngle={5}
                    animationDuration={1200}
                  >
                    {data.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(20,20,20,0.9)",
                      border: "none",
                      borderRadius: "8px",
                      color: "#fff",
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <h2
                className={`text-2xl md:text-3xl font-semibold ${
                  exists ? "text-[#FF6A00]" : "text-red-500"
                }`}
              >
                {label === "Awaiting analysis…"
                  ? "Run an analysis to see the result."
                  : exists
                  ? "🪐 Planet Exists"
                  : "❌ Planet Does Not Exist"}
              </h2>
              <p className="text-sm text-muted-foreground mt-2">
                Confidence Level: {pct}%
              </p>
            </motion.div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
