"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { ThemeLogo } from "@/components/theme-logo"
import { ArrowRight, Check, User, Mail, MessageSquare } from "lucide-react"
import Link from "next/link"
import { useTheme } from "next-themes"
import { sendQuestionEmail } from "../actions/send-question"

export default function PreguntasPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    question: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState<{
    name?: string
    email?: string
    question?: string
  }>({})
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number | null>(null)
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  // Handle canvas animation - similar to the demo request page
  useEffect(() => {
    if (!canvasRef.current || !mounted) return

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

      constructor() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.size = Math.random() * 3 + 1
        this.speedX = (Math.random() - 0.5) * 2
        this.speedY = (Math.random() - 0.5) * 2
        this.color = "#00ff9d"
        this.opacity = Math.random() * 0.5 + 0.2
      }

      update() {
        this.x += this.speedX
        this.y += this.speedY

        // Bounce off edges
        if (this.x > canvas.width || this.x < 0) {
          this.speedX = -this.speedX
        }
        if (this.y > canvas.height || this.y < 0) {
          this.speedY = -this.speedY
        }
      }

      draw() {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(0, 255, 157, ${this.opacity})`
        ctx.fill()
      }
    }

    // Create particles
    const particles: Particle[] = []
    for (let i = 0; i < 50; i++) {
      particles.push(new Particle())
    }

    // Animation function
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw particles
      particles.forEach((particle) => {
        particle.update()
        particle.draw()
      })

      // Draw connections
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

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [mounted])

  // Form validation
  const validateForm = () => {
    const newErrors: {
      name?: string
      email?: string
      question?: string
    } = {}

    if (!formData.name.trim()) {
      newErrors.name = "Por favor ingresa tu nombre"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Por favor ingresa tu email"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Por favor ingresa un email válido"
    }

    if (!formData.question.trim()) {
      newErrors.question = "Por favor ingresa tu pregunta"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    try {
      // Enviar los datos del formulario por correo electrónico
      const result = await sendQuestionEmail(formData)

      if (result.success) {
        setSubmitted(true)
      } else {
        // Manejar el error
        alert("Hubo un problema al enviar tu pregunta. Por favor, intenta nuevamente.")
      }
    } catch (error) {
      console.error("Error al enviar el formulario:", error)
      alert("Hubo un problema al enviar tu pregunta. Por favor, intenta nuevamente.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  return (
    <div className="min-h-screen bg-background flex flex-col overflow-hidden relative">
      {/* Animated background canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-30" />

      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gradient orbs */}
        <div className="absolute top-1/4 left-1/6 w-64 h-64 rounded-full bg-green-500/10 blur-3xl animate-float-slow"></div>
        <div className="absolute bottom-1/3 right-1/6 w-80 h-80 rounded-full bg-green-500/5 blur-3xl animate-float-medium"></div>

        {/* Circuit lines */}
        <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,100 Q150,50 300,150 T600,100" stroke="rgba(0, 255, 157, 0.5)" strokeWidth="1" fill="none"></path>
          <path d="M0,300 Q150,200 300,250 T600,200" stroke="rgba(0, 255, 157, 0.3)" strokeWidth="1" fill="none"></path>
          <path d="M0,500 Q150,400 300,450 T600,400" stroke="rgba(0, 255, 157, 0.4)" strokeWidth="1" fill="none"></path>
        </svg>

        {/* Digital grid */}
        <div className="absolute inset-0 opacity-5">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(0, 255, 157, 0.5)" strokeWidth="0.5"></path>
              </pattern>
            </defs>
            <rect x="0" y="0" width="100%" height="100%" fill="url(#grid)"></rect>
          </svg>
        </div>
      </div>

      {/* Header */}
      <header className="relative z-10 px-6 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center">
          <ThemeLogo className="h-12 w-auto" />
        </Link>
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center relative z-10 px-4 py-10">
        <div className="w-full max-w-2xl bg-background/30 backdrop-blur-lg rounded-2xl shadow-2xl border border-green-500/20 overflow-hidden">
          {!submitted ? (
            <div className="p-8">
              <div className="flex flex-col items-center text-center mb-8">
                <div className="w-16 h-16 rounded-full bg-green-400/20 flex items-center justify-center mb-4">
                  <MessageSquare className="h-8 w-8 text-green-400" />
                </div>
                <h2 className="text-2xl font-bold mb-2 text-foreground">¿Tienes alguna pregunta?</h2>
                <p className="text-gray-500 dark:text-gray-400">Escríbenos y te responderemos a la brevedad</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div className="relative">
                    <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1">
                      Nombre
                    </label>
                    <div className="flex items-center">
                      <div className="absolute left-3 text-gray-400">
                        <User className="h-5 w-5" />
                      </div>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Tu nombre"
                        className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                          errors.name
                            ? "border-red-500 focus:border-red-500"
                            : "border-gray-300 dark:border-gray-600 focus:border-green-500"
                        } bg-white/10 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all duration-300`}
                      />
                    </div>
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                  </div>

                  <div className="relative">
                    <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">
                      Email
                    </label>
                    <div className="flex items-center">
                      <div className="absolute left-3 text-gray-400">
                        <Mail className="h-5 w-5" />
                      </div>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Tu email"
                        className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                          errors.email
                            ? "border-red-500 focus:border-red-500"
                            : "border-gray-300 dark:border-gray-600 focus:border-green-500"
                        } bg-white/10 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all duration-300`}
                      />
                    </div>
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                  </div>

                  <div className="relative">
                    <label htmlFor="question" className="block text-sm font-medium text-foreground mb-1">
                      Tu pregunta
                    </label>
                    <textarea
                      id="question"
                      name="question"
                      value={formData.question}
                      onChange={handleChange}
                      placeholder="Escribe tu pregunta aquí..."
                      rows={5}
                      className={`w-full px-4 py-3 rounded-lg border ${
                        errors.question
                          ? "border-red-500 focus:border-red-500"
                          : "border-gray-300 dark:border-gray-600 focus:border-green-500"
                      } bg-white/10 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all duration-300`}
                    />
                    {errors.question && <p className="text-red-500 text-sm mt-1">{errors.question}</p>}
                  </div>
                </div>

                <div className="flex justify-center mt-8">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-8 py-3 rounded-lg bg-green-500 hover:bg-green-600 text-white flex items-center transition-all duration-300 shadow-lg shadow-green-500/20 hover:shadow-green-500/40"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center">
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Enviando...
                      </span>
                    ) : (
                      <>
                        Enviar pregunta
                        <ArrowRight className="h-5 w-5 ml-2" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="p-8 text-center">
              <div className="flex flex-col items-center mb-8">
                <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mb-6">
                  <Check className="h-10 w-10 text-green-500" />
                </div>
                <h2 className="text-3xl font-bold mb-4 text-foreground">¡Gracias por tu pregunta!</h2>
                <p className="text-gray-500 dark:text-gray-400 max-w-md">
                  Hemos recibido tu pregunta. Nuestro equipo se pondrá en contacto contigo a la brevedad para
                  resolverla.
                </p>
              </div>
              <Link
                href="/"
                className="inline-block px-6 py-3 rounded-lg bg-green-500 hover:bg-green-600 text-white transition-all duration-300 shadow-lg shadow-green-500/20 hover:shadow-green-500/40"
              >
                Volver al inicio
              </Link>
            </div>
          )}
        </div>
      </main>

      {/* Floating elements */}
      <div className="absolute bottom-10 right-10 w-32 h-32 rounded-full bg-green-500/5 blur-3xl animate-float-slow"></div>
      <div className="absolute top-1/3 left-10 w-24 h-24 rounded-full bg-green-500/5 blur-3xl animate-float-medium"></div>

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
      `}</style>
    </div>
  )
}
