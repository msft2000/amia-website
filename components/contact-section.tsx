"use client"

import { ScrollAnimation } from "@/components/scroll-animation"
import { Mail, Phone, Copy, Check } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export function ContactSection() {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Handle copy email to clipboard
  const handleCopyEmail = (email: string) => {
    const subject = "Tengo una duda"
    const body = "Hola, tengo una duda sobre los servicios de AMIA."

    // Create the full email content
    const emailContent = `Email: ${email}\nAsunto: ${subject}\n\n${body}`

    navigator.clipboard.writeText(emailContent).then(() => {
      setCopiedEmail(email)
      setTimeout(() => setCopiedEmail(null), 2000)
    })
  }

  return (
    <section
      id="contacto-section"
      className="w-full py-20 relative bg-background"
      style={{
        transition: "background-color 0.3s ease, color 0.3s ease",
      }}
    >
      {/* Remove the subtle gradient overlay that was here */}

      {/* Add decorative elements - with transparent background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ backgroundColor: "transparent" }}>
        {/* Animated gradient overlay - made transparent */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            background: "transparent",
            backgroundSize: "400% 400%",
            animation: "gradientShift 15s ease infinite",
          }}
        ></div>

        {/* Keep only the subtle decorative elements that don't affect background color */}
        <div className="absolute top-0 left-1/4 w-1/2 h-20 bg-green-500/5 blur-3xl rounded-full animate-pulse"></div>

        {/* Digital circuit lines - with reduced opacity */}
        <div className="absolute inset-0" style={{ opacity: 0.05 }}>
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="circuit-grid" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse">
                <path d="M 50 0 L 0 0 0 50" fill="none" stroke="rgba(0, 255, 157, 0.07)" strokeWidth="0.5"></path>
                <circle cx="0" cy="0" r="1" fill="rgba(0, 255, 157, 0.05)"></circle>
                <circle cx="50" cy="0" r="1" fill="rgba(0, 255, 157, 0.05)"></circle>
                <circle cx="0" cy="50" r="1" fill="rgba(0, 255, 157, 0.05)"></circle>
              </pattern>
            </defs>
            <rect x="0" y="0" width="100%" height="100%" fill="url(#circuit-grid)"></rect>
          </svg>
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <ScrollAnimation delay={0.3} direction="up">
          <h3 className="text-2xl font-bold mb-8 text-center text-foreground">
            <span className="inline-block relative">
              Contacto
              <span className="absolute -bottom-2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-green-400 to-transparent"></span>
            </span>
          </h3>

          <div className={`flex flex-col items-center justify-center max-w-3xl mx-auto`}>
            <div className="space-y-8">
              {/* US Contact */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center transform transition-all duration-300 hover:translate-x-2 hover:scale-105">
                <div className="mr-4 relative w-8 h-6 overflow-hidden rounded mb-2 sm:mb-0">
                  <img src="/usflag.png" alt="US Flag" className="w-full h-full object-contain" />
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 text-green-400 mr-2" />
                    <span className="text-foreground">+1 (305) 202-4734</span>
                  </div>
                  <div className="flex items-center mt-1">
                    <Mail className="h-5 w-5 text-green-400 mr-2" />
                    <a
                      href={`mailto:alejandro@grupo-amia.com?subject=${encodeURIComponent("Tengo una duda")}&body=${encodeURIComponent("Hola, tengo una duda sobre los servicios de AMIA.")}`}
                      className="text-foreground hover:text-green-400 transition-colors"
                    >
                      alejandro@grupo-amia.com
                    </a>
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        handleCopyEmail("alejandro@grupo-amia.com")
                      }}
                      className="ml-2 p-1 rounded-md hover:bg-green-500/20 transition-colors"
                      title="Copiar información de contacto"
                    >
                      {copiedEmail === "alejandro@grupo-amia.com" ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4 text-green-400" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Mexican Contact */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center transform transition-all duration-300 hover:translate-x-2 hover:scale-105">
                <div className="mr-4 relative w-8 h-6 overflow-hidden rounded mb-2 sm:mb-0">
                  <img src="/mexicoflag.png" alt="Mexico Flag" className="w-full h-full object-contain" />
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 text-green-400 mr-2" />
                    <span className="text-foreground">+52 55 2773 6056</span>
                  </div>
                  <div className="flex items-center mt-1">
                    <Mail className="h-5 w-5 text-green-400 mr-2" />
                    <a
                      href={`mailto:luis@grupo-amia.com?subject=${encodeURIComponent("Tengo una duda")}&body=${encodeURIComponent("Hola, tengo una duda sobre los servicios de AMIA.")}`}
                      className="text-foreground hover:text-green-400 transition-colors"
                    >
                      luis@grupo-amia.com
                    </a>
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        handleCopyEmail("luis@grupo-amia.com")
                      }}
                      className="ml-2 p-1 rounded-md hover:bg-green-500/20 transition-colors"
                      title="Copiar información de contacto"
                    >
                      {copiedEmail === "luis@grupo-amia.com" ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4 text-green-400" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Ecuadorian Contact */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center transform transition-all duration-300 hover:translate-x-2 hover:scale-105">
                <div className="mr-4 relative w-8 h-6 overflow-hidden rounded mb-2 sm:mb-0">
                  <img src="/ecuadorflag.png" alt="Ecuador Flag" className="w-full h-full object-contain" />
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 text-green-400 mr-2" />
                    <span className="text-foreground">+593 96 941 6852</span>
                  </div>
                  <div className="flex items-center mt-1">
                    <Mail className="h-5 w-5 text-green-400 mr-2" />
                    <a
                      href={`mailto:sebastian@grupo-amia.com?subject=${encodeURIComponent("Tengo una duda")}&body=${encodeURIComponent("Hola, tengo una duda sobre los servicios de AMIA.")}`}
                      className="text-foreground hover:text-green-400 transition-colors"
                    >
                      sebastian@grupo-amia.com
                    </a>
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        handleCopyEmail("sebastian@grupo-amia.com")
                      }}
                      className="ml-2 p-1 rounded-md hover:bg-green-500/20 transition-colors"
                      title="Copiar información de contacto"
                    >
                      {copiedEmail === "sebastian@grupo-amia.com" ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4 text-green-400" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollAnimation>
      </div>

      {/* Add animation styles */}
      <style jsx>{`
        @keyframes floatParticle {
          0% {
            transform: translateY(0) translateX(0);
            opacity: 0;
          }
          10% {
            opacity: 0.8;
          }
          90% {
            opacity: 0.4;
          }
          100% {
            transform: translateY(-300px) translateX(${Math.random() * 100 - 50}px);
            opacity: 0;
          }
        }
        
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        @keyframes digitalRain {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(1000%); }
        }
        
        .animate-pulse-slow {
          animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        .animate-pulse-slower {
          animation: pulse 6s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.8; }
        }
      `}</style>
    </section>
  )
}
