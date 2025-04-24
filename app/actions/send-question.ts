"use server"

import { Resend } from "resend"

// Usar la API key proporcionada
const resend = new Resend("re_g52rPh3S_4FByeZQvPxiHURYbap5vLn1F")

export interface QuestionFormData {
  name: string
  email: string
  question: string
}

export async function sendQuestionEmail(formData: QuestionFormData) {
  try {
    // Crear el contenido del correo electrónico
    const subject = `Nueva pregunta de ${formData.name}`

    // Crear el cuerpo del correo con la pregunta
    const emailContent = `
      <h1>Nueva pregunta recibida</h1>
      <p><strong>Nombre:</strong> ${formData.name}</p>
      <p><strong>Email:</strong> ${formData.email}</p>
      <h2>Pregunta:</h2>
      <p>${formData.question}</p>
    `

    // Enviar el correo electrónico
    const { data, error } = await resend.emails.send({
      from: "AMIA Preguntas <onboarding@resend.dev>",
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
