"use client"

import Image from "next/image"
import { useEffect, useState } from "react"

interface DarkModeLogoProps {
  className?: string
}

export function DarkModeLogo({ className = "" }: DarkModeLogoProps) {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Check if dark mode is active by directly observing the HTML element
  useEffect(() => {
    // Set mounted state
    setMounted(true)

    // Initial check
    const checkDarkMode = () => {
      const isDark = document.documentElement.classList.contains("dark")
      setIsDarkMode(isDark)
      console.log("Dark mode check:", isDark)
    }

    // Check immediately
    checkDarkMode()

    // Set up an observer to watch for class changes on the HTML element
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") {
          checkDarkMode()
        }
      })
    })

    // Start observing
    observer.observe(document.documentElement, { attributes: true })

    // Clean up
    return () => observer.disconnect()
  }, [])

  // Don't render anything until mounted to avoid hydration mismatch
  if (!mounted) {
    return <div className={`h-12 w-12 ${className}`} />
  }

  // Choose logo based on dark mode state
  const logoSrc = isDarkMode ? "/logo-dark.png" : "/logo-light.png"

  return (
    <Image
      src={logoSrc || "/placeholder.svg"}
      alt="AMIA Logo"
      width={48}
      height={48}
      className={`transition-none ${className}`}
      key={isDarkMode ? "dark" : "light"} // Force re-render when mode changes
      unoptimized={true} // Prevent caching issues
      priority={true} // Load with high priority
    />
  )
}
