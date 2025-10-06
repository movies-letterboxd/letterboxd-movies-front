import { createContext, useContext, useEffect, useState } from "react";

type AuthContextType = {
  status: 'checking' | 'authenticated' | 'not-authenticated'
  login: () => Promise<void>
  logout: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType | null>(null)

export const useAuthContext = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuthContext must be used within an AuthProvider")
  return context
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [status, setStatus] = useState<AuthContextType['status']>('checking')

  const validateToken = async () => {
    setStatus('not-authenticated')
  }

  const login = async () => {
    setStatus('authenticated')
  }

  const logout = async () => {
    setStatus('not-authenticated')
  }

  useEffect(() => {
    validateToken()
  }, [])

  return (
    <AuthContext.Provider value={{ status, logout, login }}>
      {children}
    </AuthContext.Provider>
  )
}