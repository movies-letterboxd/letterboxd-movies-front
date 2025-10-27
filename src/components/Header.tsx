import { Gamepad2, LogOut } from "lucide-react";
import { NavLink } from "react-router";
import { useAuthContext } from "../contexts/AuthContext";
import { availablePermissions, hasPermission } from "../utils/permissions";

export default function Header() {
  const { logout, permissions } = useAuthContext()

  const handleLogout = () => {
    logout()
  }

  return (
    <header className="bg-[#121C2E] py-5 px-10 sm:px-20 flex items-center justify-between sticky top-0 z-[999]">
      <div className="flex items-center gap-2">
        <div className="logo">
          <div className="triangle left"></div>
          <div className="triangle right"></div>
        </div>

        <h1 className="text-2xl text-white font-bold sm:block hidden">cineTrack</h1>
      </div>

      <div className="flex items-center gap-9">
        <ol className="xl:flex items-center gap-9 text-white hidden">
          <NavLink
            className={({ isActive }) => `text-[#90A1B9] hover:text-[#517fc1] hover:transition-colors font-bold uppercase ${isActive ? 'text-[#336ab7]' : ''}`}
            to="/movies"
            end
          >
            Películas
          </NavLink>
          {hasPermission(permissions, availablePermissions.CREATE_MOVIE) && (
            <NavLink
              className={({ isActive }) => `text-[#90A1B9] hover:text-[#336ab7] hover:transition-colors font-bold uppercase ${isActive ? 'text-[#336ab7]' : ''}`}
              to="/movies/inactives"
            >
              Películas Inactivas
            </NavLink>
          )}
          {hasPermission(permissions, availablePermissions.CREATE_MOVIE) && hasPermission(permissions, availablePermissions.EDIT_MOVIE) && hasPermission(permissions, availablePermissions.DELETE_MOVIE) && (
            <NavLink
              className={({ isActive }) => `text-[#90A1B9] hover:text-[#336ab7] hover:transition-colors font-bold uppercase ${isActive ? 'text-[#336ab7]' : ''}`}
              to="/attributes"
            >
              Atributos
            </NavLink>
          )}
        </ol>

        <button onClick={handleLogout} className="bg-[#16E0D4] p-[10px] rounded-xl hover:bg-[#16e0d2d1] hover:transition-colors">
          <LogOut size={20} color="black" />
        </button>
      </div>
    </header>
  )
}