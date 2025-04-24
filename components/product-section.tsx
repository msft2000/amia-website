"use client"

import { useEffect, useState, useRef } from "react"
import { X } from "lucide-react"
import { useTheme } from "next-themes"
import Link from "next/link"

export function ProductSection() {
  const [mounted, setMounted] = useState(false)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [openPopupIndex, setOpenPopupIndex] = useState<number | null>(null)
  const popupRef = useRef<HTMLDivElement>(null)
  const { theme } = useTheme()

  // Detailed popup content for each product
  const detailedContent = [
    {
      title: "THOT",
      subtitle: "Análisis Estratégico 360",
      description: "Detecta oportunidades y riesgos clave con un análisis en tiempo récord.",
      details:
        "Identifica los puntos críticos de tu negocio. Elimina suposiciones y datos inexactas. Crea una hoja de ruta clara y accionable.",
    },
    {
      title: "ATHENA",
      subtitle: "Simulaciones Predictivas",
      description: "Evalúa decisiones con decenas de miles de simulaciones predictivas.",
      details:
        "Reduce riesgos y sesgos hasta en un 40%. Predice resultados con un 95% de precisión. Optimiza el impacto de procesos clave.",
    },
    {
      title: "ALEXANDER",
      subtitle: "Plan de Acción Estrategico",
      description: "Convierte estrategias en un plan de acción claro y definido para facilitar su seguimiento.",
      details:
        "Implementación rápida y efectiva. Ajustes en tiempo real según los datos. Resultados medibles y sostenibles.",
    },
  ]

  // Avoid hydration mismatch by only rendering after component is mounted
  useEffect(() => {
    setMounted(true)
  }, [])

  // Close popup when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        setOpenPopupIndex(null)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Add body class to prevent scrolling when popup is open
  useEffect(() => {
    if (openPopupIndex !== null) {
      document.body.classList.add("overflow-hidden")
    } else {
      document.body.classList.remove("overflow-hidden")
    }

    return () => {
      document.body.classList.remove("overflow-hidden")
    }
  }, [openPopupIndex])

  return (
    <section
      id="modelos-section"
      className="w-full pt-0 pb-20 bg-background"
      style={{ transition: "background-color 0.3s ease, color 0.3s ease" }}
    >
      <style jsx>{`
        @keyframes rollInBounce {
          0% { transform: rotate(-360deg) scale(0); opacity: 0; }
          60% { transform: rotate(0) scale(1.3); opacity: 1; }
          75% { transform: rotate(0) scale(0.9); opacity: 1; }
          85% { transform: rotate(0) scale(1.1); opacity: 1; }
          100% { transform: rotate(0) scale(1); opacity: 1; }
        }
        
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }
        
        @keyframes fadeIn {
          0% { opacity: 0; transform: translateY(5px); }
          100% { opacity: 0.7; transform: translateY(0); }
        }
        
        .roll-in {
          animation: rollInBounce 0.8s ease-out forwards, pulse 2.5s ease-in-out 0.8s infinite;
        }
        
        .fade-in-click {
          animation: fadeIn 0.5s ease-out 1s forwards;
          opacity: 0;
        }
      `}</style>
      <div className="container mx-auto px-4 bg-background" style={{ marginTop: "2rem", paddingTop: "3rem" }}>
        {/* Added the requested title */}
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center text-foreground transition-colors duration-100">
          Modelos entrenados exclusivamente para tu negocio
        </h2>
        <div className="max-w-3xl mx-auto text-center mb-8 md:mb-16 px-4">
          <p className="text-base md:text-lg text-foreground/80 mb-4">
            <strong>Nuestros modelos analizan tus datos, tus procesos y tu mercado</strong> para entregarte
            predicciones, análisis y decisiones adaptadas a tu negocio, mientras protegen todos tus datos desde el
            inicio hasta el fin del proceso.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {[
            {
              icon: "⚲",
              name: "THOT",
              description: "Análisis Estratégico 360",
              popupDescription: "Detecta oportunidades y riesgos clave con un análisis en tiempo récord.",
            },
            {
              icon: "❖",
              name: "ATHENA",
              description: "Simulaciones Predictivas",
              popupDescription: "Evalúa decisiones con decenas de miles de simulaciones predictivas.",
            },
            {
              icon: "⎈",
              name: "ALEXANDER",
              description: "Plan de Acción Estratégico",
              popupDescription:
                "Convierte estrategias en un plan de acción claro y definido para facilitar su seguimiento.",
            },
          ].map((product, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center cursor-pointer relative"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div
                className={`text-4xl mb-6 text-foreground transition-all duration-300 ${
                  hoveredIndex === index ? "transform scale-125 text-shadow-glow" : ""
                }`}
                style={{
                  textShadow: hoveredIndex === index ? "0 0 10px currentColor" : "none",
                }}
              >
                {product.icon}
              </div>
              <h3
                className={`text-xl font-bold mb-4 text-foreground transition-all duration-300 ${
                  hoveredIndex === index ? "transform scale-110 text-shadow-glow" : ""
                }`}
                style={{
                  textShadow: hoveredIndex === index ? "0 0 8px currentColor" : "none",
                }}
              >
                {product.name}
              </h3>
              <p className="text-foreground transition-colors duration-100">{product.description}</p>

              {/* Popup description with + sign */}
              {product.popupDescription && (
                <div
                  className={`mt-4 text-foreground/70 max-w-xs transition-all duration-300 ${
                    hoveredIndex === index
                      ? "opacity-100 transform translate-y-0"
                      : "opacity-0 transform -translate-y-2 pointer-events-none"
                  }`}
                >
                  {product.popupDescription}
                  <div className="relative inline-block">
                    <button
                      className={`ml-2 text-foreground font-bold text-lg ${hoveredIndex === index ? "roll-in" : ""}`}
                      onClick={(e) => {
                        e.stopPropagation()
                        setOpenPopupIndex(index)
                      }}
                    >
                      +
                    </button>
                    {hoveredIndex === index && (
                      <span className="fade-in-click absolute -right-2 -bottom-6 text-xs text-foreground/70 whitespace-nowrap">
                        ↑ click
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Detailed popup screen with blurred background */}
      {openPopupIndex !== null && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-md flex items-center justify-center z-50 transition-all duration-300"
          onClick={() => setOpenPopupIndex(null)}
        >
          <div
            ref={popupRef}
            className="bg-background text-foreground p-8 rounded-lg max-w-md w-full relative shadow-2xl transform transition-all duration-300 scale-100"
            onClick={(e) => e.stopPropagation()}
            onMouseLeave={() => setOpenPopupIndex(null)}
          >
            <button
              className="cta-button absolute top-4 right-4 text-foreground hover:text-gray-400 transition-colors"
              onClick={() => setOpenPopupIndex(null)}
            >
              <X size={24} />
            </button>

            <h2 className="text-2xl font-bold mb-2">{detailedContent[openPopupIndex].title}</h2>
            <h3 className="text-xl mb-4">{detailedContent[openPopupIndex].subtitle}</h3>
            <p className="mb-4 text-foreground/70">{detailedContent[openPopupIndex].description}</p>
            <p className="text-foreground">{detailedContent[openPopupIndex].details}</p>
            <Link href="/demo-request">
              <button className="mt-8 px-6 py-3 rounded-lg font-medium shadow-lg cta-button transition-all duration-300 bg-foreground text-background hover:bg-foreground/90 cursor-glow-effect">
                Solicitar Demo
              </button>
            </Link>
          </div>
        </div>
      )}
    </section>
  )
}
