import { useState } from "react"
import { useAuthContext } from "../contexts/AuthContext"
import { LogIn } from "lucide-react"
import toast from "react-hot-toast"

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const { login } = useAuthContext()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if ([username, password].some(field => field.length === 0)) {
      toast.error('Debes completar todos los campos.')
      return
    }

    login({ username, password })
  }

  return (
    <div className="bg-gradient-to-b from-[#233B5D] to-[#121C2E] h-screen flex items-center justify-center px-6 sm:px-10">
      <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-xl p-8 w-full max-w-sm">
        <h1 className="text-white text-2xl font-semibold mb-2 text-center">
          Gestión de películas
        </h1>

        <p className="text-sm text-gray-300 mb-6 text-center">
          Ingresa para crear, editar, eliminar y ver películas disponibles.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-white text-sm mb-1">Usuario</label>
            <input
              type="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-lg px-3 py-2 bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="johndoe"
              required
            />
          </div>

          <div>
            <label className="block text-white text-sm mb-1">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg px-3 py-2 bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full mt-4 flex items-center gap-2 justify-center bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg transition-all"
          >
            <LogIn size={16} />
            Ingresar
          </button>
        </form>
      </div>
    </div>
  )
}
