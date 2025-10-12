import { NavLink, Outlet } from "react-router";

export default function AttributesPage() {

  const baseBtnClassName = "flex-1 text-center text-white py-2 rounded-lg"
  return (
    <main className="mx-auto max-w-7xl px-4 pb-20">
      <section className="space-y-3 py-20 text-center">
        <p className="text-4xl font-semibold tracking-tight text-white">Atributos</p>
        <p className="text-white/70">En esta sección podrás crear, modificar y eliminar atributos de las películas.</p>
      </section>

      <div className="pb-5 flex items-start gap-6">
        <NavLink 
          to="platforms"
          end
          className={({ isActive }) => `${isActive ? 'bg-[#336ab7]' : 'bg-white/10'} ${baseBtnClassName}`}
        >
          Plataformas
        </NavLink>
        <NavLink 
          to="genres"
          end
          className={({ isActive }) => `${isActive ? 'bg-[#336ab7]' : 'bg-white/10'} ${baseBtnClassName}`}
        >
          Géneros
        </NavLink>
        <NavLink 
          to="directors"
          end
          className={({ isActive }) => `${isActive ? 'bg-[#336ab7]' : 'bg-white/10'} ${baseBtnClassName}`}
        >
          Directores
        </NavLink>
      </div>
      
      <Outlet />
    </main>
  )
}