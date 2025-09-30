import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Toaster } from "@/components/ui/sonner";

import App from './App.jsx'
import { ThemeProvider } from './components/theme/theme-provider';

createRoot(document.getElementById('root')).render(
  <StrictMode>
        <ThemeProvider defaultTheme="system">

    <App />
<Toaster
  position="top-right"
  richColors 
  toastOptions={{
    success: {
      style: {
        background: "#22c55e", 
        color: "#ffffff", 
      },
    },
    error: {
      style: {
        background: "#ef4444", // red
        color: "#ffffff",
      },
    },
    default: {
      style: {
        background: "#1f2937", // dark gray but visible
        color: "#f9fafb", // light text
      },
    },
  }}
/>            </ThemeProvider>


  </StrictMode>,
)
