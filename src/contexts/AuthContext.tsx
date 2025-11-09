import { createContext, useContext, useEffect, useState } from "react";
import { decodeToken, loginUser, type LoginUserProps } from "../services/authService";
import toast from "react-hot-toast";

type UserStorage = {
  access_token: string
  profile: {
    email: string
    expiresAt: string
    full_name: string
    permissions: string[]
    role: string
    user_id: number
  } | null
} | null

type AuthContextType = {
  user: UserStorage
  status: 'checking' | 'authenticated' | 'not-authenticated'
  permissions: string[]
  login: (data: LoginUserProps) => Promise<void>
  logout: () => Promise<void>
}

const USER_STORAGE_KEY = 'user'

export const AuthContext = createContext<AuthContextType | null>(null)

export const useAuthContext = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuthContext must be used within an AuthProvider")
  return context
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [status, setStatus] = useState<AuthContextType['status']>('checking')
  const [user, setUser] = useState<UserStorage>(
    window.localStorage.getItem(USER_STORAGE_KEY) 
      ? JSON.parse(window.localStorage.getItem(USER_STORAGE_KEY) as string) 
      : null
  )

  const permissions = user?.profile?.permissions || []

  useEffect(() => {
    validateToken()
  }, [])

  const validateToken = async () => {
    if (user?.access_token) {
      const now = new Date().getTime()
      const expiresAt = new Date(user.profile?.expiresAt || '').getTime()
      
      if (now > expiresAt) {
        logout()
        return
      }

      setStatus('authenticated')
      return
    }

    logout()
  }

  const login = async ({ username, password }: LoginUserProps) => {
    setStatus('checking')
    const result = await loginUser({ username, password })
    
    if (result.success) {
      const response = JSON.parse(result.data.token)

      const dataToSave: UserStorage = {
        access_token: response.access_token,
        profile: null
      }

      window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(dataToSave))
      const decoded = await decodeToken()

      if (!decoded.success) {
        logout()
        return
      }
      
      dataToSave.profile = decoded.data
      window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(dataToSave))

      setUser(dataToSave)
      setStatus('authenticated')
    } else {
      toast.error('Credenciales incorrectas')
      logout()
    }
  }

  const logout = async () => {
    window.localStorage.removeItem(USER_STORAGE_KEY)
    setStatus('not-authenticated')
    setUser(null)
  }

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        status, 
        permissions, 
        logout, 
        login
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}