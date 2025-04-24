"use client"
import Link from "next/link"
import type React from "react"

import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { useEffect, useState } from "react"
import { X } from "lucide-react"

// Define the tabs for AMIA website
const tabs = ["Data Lab", "Modelos de IA", "Contacto"]

// Reemplazar el componente NavigationTabs con una versión responsiva que incluya un menú móvil

export default function NavigationTabs() {
  const [hasScrolled, setHasScrolled] = useState(false)
  const [hoveredTab, setHoveredTab] = useState<string | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Add scroll event listener
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      if (scrollPosition > 50) {
        setHasScrolled(true)
      } else {
        setHasScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  // Handle scroll to circles section
  const handleDataLabClick = (e: React.MouseEvent) => {
    e.preventDefault()
    const circlesSection = document.getElementById("circles-section")
    if (circlesSection) {
      circlesSection.scrollIntoView({ behavior: "smooth" })
    }
    setMobileMenuOpen(false)
  }

  // Handle scroll to product section
  const handleModelosClick = (e: React.MouseEvent) => {
    e.preventDefault()
    const productSection = document.getElementById("modelos-section")
    if (productSection) {
      productSection.scrollIntoView({ behavior: "smooth" })
    }
    setMobileMenuOpen(false)
  }

  // Handle scroll to contact section
  const handleContactoClick = (e: React.MouseEvent) => {
    e.preventDefault()
    const contactSection = document.getElementById("contacto-section")
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" })
    }
    setMobileMenuOpen(false)
  }

  return (
    <>
      {/* Versión de escritorio - oculta en móvil */}
      <div className="hidden md:flex items-center space-x-8 transition-all duration-300 rounded-full px-4 py-2">
        {/* Regular navigation links */}
        {["Data Lab", "Modelos de IA", "Contacto"].map((tab, index) => (
          <div
            key={index}
            onMouseEnter={() => setHoveredTab(tab)}
            onMouseLeave={() => setHoveredTab(null)}
            className="relative"
          >
            {tab === "Modelos de IA" ? (
              <a
                href="#modelos-section"
                onClick={handleModelosClick}
                className={`text-foreground hover:text-white transition-all duration-300 text-base font-medium drop-shadow-md inline-block ${
                  hoveredTab === tab ? "text-shadow-glow" : ""
                }`}
                style={{
                  textShadow: hoveredTab === tab ? "0 0 15px rgba(0,235,23,0.8), 0 0 20px rgba(0,235,23,0.6)" : "none",
                  transform: hoveredTab === tab ? "scale(1.15)" : "scale(1)",
                }}
              >
                {tab}
              </a>
            ) : tab === "Data Lab" ? (
              <a
                href="#circles-section"
                onClick={handleDataLabClick}
                className={`text-foreground hover:text-white transition-all duration-300 text-base font-medium drop-shadow-md inline-block ${
                  hoveredTab === tab ? "text-shadow-glow" : ""
                }`}
                style={{
                  textShadow: hoveredTab === tab ? "0 0 15px rgba(0,235,23,0.8), 0 0 20px rgba(0,235,23,0.6)" : "none",
                  transform: hoveredTab === tab ? "scale(1.15)" : "scale(1)",
                }}
              >
                {tab}
              </a>
            ) : tab === "Contacto" ? (
              <a
                href="#contacto-section"
                onClick={handleContactoClick}
                className={`text-foreground hover:text-white transition-all duration-300 text-base font-medium drop-shadow-md inline-block ${
                  hoveredTab === tab ? "text-shadow-glow" : ""
                }`}
                style={{
                  textShadow: hoveredTab === tab ? "0 0 15px rgba(0,235,23,0.8), 0 0 20px rgba(0,235,23,0.6)" : "none",
                  transform: hoveredTab === tab ? "scale(1.15)" : "scale(1)",
                }}
              >
                {tab}
              </a>
            ) : (
              <Link
                href="#"
                className={`text-foreground hover:text-white transition-all duration-300 text-base font-medium drop-shadow-md inline-block ${
                  hoveredTab === tab ? "text-shadow-glow" : ""
                }`}
                style={{
                  textShadow: hoveredTab === tab ? "0 0 15px rgba(0,235,23,0.8), 0 0 20px rgba(0,235,23,0.6)" : "none",
                  transform: hoveredTab === tab ? "scale(1.15)" : "scale(1)",
                }}
              >
                {tab}
              </Link>
            )}
          </div>
        ))}

        {/* Demo button */}
        <Link href="/demo-request">
          <Button
            className="bg-foreground text-background hover:bg-foreground/90 px-4 py-3 font-medium transition-colors duration-100 cta-button group relative overflow-hidden gradient-text-container cursor-glow-effect"
            onMouseEnter={() => setHoveredTab("Demo")}
            onMouseLeave={() => setHoveredTab(null)}
            style={{
              transition: "all 0.3s ease",
            }}
          >
            <span className="gradient-text">Solicitar un demo</span>
            <ArrowRight className="ml-2 h-4 w-4 gradient-icon" />
            <span className="absolute inset-0 pointer-events-none green-wave-effect"></span>
          </Button>
        </Link>

        {/* Log In link */}
        <Link
          href="#"
          className={`text-foreground hover:text-white transition-all duration-300 text-base font-medium drop-shadow-md inline-block ${
            hoveredTab === "Log In" ? "text-shadow-glow" : ""
          }`}
          style={{
            textShadow: hoveredTab === "Log In" ? "0 0 15px rgba(0,235,23,0.8), 0 0 20px rgba(0,235,23,0.6)" : "none",
            transform: hoveredTab === "Log In" ? "scale(1.15)" : "scale(1)",
          }}
          onMouseEnter={() => setHoveredTab("Log In")}
          onMouseLeave={() => setHoveredTab(null)}
        >
          Log In
        </Link>

        {/* Theme Toggle */}
        <div className="ml-4">
          <ThemeToggle />
        </div>
      </div>

      {/* Versión móvil - visible solo en pantallas pequeñas */}
      <div className="md:hidden flex items-center">
        {/* Botón de menú hamburguesa */}
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-foreground p-2 focus:outline-none">
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>

        {/* Theme Toggle en móvil */}
        <div className="ml-4">
          <ThemeToggle />
        </div>
      </div>

      {/* Menú móvil desplegable */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-background/95 backdrop-blur-md z-50 border-b border-gray-700/30 shadow-lg">
          <div className="flex flex-col p-4 space-y-4">
            <a
              href="#circles-section"
              onClick={handleDataLabClick}
              className="text-foreground hover:text-green-400 py-2 px-4 transition-colors"
            >
              Data Lab
            </a>
            <a
              href="#modelos-section"
              onClick={handleModelosClick}
              className="text-foreground hover:text-green-400 py-2 px-4 transition-colors"
            >
              Modelos de IA
            </a>
            <a
              href="#contacto-section"
              onClick={handleContactoClick}
              className="text-foreground hover:text-green-400 py-2 px-4 transition-colors"
            >
              Contacto
            </a>
            <Link
              href="#"
              className="text-foreground hover:text-green-400 py-2 px-4 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Log In
            </Link>
            <Link href="/demo-request" className="block">
              <Button
                className="w-full bg-foreground text-background hover:bg-foreground/90 py-3 font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Solicitar un demo
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      )}
    </>
  )
}
