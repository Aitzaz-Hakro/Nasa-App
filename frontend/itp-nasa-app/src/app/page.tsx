"use client";
import dynamic from "next/dynamic";
import React from "react"; 
import Image from "next/image";
import Link from "next/link";
import Particles from "../components/ParticlesBg";
import Header from "../components/header";
import Hero from "../components/hero";
import Analytics from "../components/analytical";
import Visualization from "../components/Visualization";
import ScrollProgress from "../components/scrollProgress";
// Load interactive/client-only components on the client to avoid SSR hydration mismatches
const UploadForm = dynamic(() => import("../components/uploadform"), { ssr: false });
const PlanetModel = dynamic(() => import("../components/PlanetModel"), { ssr: false });

const resultRef = React.createRef<HTMLDivElement>();

export default function Home() {
  return (
   <div>
 
  <Header />
  <ScrollProgress />
  <Hero />
   <section id="upload" className="relative py-16 md:py-24 px-4 md:px-8 lg:px-12">
        <div className="max-w-6xl mx-auto">
          <UploadForm onAnalyzedScrollTo={() => resultRef.current?.scrollIntoView({ behavior: "smooth" })} />
        </div>
     </section>
     {/* <PlanetModel /> */}
     <Analytics />
     <div style={{ marginTop: "100px" }} ref={resultRef}>

     {/* <Visualization /> */}
     </div>

    </div>  );

}
