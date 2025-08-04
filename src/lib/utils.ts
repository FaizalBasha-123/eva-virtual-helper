
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Create CSS variables dynamically (for the card animation)
export function createCSSVariables() {
  const root = document.documentElement;
  const primaryColor = getComputedStyle(root).getPropertyValue('--primary').trim();
  
  root.style.setProperty('--card-animation-primary', primaryColor);
  root.style.setProperty('--card-animation-secondary', primaryColor);
}
