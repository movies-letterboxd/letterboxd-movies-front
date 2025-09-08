import { Gamepad2, LogOut, Search } from "lucide-react";
import { NavLink } from "react-router";

export default function Header() {
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
            className={({ isActive }) => `text-[#90A1B9] hover:text-[#336ab7] hover:transition-colors font-bold uppercase ${isActive ? 'text-[#336ab7]' : ''}`}
            to="/usuarios"
          >
            Usuario
          </NavLink>
          <NavLink
            className={({ isActive }) => `text-[#90A1B9] hover:text-[#517fc1] hover:transition-colors font-bold uppercase ${isActive ? 'text-[#336ab7]' : ''}`}
            to="/movies"
          >
            Películas
          </NavLink>
          <NavLink
            className={({ isActive }) => `text-[#90A1B9] hover:text-[#336ab7] hover:transition-colors font-bold uppercase ${isActive ? 'text-[#336ab7]' : ''}`}
            to="/new-movie"
          >
            Nueva Película
          </NavLink>
        </ol>

        <button className="bg-[#FF0035] p-3 rounded-full md:block hidden">
          <Gamepad2 size={32} />
        </button>

        <div className="bg-white flex items-center rounded-lg p-[10px] border-1 border-[#90A1B9]">
          <input type="text" placeholder="Busca una película..." className="w-full h-full text-black text-sm min-w-46 outline-none" />
          <Search size={15} color="#90A1B9" />
        </div>

        <button className="bg-[#16E0D4] p-[10px] rounded-xl hover:bg-[#16e0d2d1] hover:transition-colors">
          <LogOut size={20} color="black" />
        </button>
      </div>
    </header>
  )
}