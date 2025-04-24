"use client"

import { SplineViewer } from "@/components/spline-viewer"
import { ThemeLogo } from "@/components/theme-logo"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ChevronRight } from "lucide-react"

export default function ExamplePage() {
  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-hidden">
      {/* Left side content */}
      <div className="relative w-full md:w-1/2 min-h-screen">
        {/* Simple header */}
        <header className="px-4 pt-4 pb-1 flex justify-between items-center border-b border-border">
          <Link href="/" className="flex items-center">
            <ThemeLogo className="h-12 w-auto my-2" />
          </Link>
        </header>

        {/* Content section */}
        <section className="px-4 py-20 md:py-32">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight text-foreground transition-none">
              Example Page with Spline
            </h1>
            <p className="text-lg text-muted-foreground">
              This is a simple example showing how to add the Spline viewer to any page.
            </p>
            <div className="pt-4">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6">
                Call to Action
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>
      </div>

      {/* Add the Spline viewer */}
      <SplineViewer />
    </div>
  )
}
