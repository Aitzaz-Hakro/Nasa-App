"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"

export default function ThreePlanet() {
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!containerRef.current) return
    const container = containerRef.current
    const width = container.clientWidth
    const height = container.clientHeight

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    container.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000)
    camera.position.set(0, 0, 3)

    // Planet (smooth, slightly emissive cyan)
    const geometry = new THREE.SphereGeometry(1, 64, 64)
    const material = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#83fff6"), // near neon cyan
      metalness: 0.1,
      roughness: 0.4,
      emissive: new THREE.Color("#2fe1d5"),
      emissiveIntensity: 0.15,
    })
    const planet = new THREE.Mesh(geometry, material)
    scene.add(planet)

    // Lighting
    const light = new THREE.PointLight("#7c86ff", 2, 10)
    light.position.set(2, 2, 2)
    scene.add(light)
    scene.add(new THREE.AmbientLight("#ffffff", 0.2))

    // Starfield (particles)
    const starsGeometry = new THREE.BufferGeometry()
    const starCount = 1200
    const positions = new Float32Array(starCount * 3)
    for (let i = 0; i < starCount; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * 20
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20
    }
    starsGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3))
    const starsMaterial = new THREE.PointsMaterial({
      color: "#a79bff",
      size: 0.01,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.9,
    })
    const stars = new THREE.Points(starsGeometry, starsMaterial)
    scene.add(stars)

    // Drag rotation
    let isDragging = false
    let prevX = 0
    let prevY = 0
    const onDown = (e: PointerEvent) => {
      isDragging = true
      prevX = e.clientX
      prevY = e.clientY
      ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
    }
    const onMove = (e: PointerEvent) => {
      if (!isDragging) return
      const deltaX = e.clientX - prevX
      const deltaY = e.clientY - prevY
      prevX = e.clientX
      prevY = e.clientY
      planet.rotation.y += deltaX * 0.005
      planet.rotation.x += deltaY * 0.005
    }
    const onUp = (e: PointerEvent) => {
      isDragging = false
      ;(e.target as HTMLElement).releasePointerCapture(e.pointerId)
    }
    renderer.domElement.addEventListener("pointerdown", onDown)
    window.addEventListener("pointermove", onMove)
    window.addEventListener("pointerup", onUp)

    // Resize
    const onResize = () => {
      const w = container.clientWidth
      const h = container.clientHeight
      renderer.setSize(w, h)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
    }
    const ro = new ResizeObserver(onResize)
    ro.observe(container)

    let raf = 0
    const animate = () => {
      raf = requestAnimationFrame(animate)
      planet.rotation.y += 0.0025
      stars.rotation.y -= 0.0008
      renderer.render(scene, camera)
    }
    animate()

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      renderer.domElement.removeEventListener("pointerdown", onDown)
      window.removeEventListener("pointermove", onMove)
      window.removeEventListener("pointerup", onUp)
      renderer.dispose()
      geometry.dispose()
      material.dispose()
      starsGeometry.dispose()
    }
  }, [])

  return <div ref={containerRef} className="w-full h-full rounded-xl" />
}
