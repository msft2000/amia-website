"use client"

import { useEffect, useRef, useState } from "react"
import { useTheme } from "next-themes"
import { ArrowRight, Sparkles } from "lucide-react"
import { ScrollAnimation } from "@/components/scroll-animation"
import Link from "next/link"

export function CTASection() {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isInView, setIsInView] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number | null>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  // Avoid hydration mismatch by only rendering after component is mounted
  useEffect(() => {
    setMounted(true)
  }, [])

  // Handle intersection observer to detect when section is in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true)
          } else {
            setIsInView(false)
          }
        })
      },
      { threshold: 0.1 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current)
      }
    }
  }, [])

  // Handle mouse movement ONLY for the button
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect()
        // Solo actualizar la posición del mouse si está sobre el botón
        if (e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom) {
          setMousePosition({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
          })
        }
      }
    }

    // Solo añadir el listener al botón, no a toda la sección
    if (buttonRef.current) {
      buttonRef.current.addEventListener("mousemove", handleMouseMove)
    }

    return () => {
      if (buttonRef.current) {
        buttonRef.current.removeEventListener("mousemove", handleMouseMove)
      }
    }
  }, [mounted])

  // Canvas animation for the flowing particles effect - only active when button is hovered
  useEffect(() => {
    if (!canvasRef.current || !isInView) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect()
      const dpr = window.devicePixelRatio || 1
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      ctx.scale(dpr, dpr)
      canvas.style.width = `${rect.width}px`
      canvas.style.height = `${rect.height}px`
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Particle class
    class Particle {
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      color: string
      opacity: number
      life: number
      maxLife: number

      constructor(x: number, y: number) {
        this.x = x
        this.y = y
        this.size = Math.random() * 3 + 1
        this.speedX = Math.random() * 2 - 1
        this.speedY = Math.random() * 2 - 1
        // Always use green regardless of theme
        this.color = "#00ff9d"
        this.opacity = Math.random() * 0.6 + 0.2
        this.life = 0
        this.maxLife = Math.random() * 100 + 50
      }

      update() {
        this.x += this.speedX
        this.y += this.speedY
        this.life++
        if (this.life >= this.maxLife) {
          this.opacity -= 0.02
        }
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${this.color
          .replace("#", "")
          .match(/.{2}/g)
          ?.map((hex) => Number.parseInt(hex, 16))
          .join(", ")}, ${this.opacity})`
        ctx.fill()
      }
    }

    // Create particles array
    const particles: Particle[] = []
    const maxParticles = 100

    // Animation function
    const animate = () => {
      // Solo animar si el botón está en hover
      if (isHovered) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        // Add new particles
        if (particles.length < maxParticles && Math.random() > 0.9) {
          const x = Math.random() * canvas.width
          const y = Math.random() * canvas.height
          particles.push(new Particle(x, y))
        }

        // Update and draw particles
        for (let i = 0; i < particles.length; i++) {
          particles[i].update()
          particles[i].draw(ctx)

          // Remove particles with no opacity
          if (particles[i].opacity <= 0) {
            particles.splice(i, 1)
            i--
          }
        }

        // Draw connection lines between nearby particles
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x
            const dy = particles[i].y - particles[j].y
            const distance = Math.sqrt(dx * dx + dy * dy)

            if (distance < 100) {
              ctx.beginPath()
              ctx.strokeStyle = `rgba(0, 255, 157, ${0.1 * (1 - distance / 100)})`
              ctx.lineWidth = 0.5
              ctx.moveTo(particles[i].x, particles[i].y)
              ctx.lineTo(particles[j].x, particles[j].y)
              ctx.stroke()
            }
          }
        }
      } else {
        // Si no está en hover, limpiar el canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        // Y vaciar el array de partículas
        particles.length = 0
      }

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [isInView, theme, isHovered]) // Añadir isHovered como dependencia

  // Actualizar el efecto de cursor glow solo para el botón
  useEffect(() => {
    if (!mounted) return

    const handleMouseMove = (e: MouseEvent) => {
      // Solo aplicar el efecto al botón
      if (buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect()
        const isButtonHovered =
          e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom

        if (isButtonHovered) {
          const x = e.clientX - rect.left
          const y = e.clientY - rect.top
          buttonRef.current.style.setProperty("--cursor-x", `${x}px`)
          buttonRef.current.style.setProperty("--cursor-y", `${y}px`)
        }
      }
    }

    // Solo añadir el listener al documento si es necesario para el botón
    document.addEventListener("mousemove", handleMouseMove)

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
    }
  }, [mounted])

  return (
    <section
      ref={sectionRef}
      className="relative w-full py-24 overflow-hidden bg-background"
      style={{
        transition: "background-color 0.3s ease, color 0.3s ease",
        zIndex: 1, // Reducir el z-index para que sea menor que el del header
      }}
    >
      {/* Canvas background for particle animation */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{
          opacity: isHovered ? 0.5 : 0, // Solo mostrar cuando el botón está en hover
          mixBlendMode: "normal",
          backgroundColor: "transparent",
          pointerEvents: "none",
          zIndex: 1, // Asignar un z-index bajo
          transition: "opacity 0.3s ease", // Transición suave para la opacidad
        }}
      />

      {/* Hacer la sección CTA responsiva */}
      <div className="container relative z-2 mx-auto px-4" style={{ pointerEvents: "auto" }}>
        <div className="max-w-4xl mx-auto text-center">
          <ScrollAnimation delay={0.1} direction="up">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-foreground">
              <span className="relative inline-block">
                Transforma tu negocio
                <span className="absolute -top-6 -right-6 hidden md:block">
                  <Sparkles className="h-8 w-8 text-green-400 animate-pulse" />
                </span>
              </span>
              <br />
              <span className="bg-gradient-to-r from-green-700 via-green-400 to-green-200 text-transparent bg-clip-text mt-2 block">
                con el poder de tus datos
              </span>
            </h2>
          </ScrollAnimation>

          <ScrollAnimation delay={0.2} direction="up">
            <p className="text-lg md:text-xl text-foreground/70 mb-8 md:mb-10 max-w-3xl mx-auto px-4">
              Descubre cómo AMIA puede transformar tus datos en decisiones estratégicas precisas y maximizar el
              potencial de tu empresa con soluciones de IA personalizadas.
            </p>
          </ScrollAnimation>

          <ScrollAnimation delay={0.3} direction="up">
            <div className="flex items-center justify-center">
              <Link href="/demo-request">
                <button
                  ref={buttonRef}
                  className="cta-mega-button group relative overflow-hidden rounded-lg px-6 md:px-8 py-3 md:py-4 text-base md:text-lg font-bold text-black transition-all duration-300 cursor-glow-effect"
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                >
                  <span className="relative z-10 pr-4">Solicitar una demo</span>
                  <span className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-300 transition-all duration-300 group-hover:scale-105"></span>
                  <span className="absolute inset-0 bg-gradient-to-r from-green-400 via-green-300 to-green-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></span>
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 transform transition-transform duration-300 group-hover:translate-x-1">
                    <ArrowRight className="h-5 w-5" />
                  </span>
                </button>
              </Link>
            </div>
          </ScrollAnimation>
        </div>
      </div>

      {/* Floating elements - solo visibles cuando el botón está en hover */}
      <div
        className="absolute top-1/4 left-1/6 w-20 h-20 rounded-full bg-gradient-to-r from-green-500/10 to-blue-500/10 animate-float-slow"
        style={{
          pointerEvents: "none",
          opacity: isHovered ? 1 : 0,
          transition: "opacity 0.3s ease",
        }}
      ></div>
      <div
        className="absolute bottom-1/3 right-1/6 w-16 h-16 rounded-full bg-gradient-to-r from-green-500/10 to-blue-500/10 animate-float-medium"
        style={{
          pointerEvents: "none",
          opacity: isHovered ? 1 : 0,
          transition: "opacity 0.3s ease",
        }}
      ></div>
      <div
        className="absolute top-2/3 left-1/3 w-12 h-12 rounded-full bg-gradient-to-r from-green-500/10 to-blue-500/10 animate-float-fast"
        style={{
          pointerEvents: "none",
          opacity: isHovered ? 1 : 0,
          transition: "opacity 0.3s ease",
        }}
      ></div>

      {/* Glowing border at the top for seamless transition */}
      <div
        className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-green-500/30 to-transparent"
        style={{
          boxShadow: "0 0 10px rgba(0, 255, 157, 0.3), 0 0 20px rgba(0, 255, 157, 0.2)",
          pointerEvents: "none",
          opacity: isHovered ? 1 : 0,
          transition: "opacity 0.3s ease",
        }}
      ></div>

      {/* Custom styles for animations */}
      <style jsx global>{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        
        @keyframes float-medium {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(-5deg); }
        }
        
        @keyframes float-fast {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(10deg); }
        }
        
        .animate-float-slow {
          animation: float-slow 8s ease-in-out infinite;
        }
        
        .animate-float-medium {
          animation: float-medium 6s ease-in-out infinite;
        }
        
        .animate-float-fast {
          animation: float-fast 4s ease-in-out infinite;
        }
        
        .cta-mega-button {
          box-shadow: 0 0 15px rgba(0, 255, 157, 0.3);
          transition: all 0.3s ease;
        }
        
        .cta-mega-button:hover {
          box-shadow: 0 0 30px rgba(0, 255, 157, 0.5);
          transform: translateY(-2px);
        }
        
        .cta-mega-button::after {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: linear-gradient(
            to bottom right,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.1) 50%,
            rgba(255, 255, 255, 0) 100%
          );
          transform: rotate(45deg);
          transition: all 0.6s ease;
        }
        
        .cta-mega-button:hover::after {
          left: 100%;
          transition: all 0.6s ease;
        }

        /* Cursor glow effect SOLO para el botón CTA */
        .cursor-glow-effect {
          position: relative;
          z-index: 1;
        }
        
        .cursor-glow-effect::before {
          content: '';
          position: absolute;
          width: 150px;
          height: 150px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(0,255,157,0.2) 0%, rgba(0,0,0,0) 70%);
          transform: translate(-50%, -50%);
          opacity: 0;
          transition: opacity 0.3s ease;
          pointer-events: none;
          z-index: -1;
        }
        
        .cta-mega-button:hover::before {
          opacity: 1;
        }
      `}</style>
    </section>
  )
}
