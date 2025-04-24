"use client"

import { useState, useEffect } from "react"
import { Sun, Moon } from "lucide-react"

export function ThemeToggle() {
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    // Initialize theme based on system preference
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    setIsDarkMode(prefersDark)
    document.body.style.backgroundColor = prefersDark ? "#000000" : "#ffffff"
    document.body.style.color = prefersDark ? "#ffffff" : "#000000"

    // Add dark class to html element for consistency with other components
    if (prefersDark) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [])

  const toggleTheme = () => {
    const newMode = !isDarkMode
    setIsDarkMode(newMode)
    document.body.style.backgroundColor = newMode ? "#000000" : "#ffffff"
    document.body.style.color = newMode ? "#ffffff" : "#000000"

    // Toggle dark class on html element
    if (newMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }

  return (
    <div className="flex items-center gap-2 bg-transparent">
      <Sun size={20} className={`${isDarkMode ? "text-gray-500" : "text-black"}`} />
      <button
        onClick={toggleTheme}
        className={`w-14 h-7 rounded-full p-1 transition-colors duration-200 ease-in-out relative ${
          isDarkMode ? "bg-white" : "bg-gray-200"
        }`}
        aria-label="Toggle theme"
      >
        <span
          className={`block w-5 h-5 rounded-full transition-transform duration-200 ease-in-out ${
            isDarkMode ? "bg-black translate-x-7" : "bg-white"
          }`}
        />
      </button>
      <Moon size={20} className={`${isDarkMode ? "text-white" : "text-gray-400"}`} />
    </div>
  )
}
