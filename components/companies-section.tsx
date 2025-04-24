"use client"

import Image from "next/image"
import { useEffect, useState, useRef } from "react"

export function CompaniesSection() {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const headingRef = useRef<HTMLHeadingElement>(null)

  // Avoid hydration mismatch by only rendering after component is mounted
  useEffect(() => {
    setMounted(true)

    // Initial check
    const checkDarkMode = () => {
      const isDark = document.documentElement.classList.contains("dark")
      setIsDarkMode(isDark)
      console.log("Companies section - Dark mode check:", isDark)
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

  // Add scroll event listener for parallax effect
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  // Define logos for dark mode
  const darkModeLogos = [
    { src: "/company-logos/dark/mit-tech-review.png", alt: "MIT Technology Review", width: 240 },
    { src: "/company-logos/dark/o-logo.png", alt: "O Logo", width: 100 },
    { src: "/company-logos/dark/playboy-mexico.png", alt: "Playboy Mexico", width: 240 },
    { src: "/company-logos/dark/mentur.png", alt: "Mentur", width: 240 },
    { src: "/company-logos/dark/humanity.png", alt: "Humanity", width: 240 },
    { src: "/company-logos/dark/mexico-travel.png", alt: "Mexico Travel Channel", width: 240 },
    { src: "/company-logos/dark/aeropostale.png", alt: "Aéropostale", width: 240 },
    { src: "/company-logos/dark/idc.png", alt: "IDC", width: 240 },
    { src: "/company-logos/dark/jobfit.png", alt: "JobFit", width: 240 },
    { src: "/company-logos/dark/forbes.png", alt: "Forbes", width: 240 },
    { src: "/company-logos/dark/carls-jr.png", alt: "Carl's Jr.", width: 240 },
    { src: "/company-logos/dark/la-mansion.png", alt: "La Mansión", width: 240 },
  ]

  // Define logos for light mode
  const lightModeLogos = [
    { src: "/company-logos/light/mit-tech-review.png", alt: "MIT Technology Review", width: 240 },
    { src: "/company-logos/light/o-logo.png", alt: "O Logo", width: 100 },
    { src: "/company-logos/light/playboy-mexico.png", alt: "Playboy Mexico", width: 240 },
    { src: "/company-logos/light/mentur.png", alt: "Mentur", width: 240 },
    { src: "/company-logos/light/humanity.png", alt: "Humanity", width: 240 },
    { src: "/company-logos/light/mexico-travel.png", alt: "Mexico Travel Channel", width: 240 },
    { src: "/company-logos/light/aeropostale.png", alt: "Aéropostale", width: 240 },
    { src: "/company-logos/light/idc.png", alt: "IDC", width: 240 },
    { src: "/company-logos/light/jobfit.png", alt: "JobFit", width: 240 },
    { src: "/company-logos/light/forbes.png", alt: "Forbes", width: 240 },
    { src: "/company-logos/light/carls-jr.png", alt: "Carl's Jr.", width: 240 },
    { src: "/company-logos/light/la-mansion.png", alt: "La Mansión", width: 240 },
  ]

  // Select the appropriate logos based on the current theme
  const logos = isDarkMode ? darkModeLogos : lightModeLogos

  return (
    <div className="w-full py-20 bg-transparent">
      <div className="container mx-auto px-4 bg-transparent">
        <div className="text-center mb-16 bg-transparent">
          <h2
            ref={headingRef}
            className="text-3xl font-bold text-foreground relative"
            style={{
              transform: `translateY(${scrollY * 0.1}px)`,
              transition: "transform 0.1s ease-out",
              zIndex: 10,
            }}
          >
            Empresas que confían en AMIA
          </h2>
        </div>

        <div className="flex justify-center bg-transparent relative">
          {mounted ? (
            <div className="relative w-full max-w-full overflow-hidden px-4">
              <div
                className="absolute inset-0 rounded-lg"
                style={{
                  backdropFilter: "blur(8px)",
                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                  zIndex: 1,
                }}
              ></div>

              {/* Carrusel para ambos modos (oscuro y claro) */}
              <div className="logos-carousel relative z-10">
                <div className="logos-track flex items-center space-x-12">
                  {/* Primera copia de logos */}
                  {logos.map((logo, index) => (
                    <div key={`logo1-${index}`} className="logo-item flex-shrink-0">
                      <Image
                        src={logo.src || "/placeholder.svg"}
                        alt={logo.alt}
                        width={logo.width}
                        height={60}
                        className="h-20 w-auto object-contain"
                        unoptimized={true}
                        priority={index < 5}
                      />
                    </div>
                  ))}

                  {/* Segunda copia de logos para el loop continuo */}
                  {logos.map((logo, index) => (
                    <div key={`logo2-${index}`} className="logo-item flex-shrink-0">
                      <Image
                        src={logo.src || "/placeholder.svg"}
                        alt={logo.alt}
                        width={logo.width}
                        height={60}
                        className="h-20 w-auto object-contain"
                        unoptimized={true}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            // Placeholder durante SSR para evitar desajuste de hidratación
            <div className="h-[140px] w-full max-w-[1200px] bg-transparent"></div>
          )}
        </div>

        {/* Estilos para la animación del carrusel */}
        <style jsx global>{`
          .logos-carousel {
            width: 100%;
            overflow: hidden;
            padding: 30px 0;
            background: transparent;
            position: relative;
          }
          
          .logos-track {
            display: flex;
            animation: marquee 20s linear infinite;
            will-change: transform;
          }
          
          @keyframes marquee {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(calc(-100%));
            }
          }
          
          /* Pausa la animación al pasar el mouse */
          .logos-carousel:hover .logos-track {
            animation-play-state: paused;
          }
          
          /* Ajustes responsivos */
          @media (max-width: 768px) {
            .logos-track {
              animation-duration: 15s;
            }
          }
          
          /* Asegura que las imágenes sean visibles */
          .logo-item img {
            filter: brightness(1) !important;
            opacity: 1 !important;
          }
          
          /* Reducir el espacio entre logos para mostrar más a la vez */
          .logos-track {
            gap: 8px;
            space-x-8;
          }
        `}</style>
      </div>
    </div>
  )
}
