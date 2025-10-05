"use client"

import dynamic from "next/dynamic"
import { Button } from "@/components/ui/button"


const ThreePlanet = dynamic(() => import("../components/PlanetModel"), { ssr: false })
const StarfieldCanvas = dynamic(() => import("../components/starfield-canvas"), { ssr: false })

export default function Hero() {
  const scrollToUpload = () => document.querySelector("#upload")?.scrollIntoView({ behavior: "smooth" })

  return (
    <div className="relative min-h-[80vh] md:min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Starfield backdrop
      <div className="absolute inset-0 -z-10">
        <StarfieldCanvas />
      </div> */}

      {/* 3D Planet */}
      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center px-4 md:px-8 pt-24 md:pt-32">
        <div className="order-2 md:order-1 text-center md:text-left">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-semibold text-balance">
            Exploring New Worlds Through Machine Learning
          </h1>
          <p className="mt-4 text-muted-foreground text-pretty">Harnessing AI to Discover Hidden Exoplanets.</p>
          <div className="mt-6 flex items-center gap-3 justify-center md:justify-start">
            <Button onClick={scrollToUpload} className="glow-primary neon-border bg-transparent hover:bg-primary/10">
              Get Started
            </Button>
          </div>
        </div>
        <div className="order-1 md:order-2">
          <div className=" rounded-xl aspect-square w-full ">
            <ThreePlanet />
          </div>
        </div>
      </div>
    </div>
  )
}
