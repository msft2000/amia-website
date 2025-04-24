"use client"

import { useEffect, useRef } from "react"

export function SplineViewer() {
  const containerRef = useRef<HTMLDivElement>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  // Update iframe when theme changes (by observing body background color)
  useEffect(() => {
    const updateIframeBackground = () => {
      if (iframeRef.current) {
        const isDark =
          document.body.style.backgroundColor === "rgb(0, 0, 0)" || document.body.style.backgroundColor === "#000000"

        // Set a transparent background that matches the body
        iframeRef.current.style.backgroundColor = isDark ? "rgba(0,0,0,0)" : "rgba(255,255,255,0)"
      }
    }

    // Initial update
    updateIframeBackground()

    // Create observer to watch for changes to body background
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "style") {
          updateIframeBackground()
        }
      })
    })

    // Start observing
    observer.observe(document.body, { attributes: true, attributeFilter: ["style"] })

    // Cleanup
    return () => observer.disconnect()
  }, [])

  // Prevent zoom events
  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current

    // Prevent wheel events (mouse wheel zoom)
    const preventZoom = (e: WheelEvent) => {
      if (e.ctrlKey || Math.abs(e.deltaY) > 10) {
        e.preventDefault()
      }
    }

    // Prevent pinch-to-zoom on touch devices
    const preventTouchZoom = (e: TouchEvent) => {
      if (e.touches.length > 1) {
        e.preventDefault()
      }
    }

    // Prevent keyboard zoom shortcuts
    const preventKeyboardZoom = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === "+" || e.key === "-" || e.key === "=")) {
        e.preventDefault()
      }
    }

    // Add event listeners
    container.addEventListener("wheel", preventZoom, { passive: false })
    container.addEventListener("touchstart", preventTouchZoom, { passive: false })
    document.addEventListener("keydown", preventKeyboardZoom)

    // Cleanup
    return () => {
      container.removeEventListener("wheel", preventZoom)
      container.removeEventListener("touchstart", preventTouchZoom)
      document.removeEventListener("keydown", preventKeyboardZoom)
    }
  }, [])

  return (
    <div
      ref={containerRef}
      style={{
        position: "absolute",
        top: 0,
        left: "50%",
        right: 0,
        height: "calc(100vh + 400px)", // Extend height to cover companies section
        width: "50%",
        overflow: "hidden",
        touchAction: "pan-x pan-y", // Allow panning but not zooming
        zIndex: 0, // Ensure it's behind content
      }}
    >
      <iframe
        ref={iframeRef}
        src="https://my.spline.design/flowcopy-f0a798818774c45c607e8fbdb0a3089b/"
        frameBorder="0"
        width="100%"
        height="100%"
        style={{
          background: "transparent",
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 0,
          pointerEvents: "auto", // Allow interaction
        }}
        allowtransparency="true"
        title="Spline 3D Model"
      />
    </div>
  )
}
