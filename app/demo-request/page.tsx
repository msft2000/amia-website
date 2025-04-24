"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { ThemeLogo } from "@/components/theme-logo"
import { ArrowRight, ArrowLeft, Check, Building, Globe, Briefcase, User, Mail } from "lucide-react"
import Link from "next/link"
import { useTheme } from "next-themes"

// Importar la acción del servidor al principio del archivo
import { sendDemoRequestEmail } from "../actions/send-email"

// Define the form steps and fields
interface FormData {
  name: string
  email: string
  companySize: string
  country: string
  industry: string
}

export default function DemoRequest() {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    companySize: "",
    country: "",
    industry: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState<Partial<FormData>>({})
  const [animationDirection, setAnimationDirection] = useState<"forward" | "backward">("forward")
  const formRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number | null>(null)
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  // Handle canvas animation
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
  const validateStep = () => {
    const newErrors: Partial<FormData> = {}

    switch (currentStep) {
      case 0:
        if (!formData.name.trim()) {
          newErrors.name = "Por favor ingresa tu nombre"
        }
        break
      case 1:
        if (!formData.email.trim()) {
          newErrors.email = "Por favor ingresa tu email"
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
          newErrors.email = "Por favor ingresa un email válido"
        }
        break
      case 2:
        if (!formData.companySize) {
          newErrors.companySize = "Por favor selecciona el tamaño de tu empresa"
        }
        break
      case 3:
        if (!formData.country) {
          newErrors.country = "Por favor selecciona tu país"
        }
        break
      case 4:
        if (!formData.industry) {
          newErrors.industry = "Por favor selecciona tu industria"
        }
        break
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle next step
  const handleNextStep = () => {
    if (validateStep()) {
      setAnimationDirection("forward")
      if (currentStep < 4) {
        setCurrentStep(currentStep + 1)
      } else {
        handleSubmit()
      }
    }
  }

  // Handle previous step
  const handlePrevStep = () => {
    if (currentStep > 0) {
      setAnimationDirection("backward")
      setCurrentStep(currentStep - 1)
    }
  }

  // Reemplazar la función handleSubmit con la siguiente implementación:
  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      // Enviar los datos del formulario por correo electrónico
      const result = await sendDemoRequestEmail(formData)

      if (result.success) {
        setSubmitted(true)
      } else {
        // Manejar el error
        alert("Hubo un problema al enviar tu solicitud. Por favor, intenta nuevamente.")
      }
    } catch (error) {
      console.error("Error al enviar el formulario:", error)
      alert("Hubo un problema al enviar tu solicitud. Por favor, intenta nuevamente.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  // Handle option selection
  const handleOptionSelect = (field: keyof FormData, value: string) => {
    setFormData({
      ...formData,
      [field]: value,
    })
  }

  // Define company size options
  const companySizeOptions = [
    { value: "1-10", label: "1-10 empleados" },
    { value: "11-50", label: "11-50 empleados" },
    { value: "51-200", label: "51-200 empleados" },
    { value: "201-500", label: "201-500 empleados" },
    { value: "501+", label: "501+ empleados" },
  ]

  // Define country options (just a few for example)
  const countryOptions = [
    { value: "us", label: "Estados Unidos" },
    { value: "mx", label: "México" },
    { value: "ec", label: "Ecuador" },
    { value: "co", label: "Colombia" },
    { value: "es", label: "España" },
    { value: "ar", label: "Argentina" },
    { value: "cl", label: "Chile" },
    { value: "pe", label: "Perú" },
    { value: "other", label: "Otro" },
  ]

  // Define industry options
  const industryOptions = [
    { value: "technology", label: "Tecnología" },
    { value: "finance", label: "Finanzas" },
    { value: "healthcare", label: "Salud" },
    { value: "education", label: "Educación" },
    { value: "retail", label: "Retail" },
    { value: "manufacturing", label: "Manufactura" },
    { value: "services", label: "Servicios" },
    { value: "other", label: "Otro" },
  ]

  // Get current step icon
  const getStepIcon = () => {
    switch (currentStep) {
      case 0:
        return <User className="h-8 w-8 text-green-400" />
      case 1:
        return <Mail className="h-8 w-8 text-green-400" />
      case 2:
        return <Building className="h-8 w-8 text-green-400" />
      case 3:
        return <Globe className="h-8 w-8 text-green-400" />
      case 4:
        return <Briefcase className="h-8 w-8 text-green-400" />
      default:
        return null
    }
  }

  // Get current step title
  const getStepTitle = () => {
    switch (currentStep) {
      case 0:
        return "¿Cuál es tu nombre?"
      case 1:
        return "¿Cuál es tu email?"
      case 2:
        return "¿Cuál es el tamaño de tu empresa?"
      case 3:
        return "¿En qué país estás ubicado?"
      case 4:
        return "¿En qué industria trabajas?"
      default:
        return ""
    }
  }

  // Get current step description
  const getStepDescription = () => {
    switch (currentStep) {
      case 0:
        return "Queremos conocerte mejor"
      case 1:
        return "Te enviaremos información sobre tu demo"
      case 2:
        return "Nos ayuda a entender tus necesidades"
      case 3:
        return "Para ofrecerte soluciones localizadas"
      case 4:
        return "Para personalizar tu experiencia"
      default:
        return ""
    }
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
        <div
          ref={formRef}
          className="w-full max-w-2xl bg-background/30 backdrop-blur-lg rounded-2xl shadow-2xl border border-green-500/20 overflow-hidden"
        >
          {!submitted ? (
            <div className="p-8">
              {/* Progress bar */}
              <div className="mb-8">
                <div className="flex justify-between mb-2">
                  {[0, 1, 2, 3, 4].map((step) => (
                    <div
                      key={step}
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${
                        step < currentStep
                          ? "bg-green-500 text-white"
                          : step === currentStep
                            ? "bg-green-400 text-white ring-4 ring-green-400/30"
                            : "bg-gray-200 dark:bg-gray-700 text-gray-400"
                      }`}
                    >
                      {step < currentStep ? (
                        <Check className="h-5 w-5" />
                      ) : (
                        <span className="text-sm font-medium">{step + 1}</span>
                      )}
                    </div>
                  ))}
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-green-500 h-full transition-all duration-500"
                    style={{ width: `${(currentStep / 4) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Step content */}
              <div className="relative min-h-[450px]">
                <div
                  className={`absolute inset-0 transition-all duration-500 transform ${
                    animationDirection === "forward"
                      ? currentStep === 0
                        ? "translate-x-0 opacity-100"
                        : "-translate-x-full opacity-0"
                      : currentStep === 0
                        ? "translate-x-0 opacity-100"
                        : "translate-x-full opacity-0"
                  }`}
                >
                  <div className="flex flex-col items-center text-center mb-8">
                    <div className="w-16 h-16 rounded-full bg-green-400/20 flex items-center justify-center mb-4">
                      <User className="h-8 w-8 text-green-400" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2 text-foreground">¿Cuál es tu nombre?</h2>
                    <p className="text-gray-500 dark:text-gray-400">Queremos conocerte mejor</p>
                  </div>
                  <div className="space-y-4">
                    <div className="relative">
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Ingresa tu nombre completo"
                        className={`w-full px-4 py-3 rounded-lg border ${
                          errors.name
                            ? "border-red-500 focus:border-red-500"
                            : "border-gray-300 dark:border-gray-600 focus:border-green-500"
                        } bg-white/10 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all duration-300`}
                      />
                      {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                    </div>
                  </div>
                </div>

                <div
                  className={`absolute inset-0 transition-all duration-500 transform ${
                    animationDirection === "forward"
                      ? currentStep === 1
                        ? "translate-x-0 opacity-100"
                        : currentStep < 1
                          ? "translate-x-full opacity-0"
                          : "-translate-x-full opacity-0"
                      : currentStep === 1
                        ? "translate-x-0 opacity-100"
                        : currentStep < 1
                          ? "-translate-x-full opacity-0"
                          : "translate-x-full opacity-0"
                  }`}
                >
                  <div className="flex flex-col items-center text-center mb-8">
                    <div className="w-16 h-16 rounded-full bg-green-400/20 flex items-center justify-center mb-4">
                      <Mail className="h-8 w-8 text-green-400" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2 text-foreground">¿Cuál es tu email?</h2>
                    <p className="text-gray-500 dark:text-gray-400">Te enviaremos información sobre tu demo</p>
                  </div>
                  <div className="space-y-4">
                    <div className="relative">
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Ingresa tu email"
                        className={`w-full px-4 py-3 rounded-lg border ${
                          errors.email
                            ? "border-red-500 focus:border-red-500"
                            : "border-gray-300 dark:border-gray-600 focus:border-green-500"
                        } bg-white/10 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all duration-300`}
                      />
                      {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>
                  </div>
                </div>

                <div
                  className={`absolute inset-0 transition-all duration-500 transform ${
                    animationDirection === "forward"
                      ? currentStep === 2
                        ? "translate-x-0 opacity-100"
                        : currentStep < 2
                          ? "translate-x-full opacity-0"
                          : "-translate-x-full opacity-0"
                      : currentStep === 2
                        ? "translate-x-0 opacity-100"
                        : currentStep < 2
                          ? "-translate-x-full opacity-0"
                          : "translate-x-full opacity-0"
                  }`}
                >
                  <div className="flex flex-col items-center text-center mb-8">
                    <div className="w-16 h-16 rounded-full bg-green-400/20 flex items-center justify-center mb-4">
                      <Building className="h-8 w-8 text-green-400" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2 text-foreground">¿Cuál es el tamaño de tu empresa?</h2>
                    <p className="text-gray-500 dark:text-gray-400">Nos ayuda a entender tus necesidades</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {companySizeOptions.map((option) => (
                      <div
                        key={option.value}
                        className={`p-4 rounded-lg border cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                          formData.companySize === option.value
                            ? "border-green-500 bg-green-500/10 shadow-lg shadow-green-500/20"
                            : "border-gray-300 dark:border-gray-600 hover:border-green-400/50"
                        }`}
                        onClick={() => handleOptionSelect("companySize", option.value)}
                      >
                        <div className="flex items-center">
                          <div
                            className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                              formData.companySize === option.value
                                ? "border-green-500"
                                : "border-gray-400 dark:border-gray-500"
                            }`}
                          >
                            {formData.companySize === option.value && (
                              <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                            )}
                          </div>
                          <span className="text-foreground">{option.label}</span>
                        </div>
                      </div>
                    ))}
                    {errors.companySize && <p className="text-red-500 text-sm mt-1 col-span-2">{errors.companySize}</p>}
                  </div>
                </div>

                <div
                  className={`absolute inset-0 transition-all duration-500 transform ${
                    animationDirection === "forward"
                      ? currentStep === 3
                        ? "translate-x-0 opacity-100"
                        : currentStep < 3
                          ? "translate-x-full opacity-0"
                          : "-translate-x-full opacity-0"
                      : currentStep === 3
                        ? "translate-x-0 opacity-100"
                        : currentStep < 3
                          ? "-translate-x-full opacity-0"
                          : "translate-x-full opacity-0"
                  }`}
                >
                  <div className="flex flex-col items-center text-center mb-8">
                    <div className="w-16 h-16 rounded-full bg-green-400/20 flex items-center justify-center mb-4">
                      <Globe className="h-8 w-8 text-green-400" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2 text-foreground">¿En qué país estás ubicado?</h2>
                    <p className="text-gray-500 dark:text-gray-400">Para ofrecerte soluciones localizadas</p>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {countryOptions.map((option) => (
                      <div
                        key={option.value}
                        className={`p-3 rounded-lg border cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                          formData.country === option.value
                            ? "border-green-500 bg-green-500/10 shadow-lg shadow-green-500/20"
                            : "border-gray-300 dark:border-gray-600 hover:border-green-400/50"
                        }`}
                        onClick={() => handleOptionSelect("country", option.value)}
                      >
                        <div className="flex items-center">
                          <div
                            className={`w-4 h-4 rounded-full border-2 mr-2 flex items-center justify-center ${
                              formData.country === option.value
                                ? "border-green-500"
                                : "border-gray-400 dark:border-gray-500"
                            }`}
                          >
                            {formData.country === option.value && (
                              <div className="w-2 h-2 rounded-full bg-green-500"></div>
                            )}
                          </div>
                          <span className="text-foreground text-sm">{option.label}</span>
                        </div>
                      </div>
                    ))}
                    {errors.country && <p className="text-red-500 text-sm mt-1 col-span-3">{errors.country}</p>}
                  </div>
                </div>

                <div
                  className={`absolute inset-0 transition-all duration-500 transform ${
                    animationDirection === "forward"
                      ? currentStep === 4
                        ? "translate-x-0 opacity-100"
                        : currentStep < 4
                          ? "translate-x-full opacity-0"
                          : "-translate-x-full opacity-0"
                      : currentStep === 4
                        ? "translate-x-0 opacity-100"
                        : currentStep < 4
                          ? "-translate-x-full opacity-0"
                          : "translate-x-full opacity-0"
                  }`}
                >
                  <div className="flex flex-col items-center text-center mb-8">
                    <div className="w-16 h-16 rounded-full bg-green-400/20 flex items-center justify-center mb-4">
                      <Briefcase className="h-8 w-8 text-green-400" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2 text-foreground">¿En qué industria trabajas?</h2>
                    <p className="text-gray-500 dark:text-gray-400">Para personalizar tu experiencia</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    {industryOptions.map((option) => (
                      <div
                        key={option.value}
                        className={`p-4 rounded-lg border cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                          formData.industry === option.value
                            ? "border-green-500 bg-green-500/10 shadow-lg shadow-green-500/20"
                            : "border-gray-300 dark:border-gray-600 hover:border-green-400/50"
                        }`}
                        onClick={() => handleOptionSelect("industry", option.value)}
                      >
                        <div className="flex items-center">
                          <div
                            className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                              formData.industry === option.value
                                ? "border-green-500"
                                : "border-gray-400 dark:border-gray-500"
                            }`}
                          >
                            {formData.industry === option.value && (
                              <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                            )}
                          </div>
                          <span className="text-foreground">{option.label}</span>
                        </div>
                      </div>
                    ))}
                    {errors.industry && <p className="text-red-500 text-sm mt-1 col-span-2">{errors.industry}</p>}
                  </div>
                </div>
              </div>

              {/* Navigation buttons */}
              <div className="flex justify-between mt-16">
                <button
                  onClick={handlePrevStep}
                  className={`px-6 py-3 rounded-lg flex items-center transition-all duration-300 ${
                    currentStep === 0
                      ? "opacity-0 pointer-events-none"
                      : "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-foreground"
                  }`}
                >
                  <ArrowLeft className="h-5 w-5 mr-2" />
                  Anterior
                </button>
                <button
                  onClick={handleNextStep}
                  className="px-6 py-3 rounded-lg bg-green-500 hover:bg-green-600 text-white flex items-center transition-all duration-300 shadow-lg shadow-green-500/20 hover:shadow-green-500/40"
                >
                  {currentStep < 4 ? (
                    <>
                      Siguiente
                      <ArrowRight className="h-5 w-5 ml-2" />
                    </>
                  ) : isSubmitting ? (
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
                      Enviar
                      <ArrowRight className="h-5 w-5 ml-2" />
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center">
              <div className="flex flex-col items-center mb-8">
                <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mb-6">
                  <Check className="h-10 w-10 text-green-500" />
                </div>
                <h2 className="text-3xl font-bold mb-4 text-foreground">¡Gracias por tu interés!</h2>
                <p className="text-gray-500 dark:text-gray-400 max-w-md">
                  Hemos recibido tu solicitud de demo. Nuestro equipo se pondrá en contacto contigo a la brevedad para
                  coordinar los detalles.
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
