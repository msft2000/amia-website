"use client"

import { useTheme } from "next-themes"
import { useEffect, useState, useRef } from "react"
import Link from "next/link"

export function QuoteSection() {
  const { theme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [hoveredCircle, setHoveredCircle] = useState<number | null>(null)
  const [activeCircle, setActiveCircle] = useState<number | null>(null)
  const [displayedTextIndex, setDisplayedTextIndex] = useState<number | null>(null)
  const [autoAnimationPaused, setAutoAnimationPaused] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const timeoutRefs = useRef<NodeJS.Timeout[]>([])
  const circlesContainerRef = useRef<HTMLDivElement>(null)
  const [scrollProgress, setScrollProgress] = useState(0)
  const descriptionRef = useRef<HTMLDivElement>(null)
  const [isDarkMode, setIsDarkMode] = useState(false)

  // Avoid hydration mismatch by only rendering after component is mounted
  useEffect(() => {
    setMounted(true)

    // Set an initial scroll progress for immediate effect
    setScrollProgress(0.5)
  }, [])

  // Detectar modo oscuro directamente observando la clase en el HTML
  useEffect(() => {
    if (!mounted) return

    // Función para verificar el modo oscuro
    const checkDarkMode = () => {
      const isDark = document.documentElement.classList.contains("dark")
      console.log("Dark mode detected:", isDark)
      setIsDarkMode(isDark)

      // Aplicar estilo directamente al contenedor de descripción
      if (descriptionRef.current) {
        if (isDark) {
          descriptionRef.current.style.setProperty("color", "#ffffff", "important")
          // Añadir una sombra sutil para mejorar la legibilidad
          descriptionRef.current.style.setProperty("text-shadow", "0 0 1px rgba(0,0,0,0.5)", "important")

          // Aplicar a todos los elementos hijos
          const children = descriptionRef.current.querySelectorAll("p, span, strong")
          children.forEach((child) => {
            ;(child as HTMLElement).style.setProperty("color", "#ffffff", "important")
          })
        } else {
          // En modo claro, establecer explícitamente el color negro
          descriptionRef.current.style.setProperty("color", "#000000", "important")
          descriptionRef.current.style.removeProperty("text-shadow")

          // Aplicar color negro a todos los elementos hijos en modo claro
          const children = descriptionRef.current.querySelectorAll("p, span, strong")
          children.forEach((child) => {
            ;(child as HTMLElement).style.setProperty("color", "#000000", "important")
          })
        }
      }
    }

    // Verificar inmediatamente
    checkDarkMode()

    // Observar cambios en la clase del documento
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") {
          checkDarkMode()
        }
      })
    })

    observer.observe(document.documentElement, { attributes: true })

    return () => observer.disconnect()
  }, [mounted])

  // Clear all timeouts
  const clearAllTimeouts = () => {
    timeoutRefs.current.forEach((timeout) => clearTimeout(timeout))
    timeoutRefs.current = []
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  // Handle circle click
  const handleCircleClick = (index: number) => {
    // Clear all existing animations
    clearAllTimeouts()

    // Stop auto animation
    setAutoAnimationPaused(true)

    // Set the clicked circle as active
    setActiveCircle(index)
    setDisplayedTextIndex(index)
  }

  // Effect for cycling through circles with inverted colors
  useEffect(() => {
    if (!mounted || autoAnimationPaused) return

    const animateCycle = () => {
      // Clear any existing timeouts
      clearAllTimeouts()

      // Animate each circle with a delay
      for (let i = 0; i < 4; i++) {
        // Set active circle with progressive delay
        const timeout1 = setTimeout(() => {
          setActiveCircle(i)
          setDisplayedTextIndex(i) // Update displayed text to match active circle

          // Keep this circle active for the full 5 seconds
          // No need to reset it as the next circle will become active
        }, i * 5000) // 5 seconds between each circle

        timeoutRefs.current.push(timeout1)
      }
    }

    // Start the animation cycle
    animateCycle()

    // Repeat the cycle every 20 seconds (4 circles × 5 seconds each)
    intervalRef.current = setInterval(animateCycle, 20000)

    // Clean up interval on unmount
    return () => {
      clearAllTimeouts()
    }
  }, [mounted, autoAnimationPaused])

  // Update displayed text when hovering over a circle
  useEffect(() => {
    if (hoveredCircle !== null) {
      setDisplayedTextIndex(hoveredCircle)
    } else if (activeCircle !== null) {
      setDisplayedTextIndex(activeCircle)
    }
  }, [hoveredCircle, activeCircle])

  // Define the labels for each circle
  const circleLabels = ["Big Data", "Motor de Calidad", "Governanza", "Perfilación de tus clientes"]

  // Define the content for each circle
  const circleContent = [
    {
      title: (
        <>
          <span
            style={{
              background: "linear-gradient(to right, #15803d, #4ade80, #bbf7d0)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
              display: "inline-block",
              textShadow: "none",
              WebkitTextFillColor: "transparent",
            }}
          >
            Big Data de AMIA:
          </span>{" "}
          Toda tu información en un solo lugar, clara y lista para usar.
        </>
      ),
      subtitle: (
        <>
          Con AMIA, transformamos grandes cantidades de datos dispersos en respuestas simples y efectivas. Unimos,
          ordenamos y analizamos toda la información de tu empresa para que puedas{" "}
          <strong>tomar decisiones rápidas, claras y que realmente impulsen tu negocio.</strong> Sin complicaciones, sin
          tecnicismos innecesarios—solo datos confiables, decisiones inteligentes y resultados concretos.
        </>
      ),
    },
    {
      title: (
        <>
          <span
            style={{
              background: "linear-gradient(to right, #15803d, #4ade80, #bbf7d0)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
              display: "inline-block",
              textShadow: "none",
              WebkitTextFillColor: "transparent",
            }}
          >
            Motor de Calidad:
          </span>{" "}
          Datos siempre limpios, automáticamente.
        </>
      ),
      subtitle: (
        <>
          Nuestro Motor de Calidad revisa, corrige y depura tus datos en tiempo real, de forma totalmente automática.
          Sin esfuerzo extra, tienes información precisa y lista para usar.{" "}
          <strong>Menos errores humanos, menos preocupaciones, mejores decisiones</strong>—todo al instante y sin mover
          un dedo.
        </>
      ),
    },
    {
      title: (
        <>
          <span
            style={{
              background: "linear-gradient(to right, #15803d, #4ade80, #bbf7d0)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
              display: "inline-block",
              textShadow: "none",
              WebkitTextFillColor: "transparent",
            }}
          >
            Gobernanza AMIA:
          </span>{" "}
          Tus datos seguros, controlados y siempre en orden.
        </>
      ),
      subtitle: (
        <>
          AMIA protege automáticamente tu información, asegurando que solo las personas indicadas puedan acceder a ella.
          Cumplimos con todas las regulaciones y mantenemos todo transparente para auditorías rápidas y sin sorpresas.{" "}
          <strong>Menos riesgos, total tranquilidad y más tiempo para hacer crecer tu negocio.</strong>
        </>
      ),
    },
    {
      title: (
        <>
          <span
            style={{
              background: "linear-gradient(to right, #15803d, #4ade80, #bbf7d0)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
              display: "inline-block",
              textShadow: "none",
              WebkitTextFillColor: "transparent",
            }}
          >
            Segmentación Inteligente:
          </span>{" "}
          Entiende a tus clientes con precisión, vende más facil y rápido.
        </>
      ),
      subtitle: (
        <>
          Con AMIA, analizamos automáticamente comportamientos, hábitos y preferencias reales de tus clientes para crear
          perfiles claros y precisos. Así puedes tomar decisiones acertadas, generar campañas más efectivas y lograr
          clientes más comprometidos y satisfechos—todo basado en datos concretos y confiables.
        </>
      ),
    },
  ]

  // Effect for scroll animation - adjusted to trigger earlier
  useEffect(() => {
    const handleScroll = () => {
      if (!circlesContainerRef.current) return

      const rect = circlesContainerRef.current.getBoundingClientRect()
      const windowHeight = window.innerHeight

      // Calculate how far the element is in the viewport - modified to trigger earlier
      // When rect.top is at 80% of window height, progress should already be at max
      const triggerEarlierFactor = 1.5 // Higher value = earlier trigger
      let progress = 1 - rect.top / (windowHeight * triggerEarlierFactor)

      // Clamp between 0 and 1
      progress = Math.max(0, Math.min(1, progress))

      // Apply easing to make it reach full value more quickly
      progress = Math.pow(progress, 0.5) // Power of 0.5 gives a square root curve (faster initial progress)

      setScrollProgress(progress)
    }

    window.addEventListener("scroll", handleScroll)
    handleScroll() // Initial calculation

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return (
    <div
      className="container mx-auto px-4 relative z-10"
      style={{
        backgroundColor: "transparent",
        backdropFilter: "none",
        pointerEvents: "auto", // Asegura que los eventos de puntero funcionen normalmente
        zIndex: 5, // Reduce el z-index para que sea menor que el del header
      }}
    >
      <blockquote className="text-center max-w-4xl mx-auto pt-16 pb-14">
        <h2 className="text-3xl font-bold mb-3 text-foreground text-center">
          Decisiones claras, privacidad total y calidad asegurada:
        </h2>
        <p
          className={`text-2xl font-light leading-relaxed text-center transition-colors duration-300 ease-in-out mb-4 ${
            mounted ? "text-foreground" : "opacity-0"
          }`}
        >
          AMIA convierte tus datos en tu mayor ventaja competitiva.
        </p>

        {/* Circles container - positioned 4-5 lines below the text with 3D perspective */}
        <div
          ref={circlesContainerRef}
          className="mt-12 flex justify-center perspective-container"
          style={{
            perspective: "1000px",
            transformStyle: "preserve-3d",
            pointerEvents: "auto", // Asegura que los eventos de puntero funcionen normalmente
          }}
        >
          <div
            className="circles-wrapper flex flex-wrap justify-center w-full"
            style={{
              gap: "2rem",
              transform: `rotateX(${20 - scrollProgress * 20}deg) translateZ(${-100 + scrollProgress * 100}px)`,
              opacity: Math.min(1, 0.8 + scrollProgress * 0.2),
              transition: "transform 0.1s ease-out, opacity 0.2s ease-out",
            }}
          >
            {[0, 1, 2, 3].map((index) => (
              <div
                key={index}
                className="relative cursor-pointer transition-all duration-300 flex flex-col items-center mb-4"
                onMouseEnter={() => setHoveredCircle(index)}
                onMouseLeave={() => setHoveredCircle(null)}
                onClick={() => handleCircleClick(index)}
              >
                <div
                  className={`rounded-full transition-all duration-300 text-foreground ${
                    hoveredCircle === index || activeCircle === index
                      ? "bg-current border-current"
                      : "bg-transparent border-current"
                  }`}
                  style={{
                    borderWidth: "4px",
                    width: "8rem", // Aumentado de 6rem a 8rem
                    height: "8rem", // Aumentado de 6rem a 8rem
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    filter: isDarkMode ? "brightness(1.1)" : "brightness(1)",
                  }}
                >
                  {index === 0 && (
                    <span
                      className={`transition-colors duration-300 flex items-center justify-center ${
                        hoveredCircle === 0 || activeCircle === 0 ? "text-background" : "text-foreground"
                      }`}
                      style={{
                        fontSize: "5rem", // Aumentado de 3.5rem a 5rem
                        lineHeight: "1",
                        height: "5rem", // Aumentado de 3.5rem a 5rem
                        width: "5rem", // Aumentado de 3.5rem a 5rem
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transform: "translateY(-2px)",
                      }}
                    >
                      ⧉
                    </span>
                  )}

                  {index === 1 && (
                    <span
                      className={`transition-colors duration-300 flex items-center justify-center ${
                        hoveredCircle === 1 || activeCircle === 1 ? "text-background" : "text-foreground"
                      }`}
                      style={{
                        fontSize: "6rem", // Aumentado de 4.5rem a 6rem
                        lineHeight: "1",
                        height: "6rem", // Aumentado de 4.5rem a 6rem
                        width: "6rem", // Aumentado de 4.5rem a 6rem
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        position: "relative",
                        top: "-8px", // Move the icon upward
                        left: "0", // Ensure horizontal centering
                        transform: "translateX(0)", // Ensure no horizontal offset
                      }}
                    >
                      ⚙︎
                    </span>
                  )}

                  {index === 2 && (
                    <span
                      className={`transition-colors duration-300 flex items-center justify-center ${
                        hoveredCircle === 2 || activeCircle === 2 ? "text-background" : "text-foreground"
                      }`}
                      style={{
                        fontSize: "6rem", // Aumentado de 4.5rem a 6rem
                        lineHeight: "1",
                        height: "6rem", // Aumentado de 4.5rem a 6rem
                        width: "6rem", // Aumentado de 4.5rem a 6rem
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transform: "translateY(-2px)", // Fine-tune vertical alignment
                      }}
                    >
                      ⛨
                    </span>
                  )}

                  {index === 3 && (
                    <span
                      className={`transition-colors duration-300 flex items-center justify-center ${
                        hoveredCircle === 3 || activeCircle === 3 ? "text-background" : "text-foreground"
                      }`}
                      style={{
                        fontSize: "6rem", // Aumentado de 4.5rem a 6rem
                        lineHeight: "1",
                        height: "6rem", // Aumentado de 4.5rem a 6rem
                        width: "6rem", // Aumentado de 4.5rem a 6rem
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transform: "translateY(-2px)", // Fine-tune vertical alignment
                      }}
                    >
                      ◑
                    </span>
                  )}
                </div>

                {/* Label text under each circle - reducido el margen superior */}
                <p
                  className={`mt-2 text-foreground font-medium text-center transition-all duration-300 ${
                    hoveredCircle === index || activeCircle === index
                      ? "transform scale-110 font-semibold label-glow"
                      : ""
                  }`}
                  style={{
                    maxWidth: index === 3 ? "10rem" : "auto",
                    color: "inherit",
                    fontSize: "1.1rem", // Aumentado el tamaño de la fuente
                  }}
                >
                  {circleLabels[index]}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Dynamic text section that changes based on active/hovered circle */}
        <div
          className="mt-12 md:mt-16 transition-opacity duration-500 text-center relative z-10 px-4"
          style={{
            minHeight: "12rem",
            backgroundColor: "transparent",
            backdropFilter: "none",
            marginBottom: "-2rem",
            zIndex: 5, // Reduce el z-index para que sea menor que el del header
          }}
        >
          {displayedTextIndex !== null && (
            <div
              ref={descriptionRef}
              className="animate-fadeIn dark-mode-text light-mode-text"
              style={{
                backgroundColor: "transparent",
                backdropFilter: "none",
                boxShadow: "none",
                background: "none",
                border: "none",
                color: isDarkMode ? "#ffffff" : "#000000",
              }}
            >
              <h3
                className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-center"
                style={{
                  opacity: 1,
                  backgroundColor: "transparent",
                  position: "relative",
                  zIndex: 10,
                  transition: "color 0.1s ease",
                  color: isDarkMode ? "#ffffff" : "#000000",
                }}
              >
                {circleContent[displayedTextIndex].title}
              </h3>

              <div
                className="text-base md:text-lg max-w-4xl mx-auto text-center"
                style={{
                  color: isDarkMode ? "#ffffff" : "#000000",
                }}
              >
                {circleContent[displayedTextIndex].subtitle}
              </div>

              {/* CTA Button */}
              <Link href="/demo-request">
                <button
                  className="mt-6 md:mt-8 px-6 py-3 rounded-lg font-medium shadow-lg cta-button transition-all duration-300 cursor-glow-effect"
                  style={{
                    backgroundColor: isDarkMode ? "#ffffff" : "#000000",
                    color: isDarkMode ? "#000000" : "#ffffff",
                  }}
                >
                  Solicitar Demo
                </button>
              </Link>
            </div>
          )}
        </div>
      </blockquote>

      {/* Add animation for fade-in effect */}
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
          background-color: transparent !important;
        }
        
        @keyframes labelGlow {
          0% { text-shadow: 0 0 5px rgba(255,255,255,0.8), 0 0 10px rgba(255,255,255,0.5); }
          50% { text-shadow: 0 0 10px rgba(255,255,255,1), 0 0 15px rgba(255,255,255,0.7), 0 0 20px rgba(255,255,255,0.5); }
          100% { text-shadow: 0 0 5px rgba(255,255,255,0.8), 0 0 10px rgba(255,255,255,0.5); }
        }

        .label-glow {
          animation: labelGlow 2s ease-in-out infinite;
        }

        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }

        .perspective-container {
          perspective: 1000px;
        }

        .circles-wrapper {
          transform-style: preserve-3d;
          will-change: transform;
        }

        .circles-wrapper > div {
          transform-style: preserve-3d;
          backface-visibility: hidden;
        }

        .circles-wrapper > div:nth-child(1) {
          animation: float 6s ease-in-out infinite;
          animation-delay: 0s;
        }

        .circles-wrapper > div:nth-child(2) {
          animation: float 6s ease-in-out infinite;
          animation-delay: 1.5s;
        }

        .circles-wrapper > div:nth-child(3) {
          animation: float 6s ease-in-out infinite;
          animation-delay: 3s;
        }

        .circles-wrapper > div:nth-child(4) {
          animation: float 6s ease-in-out infinite;
          animation-delay: 4.5s;
        }
        
        /* Forzar texto blanco en modo oscuro con alta especificidad */
        html.dark .dark-mode-text,
        html.dark .dark-mode-text p,
        html.dark .dark-mode-text span,
        html.dark .dark-mode-text strong,
        html.dark .dark-mode-text div {
          color: #ffffff !important;
          opacity: 1 !important;
        }

        /* Forzar texto negro en modo claro con alta especificidad */
        html:not(.dark) .light-mode-text,
        html:not(.dark) .light-mode-text p,
        html:not(.dark) .light-mode-text span,
        html:not(.dark) .light-mode-text strong,
        html:not(.dark) .light-mode-text div {
          color: #000000 !important;
          opacity: 1 !important;
        }

        /* Asegurar que el gradiente no sea sobrescrito */
        .bg-gradient-to-r.from-green-700.via-green-400.to-green-200.text-transparent.bg-clip-text {
          background: linear-gradient(to right, #15803d, #4ade80, #bbf7d0) !important;
          -webkit-background-clip: text !important;
          background-clip: text !important;
          color: transparent !important;
        }

        /* Estilos específicos para forzar el gradiente en los títulos */
        h3 span[style*="background-clip"] {
          background: linear-gradient(to right, #15803d, #4ade80, #bbf7d0) !important;
          -webkit-background-clip: text !important;
          background-clip: text !important;
          color: transparent !important;
          -webkit-text-fill-color: transparent !important;
          text-shadow: none !important;
        }
      `}</style>
    </div>
  )
}
