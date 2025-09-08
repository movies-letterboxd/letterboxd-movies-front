export default function Footer() {
  return (
    <footer className="bg-[#27496D] py-14 flex flex-col gap-3 px-10 sm:px-20">
      <ul className="flex gap-6">
        <li className="font-semibold text-[#99AABB] hover:text-[#99aabbb8]">Sobre nosotros</li>
        <li className="font-semibold text-[#99AABB] hover:text-[#99aabbb8]">Términos y condiciones</li>
        <li className="font-semibold text-[#99AABB] hover:text-[#99aabbb8]">Ayuda</li>
      </ul>

      <p className="text-[#9CB4CC]">&copy; cineTrack - Todos los derechos reservados.</p>
    </footer>
  )
}