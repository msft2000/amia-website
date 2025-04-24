"use client"

import { ScrollAnimation } from "@/components/scroll-animation"
import Image from "next/image"
import { useEffect, useState } from "react"

export function TechnologiesSection() {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch by only rendering after component is mounted
  useEffect(() => {
    setMounted(true)

    // Initial check
    const checkDarkMode = () => {
      const isDark = document.documentElement.classList.contains("dark")
      setIsDarkMode(isDark)
      console.log("Technologies section - Dark mode check:", isDark)
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

  return (
    <section
      className="w-full py-20 bg-background"
      style={{ transition: "background-color 0.3s ease, color 0.3s ease" }}
    >
      <div className="container mx-auto px-4">
        <ScrollAnimation delay={0.1} direction="up">
          <h2 className="text-3xl font-bold mb-12 text-center text-foreground">Tecnologías Utilizadas</h2>
        </ScrollAnimation>

        <ScrollAnimation delay={0.2} direction="up">
          <div className="flex justify-center">
            {mounted ? (
              <div className="w-full max-w-5xl">
                <div className="tech-logos-container w-full flex items-center justify-between">
                  <div className="tech-logo-item">
                    <Image
                      src={isDarkMode ? "/tech-logos/dark/meta-logo.png" : "/tech-logos/meta-logo.png"}
                      alt="Meta"
                      width={300}
                      height={120}
                      className="h-32 w-auto object-contain hover:scale-110 transition-transform duration-300"
                      unoptimized={true}
                      priority={true}
                    />
                  </div>
                  <div className="tech-logo-item">
                    <Image
                      src={isDarkMode ? "/tech-logos/dark/openai-logo.png" : "/tech-logos/openai-logo.png"}
                      alt="OpenAI"
                      width={360}
                      height={120}
                      className="h-32 w-auto object-contain hover:scale-110 transition-transform duration-300"
                      unoptimized={true}
                      priority={true}
                    />
                  </div>
                  <div className="tech-logo-item">
                    <Image
                      src={isDarkMode ? "/tech-logos/dark/anthropic-logo.png" : "/tech-logos/anthropic-logo.png"}
                      alt="Anthropic"
                      width={360}
                      height={120}
                      className="h-32 w-auto object-contain hover:scale-110 transition-transform duration-300"
                      unoptimized={true}
                      priority={true}
                    />
                  </div>
                  <div className="tech-logo-item">
                    <Image
                      src={isDarkMode ? "/tech-logos/dark/aws-logo.png" : "/tech-logos/aws-logo.png"}
                      alt="AWS"
                      width={270}
                      height={120}
                      className="h-32 w-auto object-contain hover:scale-110 transition-transform duration-300"
                      unoptimized={true}
                      priority={true}
                    />
                  </div>
                  <div className="tech-logo-item">
                    <Image
                      src={isDarkMode ? "/tech-logos/dark/perplexity-logo.png" : "/tech-logos/perplexity-logo.png"}
                      alt="Perplexity"
                      width={360}
                      height={120}
                      className="h-32 w-auto object-contain hover:scale-110 transition-transform duration-300"
                      unoptimized={true}
                      priority={true}
                    />
                  </div>
                </div>
              </div>
            ) : (
              // Placeholder durante SSR para evitar desajuste de hidratación
              <div className="h-[140px] w-full max-w-[1200px] bg-transparent"></div>
            )}
          </div>
        </ScrollAnimation>
      </div>

      {/* Estilos para los logos */}
      <style jsx global>{`
        /* Estilos comunes para ambos modos */
        .tech-logos-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          min-height: 160px;
          padding: 20px 0;
          background-color: transparent;
          margin-top: 20px;
        }

        .tech-logo-item {
          flex: 1;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 0 10px;
        }
        
        /* Asegura que las imágenes sean visibles */
        .tech-logo-item img {
          filter: brightness(1) !important;
          opacity: 1 !important;
        }
        
        /* Efecto hover para los logos */
        .tech-logo-item:hover img {
          filter: drop-shadow(0 0 8px rgba(0, 255, 157, 0.5)) !important;
        }
        
        /* Ajustes responsivos */
        @media (max-width: 768px) {
          .tech-logos-container {
            flex-wrap: nowrap;
            overflow-x: auto;
            justify-content: flex-start;
            padding: 0 10px;
            -webkit-overflow-scrolling: touch;
            scrollbar-width: none; /* Firefox */
            -ms-overflow-style: none; /* IE and Edge */
          }
          
          .tech-logos-container::-webkit-scrollbar {
            display: none; /* Chrome, Safari, Opera */
          }
          
          .tech-logo-item {
            flex: 0 0 auto;
            min-width: 150px;
          }
          
          .tech-logo-item img {
            height: 80px !important;
          }
        }
      `}</style>
    </section>
  )
}
