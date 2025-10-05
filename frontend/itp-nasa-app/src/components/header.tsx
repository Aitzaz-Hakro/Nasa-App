"use client"

import type React from "react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"

export default function Header() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const onNavClick = (e: React.MouseEvent<HTMLAnchorElement>, target: string) => {
    e.preventDefault()
    document.querySelector(target)?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 rounded-[50px]     transition-all duration-300 ${
        scrolled ? "py-2 bg-background/70" : "py-4 bg-background/30"
      } glass border-b`}
      style={{ backdropFilter: "blur(12px)" }}
      aria-label="Main Navigation"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between">
        <Link href="/" className="font-semibold tracking-wide text-pretty">
          <span className="text-lg md:text-xl">ExoVision {"\u2728"}</span> <span className="sr-only">Home</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6" aria-label="Site">
          <a href="#home" onClick={(e) => onNavClick(e, "#home")} className="hover:text-primary transition">
            Home
          </a>
          <a href="#upload" onClick={(e) => onNavClick(e, "#upload")} className="hover:text-primary transition">
            Upload
          </a>
          <a href="#team" onClick={(e) => onNavClick(e, "#team")} className="hover:text-primary transition">
            Team
          </a>
          <a href="#docs" onClick={(e) => onNavClick(e, "#visualization")} className="hover:text-primary transition">
            Docs
          </a>
        </nav>
        <div className="flex items-center gap-2">
          <Link href="/contribute">
            <Button className="neon-border glow-primary bg-transparent text-foreground hover:bg-primary/20">
              Contribute
            </Button>
          </Link>
        </div>
      </div>
    </header>
  )
}
