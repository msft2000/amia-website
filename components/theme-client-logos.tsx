"use client"

import { useTheme } from "next-themes"
import Image from "next/image"
import { useEffect, useState } from "react"

interface ThemeClientLogosProps {
  className?: string
}

export function ThemeClientLogos({ className }: ThemeClientLogosProps) {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch by only rendering after component is mounted
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    // Return a placeholder with the same dimensions during SSR
    return <div className={`h-[100px] ${className}`} />
  }

  // Use the black logo for light theme and white logo for dark theme
  const logoSrc = theme === "dark" ? "/logos-clientes-dark.png" : "/logos-clientes-light.png"

  return (
    <Image
      src={logoSrc || "/placeholder.svg"}
      alt="Empresas que confían en AMIA"
      width={1200}
      height={100}
      className={`max-w-full ${className}`}
    />
  )
}
