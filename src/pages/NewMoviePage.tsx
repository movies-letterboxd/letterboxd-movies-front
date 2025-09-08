export default function NewMoviePage() {
  return (
    <main className="mx-auto max-w-7xl px-4 pb-20">
      <section className="space-y-3 py-20 text-center">
        <p className="text-4xl font-semibold tracking-tight text-white">Nueva película</p>
        <p className="text-white/70">Completá todos los campos y añadí una nueva película</p>
      </section>

      <form className="flex flex-col gap-6">
        <div className="grid grid-cols-3 gap-6">
          <div className="flex flex-col gap-1">
            <label className="text-white">Título</label>
            <input
              className="bg-white p-2 rounded-md border-[#90A1B9] outline-none" 
              type="text"
              placeholder="Título de la película"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-white">Duración</label>
            <input
              className="bg-white p-2 rounded-md border-[#90A1B9] outline-none" 
              type="text"
              placeholder="Duración en minutos"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-white">Fecha estreno</label>
            <input
              className="bg-white p-2 rounded-md border-[#90A1B9] outline-none" 
              type="date"
              placeholder="Fecha de estreno"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-white">Sinopsis</label>
          <textarea className="bg-white p-2 rounded-md border-[#90A1B9] outline-none h-24 resize-none" placeholder="Sinopsis de película">
          </textarea>
        </div>

        <div className="flex gap-6">
          <button className="bg-green-500 flex-1 px-4 py-2 rounded-md text-white font-semibold hover:bg-green-500/80 transition cursor-pointer">
            Guardar
          </button>
          <button className="bg-red-500 flex-1 px-4 py-2 rounded-md text-white font-semibold hover:bg-red-500/80 transition cursor-pointer">
            Cancelar
          </button>
        </div>
      </form>
    </main>
  )
}