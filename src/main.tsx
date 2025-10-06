import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import { Toaster } from 'react-hot-toast'
import './tailwind-input.css'
import AppRouter from './routes/AppRouter'
import { AuthProvider } from './contexts/AuthContext'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Toaster
      position="bottom-right"
      reverseOrder={false}
    />

    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  </BrowserRouter>
)