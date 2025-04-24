"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { ScrollAnimation } from "@/components/scroll-animation"
import { Plus, Mail, Copy, Check } from "lucide-react"
import Link from "next/link"

interface FaqItem {
  question: string
  answer: React.ReactNode
  isEmailLink?: boolean
  email?: string
  isPageLink?: boolean
  pageUrl?: string
}

export function FaqSection() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [clickedIndex, setClickedIndex] = useState<number | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [animatedItems, setAnimatedItems] = useState<boolean[]>([])
  const [copied, setCopied] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)

  // Initialize animation state for each FAQ item
  useEffect(() => {
    setAnimatedItems(new Array(faqItems.length).fill(false))

    // Set section as visible when it enters viewport
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 },
    )

    const section = document.getElementById("faq-section")
    if (section) {
      observer.observe(section)
    }

    return () => observer.disconnect()
  }, [])

  // Detectar modo oscuro/claro
  useEffect(() => {
    // Función para verificar el modo oscuro
    const checkDarkMode = () => {
      const isDark = document.documentElement.classList.contains("dark")
      setIsDarkMode(isDark)
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
  }, [])

  // Trigger staggered animations when section becomes visible
  useEffect(() => {
    if (!isVisible) return

    // Animate each FAQ item with increasing delay
    faqItems.forEach((_, index) => {
      setTimeout(() => {
        setAnimatedItems((prev) => {
          const newState = [...prev]
          newState[index] = true
          return newState
        })
      }, 300 * index) // 300ms delay between each item (increased from 150ms)
    })
  }, [isVisible])

  // Handle question click
  const handleQuestionClick = (index: number) => {
    // If the item is an email link, handle it differently
    if (faqItems[index].isEmailLink) {
      const email = faqItems[index].email || "sebastian@grupo-amia.com"
      const subject = "Tengo una duda"
      const body = "Hola, tengo una duda sobre los servicios de AMIA."

      try {
        // Try to open the mailto link
        window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
      } catch (e) {
        console.error("Failed to open email client", e)
        // If it fails, we already have a fallback UI with copy button
      }
      return
    }

    // If the item is a page link, navigate to that page
    if (faqItems[index].isPageLink) {
      window.location.href = faqItems[index].pageUrl
      return
    }

    // If the clicked question is already open, close it
    if (clickedIndex === index) {
      setClickedIndex(null)
    } else {
      // Otherwise, open the clicked question
      setClickedIndex(index)
    }
  }

  // Handle copy email to clipboard
  const handleCopyEmail = (email: string) => {
    const subject = "Tengo una duda"
    const body = "Hola, tengo una duda sobre los servicios de AMIA."

    // Create the full email content
    const emailContent = `Email: ${email}\nAsunto: ${subject}\n\n${body}`

    navigator.clipboard.writeText(emailContent).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  // Determine if an answer should be shown
  const isAnswerVisible = (index: number) => {
    return hoveredIndex === index || clickedIndex === index
  }

  const faqItems: FaqItem[] = [
    {
      question: "¿Cómo garantiza AMIA resultados reales?",
      answer:
        "Utilizamos modelos de simulación avanzados y tu propia data para crear estrategias personalizadas que maximizan oportunidades y minimizan riesgos. Nuestro proceso ha demostrado su eficacia en múltiples industrias.",
    },
    {
      question: "¿Qué resultados puedo esperar con AMIA?",
      answer:
        "Nuestro enfoque está orientado a maximizar los beneficios de tu empresa: aumentar ventas, reducir costos y tomar decisiones estratégicas que impulsen la rentabilidad. Identificamos oportunidades clave y proyectamos el impacto de cada decisión para que puedas obtener resultados claros y medibles.",
    },
    {
      question: "¿Qué tan seguro es el manejo de mis datos?",
      answer:
        "Utilizamos un proceso de ciclaje de datos para proteger la información de nuestros clientes, garantizando que cada dato esté completamente resguardado. Además, seguimos estrictamente las regulaciones de protección de datos para asegurar la confidencialidad en todo momento.",
    },
    {
      question: "¿Qué incluye la sesión estratégica gratuita?",
      answer:
        "En esta sesión, analizamos tus datos actuales, identificamos oportunidades clave y te mostramos un preview de cómo nuestras estrategias pueden transformar tu negocio.",
    },
    {
      question: "¿Qué diferencia a AMIA de una consultora tradicional?",
      answer:
        "A diferencia de las consultoras tradicionales, utilizamos IA avanzada y simulaciones predictivas para generar resultados en días, no en meses. Nuestro enfoque está 100% basado en datos y estrategias accionables.",
    },
    {
      question: "¿Qué tipo de empresas pueden beneficiarse de AMIA?",
      answer:
        "AMIA trabaja con empresas medianas y grandes que buscan transformar sus decisiones estratégicas mediante IA y datos predictivos. Sectores clave como retail, manufactura, servicios financieros y tecnología son los que más pueden aprovechar nuestras soluciones.",
    },
    {
      question: "¿Qué puedo esperar después de la primera fase?",
      answer:
        "Recibirás un plan estratégico personalizado con acciones claras. Además, te acompañamos durante la implementación para asegurarnos de que cada paso entregue resultados reales y ajustamos la estrategia según sea necesario.",
    },
    {
      question: "Tengo otra pregunta",
      answer: "Haz clic aquí para enviarnos tu pregunta y te responderemos a la brevedad.",
      isPageLink: true,
      pageUrl: "/preguntas",
    },
  ]

  return (
    <section id="faq-section" className="w-full pt-40 pb-20 bg-background">
      <div className="container mx-auto px-4">
        <ScrollAnimation delay={0.1} direction="up">
          <h2
            className="text-3xl font-bold mb-12 text-center text-foreground"
            style={{ color: isDarkMode ? "#ffffff" : "#000000" }}
          >
            ¿Tienes dudas? Nosotros las respuestas.
          </h2>
        </ScrollAnimation>

        <div className="max-w-3xl mx-auto px-4">
          {faqItems.map((item, index) => (
            <div
              key={index}
              className={`mb-2 relative faq-item ${animatedItems[index] ? "animated" : ""}`}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              style={{
                opacity: animatedItems[index] ? 1 : 0,
                transform: animatedItems[index] ? "translateY(0)" : "translateY(20px)",
                transition: `opacity 0.5s ease-out, transform 0.5s ease-out`,
                transitionDelay: `${0.15 * index}s`,
              }}
            >
              <div
                className={`p-4 bg-transparent border-b border-gray-700 cursor-pointer transition-all duration-300 hover:bg-gray-900/20 ${
                  item.isEmailLink ? "hover:bg-green-900/20" : ""
                }`}
                onClick={() => handleQuestionClick(index)}
              >
                <div className="flex items-center justify-between">
                  <h3
                    className="text-base md:text-lg font-medium text-center mx-auto"
                    style={{ color: isDarkMode ? "#ffffff" : "#000000" }}
                  >
                    {item.question}
                    {item.isEmailLink && (
                      <span className="ml-2 inline-block text-green-400">
                        <Mail className="h-4 w-4 inline-block" />
                      </span>
                    )}
                  </h3>
                  {!item.isEmailLink && (
                    <Plus
                      className={`h-5 w-5 text-foreground transition-transform duration-300 ${
                        isAnswerVisible(index) ? "transform rotate-45" : ""
                      }`}
                    />
                  )}
                </div>

                {/* Answer that appears on hover or click */}
                {!item.isEmailLink && (
                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      isAnswerVisible(index) ? "max-h-96 opacity-100 mt-3" : "max-h-0 opacity-0"
                    }`}
                  >
                    <p className="text-center" style={{ color: isDarkMode ? "#9ca3af" : "#000000" }}>
                      {item.answer}
                    </p>
                  </div>
                )}

                {/* Email content that appears when email link is clicked */}
                {item.isEmailLink && isAnswerVisible(index) && (
                  <div className="mt-3 flex flex-col items-center">
                    <p style={{ color: isDarkMode ? "#9ca3af" : "#000000" }} className="text-center mb-2">
                      {item.answer}
                    </p>
                    <div className="flex items-center mt-2">
                      <span className="mr-2" style={{ color: isDarkMode ? "#ffffff" : "#000000" }}>
                        {item.email}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleCopyEmail(item.email || "sebastian@grupo-amia.com")
                        }}
                        className="p-1 rounded-md hover:bg-green-500/20 transition-colors"
                        title="Copiar información de contacto"
                      >
                        {copied ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <Copy className="h-4 w-4 text-green-400" />
                        )}
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Haz clic para enviar un correo o copia la información</p>
                  </div>
                )}

                {/* Page link content that appears when page link is clicked */}
                {item.isPageLink && isAnswerVisible(index) && (
                  <div className="mt-3 flex flex-col items-center">
                    <Link
                      href={item.pageUrl}
                      className="mt-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                    >
                      Enviar pregunta
                    </Link>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
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
    </section>
  )
}
