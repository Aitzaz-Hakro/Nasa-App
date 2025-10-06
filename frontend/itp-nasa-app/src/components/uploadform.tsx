"use client"

import { useMemo, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

type Props = { onAnalyzedScrollTo?: () => void }

const numericFields = [
  { key: "sy_snum", label: "System Number" },
  { key: "sy_pnum", label: "Planet Count" },
  { key: "disc_year", label: "Discovery Year" },
  { key: "pl_orbper", label: "Orbital Period" },
  { key: "pl_orbsmax", label: "Orbital Semi-Major Axis" },
  { key: "pl_orbeccen", label: "Orbital Eccentricity" },
  { key: "pl_rade", label: "Planet Radius (Earth)" },
  { key: "pl_radj", label: "Planet Radius (Jupiter)" },
  { key: "pl_bmasse", label: "Planet Mass (Earth)" },
  { key: "pl_bmassj", label: "Planet Mass (Jupiter)" },
  { key: "pl_insol", label: "Insolation Flux" },
  { key: "pl_eqt", label: "Equilibrium Temp (K)" },
  { key: "st_teff", label: "Stellar Temp (K)" },
  { key: "st_rad", label: "Star Radius" },
  { key: "ttv_flag", label: "TTV Flag" },
  { key: "st_mass", label: "Star Mass" },
  { key: "st_met", label: "Metallicity" },
  { key: "st_logg", label: "Surface Gravity" },
  { key: "ra", label: "Right Ascension" },
  { key: "dec", label: "Declination" },
  { key: "sy_dist", label: "System Distance (pc)" },
  { key: "sy_vmag", label: "Visual Magnitude" },
  { key: "sy_kmag", label: "K Magnitude" },
  { key: "sy_gaiamag", label: "Gaia Magnitude" },
  { key: "planet_star_radius_ratio", label: "Planet/Star Radius Ratio" },
  { key: "planet_star_mass_ratio", label: "Planet/Star Mass Ratio" },
]

const textFields = [
  { key: "pl_name", label: "Planet Name" },
  { key: "hostname", label: "Host Star Name" },
  { key: "discoverymethod", label: "Discovery Method" },
  { key: "disc_facility", label: "Discovery Facility" },
  { key: "soltype", label: "Solution Type" },
  { key: "pl_bmassprov", label: "Mass Provenance" },
  { key: "st_spectype", label: "Spectral Type" },
  { key: "st_metratio", label: "Metal Ratio" },
]

export default function UploadForm({ onAnalyzedScrollTo }: Props) {
  const initialNumeric = useMemo(() => Object.fromEntries(numericFields.map((f) => [f.key, ""])), [])
  const initialText = useMemo(() => Object.fromEntries(textFields.map((f) => [f.key, ""])), [])

  const [numeric, setNumeric] = useState(initialNumeric)
  const [text, setText] = useState(initialText)
  const [csvName, setCsvName] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ sum?: number; label?: string; confidence?: number; message?: string } | null>(null)
  const [error, setError] = useState<string | null>(null)

  const onAnalyze = async () => {
    setLoading(true)
    setError(null) // Clear previous errors
    try {
      const payload = {
        ...Object.fromEntries(Object.entries(numeric).map(([k, v]) => [k, Number(v) || 0])),
        ...text,
      }
      
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
      console.log("🔍 Calling API:", `${apiUrl}/api/calculate-sum`)
      console.log("📦 Payload:", payload)
      
      const res = await fetch(`${apiUrl}/api/calculate-sum`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      
      console.log("📡 Response status:", res.status)
      
      if (!res.ok) {
        const errorText = await res.text()
        throw new Error(`API Error (${res.status}): ${errorText}`)
      }
      
      const data = await res.json()
      console.log("✅ Response data:", data)
      setResult(data)
      onAnalyzedScrollTo?.()
      window.dispatchEvent(new CustomEvent("analysis:result", { detail: data }))
    } catch (err) {
      console.error("❌ Error:", err)
      setError(err instanceof Error ? err.message : "Failed to analyze data. Please check console for details.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="relative overflow-hidden border border-white/20 bg-white/10 backdrop-blur-xl shadow-[0_0_25px_rgba(0,255,255,0.2)] rounded-2xl p-4 md:p-6 transition-all duration-300 hover:shadow-[0_0_35px_rgba(0,255,255,0.4)]">
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/10 via-transparent to-purple-500/10 pointer-events-none" />
      <CardHeader>
        <CardTitle className="text-xl md:text-2xl text-white font-semibold tracking-wide">
          Upload Data or Enter Manually
        </CardTitle>
      </CardHeader>

      <CardContent className="mt-2 relative z-10">
        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="grid grid-cols-2 w-full bg-white/10 backdrop-blur-md rounded-lg border border-white/20">
            <TabsTrigger value="upload" className="text-white data-[state=active]:bg-cyan-500/20">Upload CSV</TabsTrigger>
            <TabsTrigger value="manual" className="text-white data-[state=active]:bg-cyan-500/20">Manual Input</TabsTrigger>
          </TabsList>

          {/* Upload CSV */}
          <TabsContent value="upload" className="mt-6">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="csv" className="text-white">CSV File</Label>
                <Input
                  id="csv"
                  type="file"
                  accept=".csv,text/csv"
                  onChange={(e) => setCsvName(e.target.files?.[0]?.name || "")}
                  className="bg-white/10 border border-cyan-400/30 text-white placeholder-white/60 focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all"
                />
                {csvName && <p className="text-white/70 text-sm">Selected: {csvName}</p>}
              </div>
              <Button
                onClick={onAnalyze}
                disabled={loading}
                className="border border-cyan-400/40 text-cyan-300 bg-transparent hover:bg-cyan-500/20 hover:shadow-[0_0_15px_rgba(0,255,255,0.4)] transition-all"
              >
                {loading ? "Analyzing…" : "Analyze"}
              </Button>
            </div>
          </TabsContent>

          {/* Manual Input */}
          <TabsContent value="manual" className="mt-6">
            <div className="grid gap-6">
              <div className="grid md:grid-cols-3 gap-4">
                {numericFields.map((f) => (
                  <div key={f.key} className="grid gap-2">
                    <Label htmlFor={f.key} className="text-white">{f.label}</Label>
                    <Input
                      id={f.key}
                      type="number"
                      value={numeric[f.key]}
                      onChange={(e) => setNumeric((prev) => ({ ...prev, [f.key]: e.target.value }))}
                      placeholder={f.label}
                      className="bg-white/10 border border-cyan-400/30 text-white placeholder-white/60 focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all"
                    />
                  </div>
                ))}
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                {textFields.map((f) => (
                  <div key={f.key} className="grid gap-2">
                    <Label htmlFor={f.key} className="text-white">{f.label}</Label>
                    <Input
                      id={f.key}
                      type="text"
                      value={text[f.key]}
                      onChange={(e) => setText((prev) => ({ ...prev, [f.key]: e.target.value }))}
                      placeholder={f.label}
                      className="bg-white/10 border border-cyan-400/30 text-white placeholder-white/60 focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all"
                    />
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-3">
                <Button
                  onClick={onAnalyze}
                  disabled={loading}
                  className="border border-cyan-400/40 text-cyan-300 bg-transparent hover:bg-cyan-500/20 hover:shadow-[0_0_15px_rgba(0,255,255,0.4)] transition-all"
                >
                  {loading ? "Analyzing…" : "Analyze"}
                </Button>
                
                {/* Error Message */}
                {error && (
                  <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
                    <p className="text-sm text-red-200">❌ {error}</p>
                  </div>
                )}
                
                {/* Success Result */}
                {result && !error && (
                  <div className="p-3 bg-cyan-500/20 border border-cyan-500/50 rounded-lg">
                    {result.sum !== undefined ? (
                      <p className="text-sm text-cyan-200">
                        ✅ Sum: {result.sum.toFixed(2)} ({result.message})
                      </p>
                    ) : result.label && result.confidence ? (
                      <p className="text-sm text-cyan-200">
                        ✅ Result: {result.label} ({Math.round(result.confidence * 100)}%)
                      </p>
                    ) : null}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
 