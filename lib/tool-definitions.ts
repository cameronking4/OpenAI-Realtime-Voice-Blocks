"use client"

import { toast } from "sonner"
import { siteConfig } from "@/config/site"

export const navigateToComponent = ({ component }: { component: string }) => {
  try {
    // Dynamically create componentMap from siteConfig.components
    const componentMap = siteConfig.components.reduce((acc, comp) => ({
      ...acc,
      [comp.title.toLowerCase()]: comp.path,
      // Handle special cases like "dynamic island"
      ...(comp.title.includes(' ') ? {
        [comp.title.toLowerCase().replace(/\s+/g, '-')]: comp.path
      } : {})
    }), {} as { [key: string]: string })

    const route = componentMap[component.toLowerCase()]
    if (!route) {
      throw new Error(`Component "${component}" not found. Available components: ${siteConfig.components.map(c => c.title).join(', ')}`)
    }

    window.location.href = route
    toast("Navigating! 🚀", {
      description: `Taking you to the ${component} component...`,
    })

    return {
      success: true,
      route,
      message: `Navigating to the ${component} component...`
    }
  } catch (error) {
    return {
      success: false,
      message: `Failed to navigate: ${error}`
    }
  }
}