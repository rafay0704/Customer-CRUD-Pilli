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
        <Toaster position="top-right" />
            </ThemeProvider>


  </StrictMode>,
)
