"use client"

import { useTheme } from "next-themes"
import Image from "next/image"
import { useEffect, useState } from "react"

interface ThemeLogoProps {
  className?: string
}

export function ThemeLogo({ className }: ThemeLogoProps) {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)

  // Avoid hydration mismatch by only rendering after component is mounted
  useEffect(() => {
    setMounted(true)

    // Initial check of background color
    const checkBackgroundColor = () => {
      const bodyBgColor = window.getComputedStyle(document.body).backgroundColor
      // Check if background is dark (black or very dark)
      const isDark = bodyBgColor === "rgb(0, 0, 0)" || bodyBgColor === "#000000" || bodyBgColor === "rgba(0, 0, 0, 1)"
      setIsDarkMode(isDark)
    }

    checkBackgroundColor()

    // Set up observer to monitor background color changes
    const observer = new MutationObserver(() => {
      checkBackgroundColor()
    })

    observer.observe(document.body, { attributes: true, attributeFilter: ["style"] })

    return () => observer.disconnect()
  }, [])

  if (!mounted) {
    // Return a placeholder with the same dimensions during SSR
    return <div className={className} />
  }

  // Use the black logo for light background and white logo for dark background
  const logoSrc = isDarkMode ? "/amia-logo-white.png" : "/amia-logo-black.png"

  return (
    <Image
      src={logoSrc || "/placeholder.svg"}
      alt="AMIA Logo"
      width={720}
      height={240}
      className={`transition-none ${className}`}
    />
  )
}
