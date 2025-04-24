"use server"

import { Resend } from "resend"

// Usar la nueva API key proporcionada
const resend = new Resend("re_g52rPh3S_4FByeZQvPxiHURYbap5vLn1F")

export interface DemoRequestFormData {
  name: string
  email: string
  companySize: string
  country: string
  industry: string
}

export async function sendDemoRequestEmail(formData: DemoRequestFormData) {
  try {
    // Crear el contenido del correo electrónico
    const subject = `Nueva solicitud de demo de ${formData.name}`

    // Crear el cuerpo del correo con todos los datos del formulario
    const emailContent = `
      <h1>Nueva solicitud de demo</h1>
      <p>Se ha recibido una nueva solicitud de demo con los siguientes datos:</p>
      <ul>
        <li><strong>Nombre:</strong> ${formData.name}</li>
        <li><strong>Email:</strong> ${formData.email}</li>
        <li><strong>Tamaño de empresa:</strong> ${formData.companySize}</li>
        <li><strong>País:</strong> ${formData.country}</li>
        <li><strong>Industria:</strong> ${formData.industry}</li>
      </ul>
      <p>Por favor, contacta al cliente lo antes posible.</p>
    `

    // Enviar el correo electrónico
    const { data, error } = await resend.emails.send({
      from: "AMIA Demo Request <onboarding@resend.dev>",
      to: "sebastian@grupo-amia.com",
      subject: subject,
      html: emailContent,
      reply_to: formData.email,
    })

    if (error) {
      console.error("Error al enviar el correo:", error)
      return { success: false, error: "Error al enviar el correo electrónico" }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Error inesperado:", error)
    return { success: false, error: "Ocurrió un error inesperado" }
  }
}
