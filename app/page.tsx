"use client"

import { SplineViewer } from "@/components/spline-viewer"
import NavigationTabs from "@/components/navigation-tabs"
import { DarkModeLogo } from "@/components/dark-mode-logo"
import Link from "next/link"
import { ProductSection } from "@/components/product-section"
import { TechnologiesSection } from "@/components/technologies-section"
import { CompaniesSection } from "@/components/companies-section"
import { QuoteSection } from "@/components/quote-section"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { FaqSection } from "@/components/faq-section"
import HalftoneWaves from "@/components/halftone-waves"
import { CTASection } from "@/components/cta-section"
import { ContactSection } from "@/components/contact-section"
import { ArrowRight } from "lucide-react"

export default function Home() {
  const { theme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch by only rendering after component is mounted
  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="relative w-full min-h-screen overflow-x-hidden">
      {/* Header con navegación responsiva */}
      <header className="fixed top-0 left-0 right-0 z-50 px-4 md:px-6 py-4 flex justify-between items-center bg-transparent">
        <Link href="/" className="flex items-center">
          <DarkModeLogo className="h-10 md:h-12 w-auto" />
        </Link>
        <NavigationTabs />
      </header>

      {/* Hero Section with Spline */}
      <section className="relative w-full min-h-screen bg-transparent">
        {/* Spline viewer - visible solo en pantallas medianas y grandes */}
        <div className="hidden md:block">
          <SplineViewer />
        </div>

        {/* Main content - ajustado para ser responsivo */}
        <div className="absolute top-0 left-0 md:left-[5%] lg:left-[10%] w-full md:w-55% h-full flex flex-col justify-center px-6 md:px-10 lg:px-16 pt-24 md:pt-0 z-1">
          <div className="max-w-2xl">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 md:mb-10 leading-tight text-foreground">
              <span>Transformamos la información de tu negocio en decisiones estratégicas precisas.</span>
            </h1>
            <p className="text-base md:text-lg mb-8 md:mb-12 max-w-full md:max-w-90% text-foreground">
              <span className="text-gray-400">
                AMIA integra todos los datos de tu operación para mostrarte el camino más claro, preciso y accionable
                hacia tus objetivos.
              </span>
              <br />
              <br />
              <strong>Decide con confianza, decide con Amia.</strong>
            </p>
            <Link href="/demo-request">
              <button className="w-full sm:w-auto bg-foreground text-background hover:bg-foreground/90 px-6 py-3 md:px-8 md:py-4 text-base md:text-lg font-bold transition-colors duration-100 cta-button group relative overflow-hidden gradient-text-container cursor-glow-effect">
                <span className="gradient-text">Solicitar un demo</span>
                <ArrowRight className="ml-2 h-4 w-4 inline-block gradient-icon" />
                <span className="absolute inset-0 pointer-events-none green-wave-effect"></span>
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Companies section with transparent background - positioned lower */}
      <div
        style={{
          position: "relative",
          zIndex: 5,
          background: "transparent",
        }}
      >
        <CompaniesSection />
      </div>

      {/* Quote Section - Now with transparent background */}
      <div id="circles-section" className="relative pt-20" style={{ paddingBottom: "20vh" }}>
        <QuoteSection />
      </div>

      {/* Additional Sections - all with black background */}
      <div className="bg-black">
        <ProductSection />
        <TechnologiesSection />
        <FaqSection />
        <CTASection />

        {/* Hidden HalftoneWaves */}
        <HalftoneWaves />

        {/* Contact Section - now at the very end */}
        <ContactSection />
      </div>

      {/* Add global styles for CTA buttons */}
      <style jsx global>{`
        .cta-button {
          transform-origin: center;
          transition: transform 0.3s ease, background-color 0.3s ease, font-weight 0.3s ease, font-size 0.3s ease, color 0.3s ease;
          position: relative;
          z-index: 1;
        }
        .cta-button:hover {
          transform: scale(1.1);
          background-color: rgba(200, 255, 220, 0.9) !important;
          box-shadow: 0 0 15px rgba(180, 255, 200, 0.5);
          font-weight: 700 !important;
          font-size: 1.05em !important;
          color: black !important;
        }
        
        /* Neon straight lines effect */
        .neon-button {
          overflow: visible;
        }
        
        .neon-button::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 100%;
          height: 100%;
          transform: translate(-50%, -50%);
          background: transparent;
          z-index: -1;
          pointer-events: none;
        }
        
        /* Horizontal and vertical lines */
        .neon-button::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: -1;
          opacity: 0;
          pointer-events: none;
        }
        
        /* Neon lines animation */
        .neon-button:hover::before {
          animation: expandNeonLines 1.5s infinite;
        }
        
        @keyframes expandNeonLines {
          0% {
            box-shadow: 
              /* Center glow */
              0 0 10px 2px rgba(180, 255, 200, 0.7),
              0 0 20px 5px rgba(180, 255, 200, 0.5),
              
              /* Horizontal lines - right */
              calc(50% + 0px) 0 2px 2px rgba(180, 255, 200, 0.9),
              
              /* Horizontal lines - left */
              calc(-50% - 0px) 0 2px 2px rgba(180, 255, 200, 0.9),
              
              /* Vertical lines - top */
              0 calc(-50% - 0px) 2px 2px rgba(180, 255, 200, 0.9),
              
              /* Vertical lines - bottom */
              0 calc(50% + 0px) 2px 2px rgba(180, 255, 200, 0.9),
              
              /* Diagonal lines - top-right */
              calc(35% + 0px) calc(-35% - 0px) 2px 2px rgba(180, 255, 200, 0.9),
              
              /* Diagonal lines - top-left */
              calc(-35% - 0px) calc(-35% - 0px) 2px 2px rgba(180, 255, 200, 0.9),
              
              /* Diagonal lines - bottom-right */
              calc(35% + 0px) calc(35% + 0px) 2px 2px rgba(180, 255, 200, 0.9),
              
              /* Diagonal lines - bottom-left */
              calc(-35% - 0px) calc(35% + 0px) 2px 2px rgba(180, 255, 200, 0.9);
          }
          
          25% {
            box-shadow: 
              /* Center glow */
              0 0 10px 2px rgba(180, 255, 200, 0.7),
              0 0 20px 5px rgba(180, 255, 200, 0.5),
              
              /* Horizontal lines - right */
              calc(50% + 20px) 0 2px 2px rgba(180, 255, 200, 0.9),
              
              /* Horizontal lines - left */
              calc(-50% - 20px) 0 2px 2px rgba(180, 255, 200, 0.9),
              
              /* Vertical lines - top */
              0 calc(-50% - 20px) 2px 2px rgba(180, 255, 200, 0.9),
              
              /* Vertical lines - bottom */
              0 calc(50% + 20px) 2px 2px rgba(180, 255, 200, 0.9),
              
              /* Diagonal lines - top-right */
              calc(35% + 15px) calc(-35% - 15px) 2px 2px rgba(180, 255, 200, 0.9),
              
              /* Diagonal lines - top-left */
              calc(-35% - 15px) calc(-35% - 15px) 2px 2px rgba(180, 255, 200, 0.9),
              
              /* Diagonal lines - bottom-right */
              calc(35% + 15px) calc(35% + 15px) 2px 2px rgba(180, 255, 200, 0.9),
              
              /* Diagonal lines - bottom-left */
              calc(-35% - 15px) calc(35% + 15px) 2px 2px rgba(180, 255, 200, 0.9);
          }
          
          50% {
            box-shadow: 
              /* Center glow */
              0 0 10px 2px rgba(180, 255, 200, 0.7),
              0 0 20px 5px rgba(180, 255, 200, 0.5),
              
              /* Horizontal lines - right */
              calc(50% + 40px) 0 2px 2px rgba(180, 255, 200, 0.9),
              
              /* Horizontal lines - left */
              calc(-50% - 40px) 0 2px 2px rgba(180, 255, 200, 0.9),
              
              /* Vertical lines - top */
              0 calc(-50% - 40px) 2px 2px rgba(180, 255, 200, 0.9),
              
              /* Vertical lines - bottom */
              0 calc(50% + 40px) 2px 2px rgba(180, 255, 200, 0.9),
              
              /* Diagonal lines - top-right */
              calc(35% + 30px) calc(-35% - 30px) 2px 2px rgba(180, 255, 200, 0.9),
              
              /* Diagonal lines - top-left */
              calc(-35% - 30px) calc(-35% - 30px) 2px 2px rgba(180, 255, 200, 0.9),
              
              /* Diagonal lines - bottom-right */
              calc(35% + 30px) calc(35% + 30px) 2px 2px rgba(180, 255, 200, 0.9),
              
              /* Diagonal lines - bottom-left */
              calc(-35% - 30px) calc(35% + 30px) 2px 2px rgba(180, 255, 200, 0.9);
          }
          
          75% {
            box-shadow: 
              /* Center glow */
              0 0 10px 2px rgba(180, 255, 200, 0.7),
              0 0 20px 5px rgba(180, 255, 200, 0.5),
              
              /* Horizontal lines - right */
              calc(50% + 60px) 0 2px 2px rgba(180, 255, 200, 0.9),
              
              /* Horizontal lines - left */
              calc(-50% - 60px) 0 2px 2px rgba(180, 255, 200, 0.9),
              
              /* Vertical lines - top */
              0 calc(-50% - 60px) 2px 2px rgba(180, 255, 200, 0.9),
              
              /* Vertical lines - bottom */
              0 calc(50% + 60px) 2px 2px rgba(180, 255, 200, 0.9),
              
              /* Diagonal lines - top-right */
              calc(35% + 45px) calc(-35% - 45px) 2px 2px rgba(180, 255, 200, 0.9),
              
              /* Diagonal lines - top-left */
              calc(-35% - 45px) calc(-35% - 45px) 2px 2px rgba(180, 255, 200, 0.9),
              
              /* Diagonal lines - bottom-right */
              calc(35% + 45px) calc(35% + 45px) 2px 2px rgba(180, 255, 200, 0.9),
              
              /* Diagonal lines - bottom-left */
              calc(-35% - 45px) calc(35% + 45px) 2px 2px rgba(180, 255, 200, 0.9);
          }
          
          100% {
            box-shadow: 
              /* Center glow */
              0 0 10px 2px rgba(180, 255, 200, 0.7),
              0 0 20px 5px rgba(180, 255, 200, 0.5),
              
              /* Horizontal lines - right */
              calc(50% + 80px) 0 2px 2px rgba(180, 255, 200, 0.9),
              
              /* Horizontal lines - left */
              calc(-50% - 80px) 0 2px 2px rgba(180, 255, 200, 0.9),
              
              /* Vertical lines - top */
              0 calc(-50% - 80px) 2px 2px rgba(180, 255, 200, 0.9),
              
              /* Vertical lines - bottom */
              0 calc(50% + 80px) 2px 2px rgba(180, 255, 200, 0.9),
              
              /* Diagonal lines - top-right */
              calc(35% + 60px) calc(-35% - 60px) 2px 2px rgba(180, 255, 200, 0.9),
              
              /* Diagonal lines - top-left */
              calc(-35% - 60px) calc(-35% - 60px) 2px 2px rgba(180, 255, 200, 0.9),
              
              /* Diagonal lines - bottom-right */
              calc(35% + 60px) calc(35% + 60px) 2px 2px rgba(180, 255, 200, 0.9),
              
              /* Diagonal lines - bottom-left */
              calc(-35% - 60px) calc(35% + 60px) 2px 2px rgba(180, 255, 200, 0.9);
          }
        }

        /* Tech button animations */
        .tech-button {
          position: relative;
          overflow: hidden;
          isolation: isolate;
        }

        /* Digital circuit lines */
        .tech-button::before {
          content: '';
          position: absolute;
          inset: -2px;
          background: linear-gradient(90deg, transparent, transparent);
          opacity: 0;
          z-index: -1;
          transition: opacity 0.3s;
          background-size: 400% 400%;
          pointer-events: none;
        }

        .tech-button:hover::before {
          opacity: 1;
          background: linear-gradient(90deg, 
            rgba(180, 255, 200, 0.1), 
            rgba(180, 255, 200, 0.3), 
            rgba(180, 255, 200, 0.1)
          );
          animation: circuitFlow 3s linear infinite;
        }

        @keyframes circuitFlow {
          0% {
            background-position: 0% 50%;
            box-shadow: 
              inset 0 0 10px rgba(180, 255, 200, 0.3),
              inset 0 0 20px rgba(180, 255, 200, 0.1);
          }
          50% {
            background-position: 100% 50%;
            box-shadow: 
              inset 0 0 15px rgba(180, 255, 200, 0.5),
              inset 0 0 30px rgba(180, 255, 200, 0.2);
          }
          100% {
            background-position: 0% 50%;
            box-shadow: 
              inset 0 0 10px rgba(180, 255, 200, 0.3),
              inset 0 0 20px rgba(180, 255, 200, 0.1);
          }
        }

        /* Tech particles effect */
        .tech-particles {
          position: absolute;
          inset: 0;
          z-index: -1;
          opacity: 0;
          transition: opacity 0.3s;
          pointer-events: none;
        }

        .tech-button:hover .tech-particles {
          opacity: 1;
          animation: particlesEffect 2s linear infinite;
        }

        @keyframes particlesEffect {
          0%, 100% {
            background-image: 
              radial-gradient(circle at 20% 30%, rgba(180, 255, 200, 0.7) 1px, transparent 1px),
              radial-gradient(circle at 40% 70%, rgba(180, 255, 200, 0.5) 1px, transparent 1px),
              radial-gradient(circle at 60% 20%, rgba(180, 255, 200, 0.7) 1px, transparent 1px),
              radial-gradient(circle at 80% 50%, rgba(180, 255, 200, 0.5) 1px, transparent 1px);
            background-size: 100% 100%;
          }
          50% {
            background-image: 
              radial-gradient(circle at 30% 40%, rgba(180, 255, 200, 0.7) 1px, transparent 1px),
              radial-gradient(circle at 50% 60%, rgba(180, 255, 200, 0.5) 1px, transparent 1px),
              radial-gradient(circle at 70% 30%, rgba(180, 255, 200, 0.7) 1px, transparent 1px),
              radial-gradient(circle at 90% 60%, rgba(180, 255, 200, 0.5) 1px, transparent 1px);
            background-size: 100% 100%;
          }
        }

        /* Tech grid effect */
        .tech-grid {
          position: absolute;
          inset: 0;
          z-index: -2;
          opacity: 0;
          transition: opacity 0.3s;
          background-image: 
            linear-gradient(rgba(180, 255, 200, 0.2) 1px, transparent 1px),
            linear-gradient(90deg, rgba(180, 255, 200, 0.2) 1px, transparent 1px);
          background-size: 10px 10px;
          pointer-events: none;
        }

        .tech-button:hover .tech-grid {
          opacity: 0.3;
          animation: gridMove 3s linear infinite;
        }

        @keyframes gridMove {
          0% {
            background-position: 0px 0px;
          }
          100% {
            background-position: 10px 10px;
          }
        }

        /* Tech scanning effect */
        .tech-scan {
          position: absolute;
          inset: 0;
          z-index: -1;
          opacity: 0;
          transition: opacity 0.3s;
          pointer-events: none;
        }

        .tech-button:hover .tech-scan {
          opacity: 1;
          animation: scanEffect 2s linear infinite;
        }

        @keyframes scanEffect {
          0% {
            box-shadow: inset 0 -100px 0 rgba(180, 255, 200, 0.1);
          }
          50% {
            box-shadow: inset 0 100px 0 rgba(180, 255, 200, 0.1);
          }
          100% {
            box-shadow: inset 0 -100px 0 rgba(180, 255, 200, 0.1);
          }
        }

        /* Enhanced hover state */
        .tech-button:hover {
          text-shadow: 0 0 5px rgba(255, 255, 255, 0.8);
          border: 1px solid rgba(180, 255, 200, 0.5);
        }

        /* Cursor glow effect for all buttons */
        .cursor-glow-effect {
          position: relative;
        }

        .cursor-glow-effect::before {
          content: '';
          position: absolute;
          width: 0;
          height: 0;
          left: var(--cursor-x, 50%);
          top: var(--cursor-y, 50%);
          border-radius: 50%;
          background: radial-gradient(circle, rgba(0,255,157,0.2) 0%, rgba(0,0,0,0) 70%);
          transform: translate(-50%, -50%);
          opacity: 0;
          transition: width 0.2s ease, height 0.2s ease, opacity 0.2s ease;
          pointer-events: none;
          z-index: -1;
        }

        .cursor-glow-effect:hover::before {
          width: 300px;
          height: 300px;
          opacity: 1;
        }
      `}</style>
    </div>
  )
}
