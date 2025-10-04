"use client"

import { useEffect, useState } from "react"

export default function ScrollProgress() {
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const pct = docHeight > 0 ? scrollTop / docHeight : 0
      setProgress(pct)
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <div
      className="fixed right-4 top-20 z-40 h-[60vh] w-1.5 bg-muted/50 rounded-full overflow-hidden hidden md:block"
      aria-hidden
    >
      <div className="h-full bg-[oklch(0.78_0.14_190)]" style={{ transform: `translateY(${(1 - progress) * 100}%)` }} />
    </div>
  )
}
