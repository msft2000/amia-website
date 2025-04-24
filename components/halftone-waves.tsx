"use client"

import { useEffect, useRef, useState } from "react"
import { useTheme } from "next-themes"

export default function HalftoneWaves() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { theme, resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const animationRef = useRef<number | null>(null)
  const themeChangeRef = useRef<boolean>(false)

  // Ensure we're mounted before accessing theme
  useEffect(() => {
    setMounted(true)
  }, [])

  // Effect to handle theme changes from any source
  useEffect(() => {
    if (!mounted) return

    // Mark that theme has changed to trigger animation restart
    if (themeChangeRef.current) {
      // Reset animation when theme changes
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
        animationRef.current = null
      }
    }

    themeChangeRef.current = true
  }, [theme, resolvedTheme, mounted])

  useEffect(() => {
    if (!mounted) return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let time = 0

    // Get the current theme state
    const isDarkMode = theme === "dark" || resolvedTheme === "dark"

    // Get the actual computed styles from the document
    const computedStyle = getComputedStyle(document.documentElement)

    // Get the foreground color (text color) from CSS variables
    // This will match the hero title text color (not the green highlight)
    const foregroundColor = isDarkMode ? "rgb(255, 255, 255)" : "rgb(0, 0, 0)"

    // Get the background color from the body
    const bodyComputedStyle = getComputedStyle(document.body)
    const backgroundColor = bodyComputedStyle.backgroundColor

    // Set canvas background to match the page background exactly
    canvas.style.backgroundColor = "transparent"

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1
      const rect = canvas.getBoundingClientRect()

      // Set display size (css pixels)
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr

      // Scale context to match device pixel ratio
      ctx.scale(dpr, dpr)

      // Set canvas CSS size
      canvas.style.width = `${rect.width}px`
      canvas.style.height = `${rect.height}px`
    }

    const drawHalftoneWave = () => {
      // Clear with background color to match the page background
      ctx.fillStyle = backgroundColor
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      const gridSize = 20
      const rows = Math.ceil(canvas.height / gridSize)
      const cols = Math.ceil(canvas.width / gridSize)

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const centerX = x * gridSize
          const centerY = y * gridSize
          const distanceFromCenter = Math.sqrt(
            Math.pow(centerX - canvas.width / 2, 2) + Math.pow(centerY - canvas.height / 2, 2),
          )
          const maxDistance = Math.sqrt(Math.pow(canvas.width / 2, 2) + Math.pow(canvas.height / 2, 2))
          const normalizedDistance = distanceFromCenter / maxDistance

          const waveOffset = Math.sin(normalizedDistance * 10 - time) * 0.5 + 0.5
          const size = gridSize * waveOffset * 0.8

          ctx.beginPath()
          ctx.arc(centerX, centerY, size / 2, 0, Math.PI * 2)

          // Use the foreground color (hero title color) for dots with opacity based on wave offset
          const dotOpacity = waveOffset * 0.9 // Increased opacity for better visibility

          // Extract RGB components from foreground color
          let r, g, b
          if (isDarkMode) {
            r = 255
            g = 255
            b = 255
          } else {
            r = 0
            g = 0
            b = 0
          }

          const dotColor = `rgba(${r}, ${g}, ${b}, ${dotOpacity})`
          ctx.fillStyle = dotColor
          ctx.fill()
        }
      }
    }

    const animate = () => {
      if (!canvas) return

      drawHalftoneWave()
      time += 0.05
      animationRef.current = requestAnimationFrame(animate)
    }

    // Clean up previous animation if it exists
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    }

    resizeCanvas()

    // Handle window resize
    const handleResize = () => {
      resizeCanvas()
    }

    window.addEventListener("resize", handleResize)

    // Start animation
    animate()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      window.removeEventListener("resize", handleResize)
    }
  }, [theme, resolvedTheme, mounted]) // Re-run effect when theme changes or component mounts

  // Handle theme toggle - synchronized with the site-wide theme
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  // Determine if we're in dark mode for the text box
  const isDarkMode = mounted && (theme === "dark" || resolvedTheme === "dark")

  // Use more contrast for the text box to make it stand out
  const textBoxBg = isDarkMode ? "bg-black/80" : "bg-white/80"
  const textColor = isDarkMode ? "text-white" : "text-black"
  const buttonBg = isDarkMode ? "bg-white" : "bg-black"
  const buttonText = isDarkMode ? "text-black" : "text-white"
  const borderColor = isDarkMode ? "border-gray-700" : "border-gray-300"

  return (
    <div className="relative w-full h-0 overflow-hidden">
      <canvas ref={canvasRef} className="w-full h-0" />
    </div>
  )
}
