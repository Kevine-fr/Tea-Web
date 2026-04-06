import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Toaster } from 'react-hot-toast'
import App from './views/pages/App.jsx'
import './views/pages/index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          borderRadius: '10px',
          fontFamily: "'Lato', sans-serif",
          fontSize: '14px',
        },
        success: { iconTheme: { primary: '#2d5c3e', secondary: '#fff' } },
        error:   { iconTheme: { primary: '#e8431a', secondary: '#fff' } },
      }}
    />
  </StrictMode>
)
