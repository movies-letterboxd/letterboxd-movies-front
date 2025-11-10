import { useEffect, useState } from "react"
import type { NewMovieForm } from "../types/NewMovieForm"
import Input from "../components/ui/Input"
import Textarea from "../components/ui/Textarea"
import SelectWithSearch, { type Option } from "../components/ui/SelectWithSearch"
import cls from "../utils/cls"
import apiClient from "../services/apiClient"
import type { Actor, Director, Genero, Plataforma } from "../types/Movie"
import { createMovie } from "../services/movieService"
import toast from "react-hot-toast"
import { Link, useNavigate } from "react-router"
import PersonModal from "../components/movies/PersonModal"

export default function NewMoviePage() {
  const navigate = useNavigate()

  const [creatingMovie, setCreatingMovie] = useState(false) 

  const [newMovieState, setNewMovieState] = useState<NewMovieForm>({
    titulo: '',
    duracionMinutos: '',
    fechaEstreno: '',
    sinopsis: '',
    directorId: '',
    generosIds: [],
    plataformasIds: [],
    elenco: []
  })

  const [imageInput, setImageInput] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const [generoOptions, setGeneroOptions] = useState<Option[]>([])
  const [plataformaOptions, setPlataformaOptions] = useState<Option[]>([])
  const [peopleOptions, setPeopleOptions] = useState<Option[]>([])
  const [directorOptions, setDirectorOptions] = useState<Option[]>([])

  const [genreCache, setGenreCache] = useState<Record<number, string>>({})
  const [platformCache, setPlatformCache] = useState<Record<number, string>>({})
  const [peopleCache, setPeopleCache] = useState<Record<number, string>>({})
  const [newCast, setNewCast] = useState<{ personaId: number | null; personaje: string }>({ personaId: null, personaje: '' })

  const [isActorModalOpen, setIsActorModalOpen] = useState(false)
  const [isDirectorModalOpen, setIsDirectorModalOpen] = useState(false)

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [genresRes, platformsRes, peopleRes, directorsRes] = await Promise.all([
          apiClient.get('/generos'),
          apiClient.get('/plataformas'),
          apiClient.get('/personas/actores'),
          apiClient.get('/personas/directores')
        ])

        const genresData = (genresRes as any)?.data.data ?? []
        const platformsData = (platformsRes as any)?.data.data ?? []
        const peopleData = (peopleRes as any)?.data ?? []
        const directorsData = (directorsRes as any)?.data ?? []

        setGeneroOptions(genresData.map((g: Genero) => ({ label: g.nombre, value: g.id.toString() })))
        setPlataformaOptions(platformsData.map((p: Plataforma) => ({ label: p.nombre, value: p.id.toString() })))
        setPeopleOptions(peopleData.map((p: Actor) => ({ label: p.nombre, value: p.id.toString() })))
        setDirectorOptions(directorsData.map((d: Director) => ({ label: d.nombre, value: d.id.toString() })))
      } catch (error) {
        console.error("Error fetching options", error);
      }
    }
    fetchOptions()
  }, [])

  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview)
    }
  }, [imagePreview])

  const getGeneroLabel = (id: number) =>
    genreCache[id] ?? generoOptions.find(o => Number(o.value) === id)?.label ?? `Género ${id}`

  const getPlataformaLabel = (id: number) =>
    platformCache[id] ?? plataformaOptions.find(o => Number(o.value) === id)?.label ?? `Plataforma ${id}`

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewMovieState(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, option: Option | null) => {
    setNewMovieState(prev => ({ ...prev, [name]: option?.value ?? '' }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null
    setImageInput(file)
    if (imagePreview) URL.revokeObjectURL(imagePreview)
    setImagePreview(file ? URL.createObjectURL(file) : null)
  }

  const handleClearImage = () => {
    if (imagePreview) URL.revokeObjectURL(imagePreview)
    setImageInput(null)
    setImagePreview(null)
    const input = document.getElementById("image") as HTMLInputElement | null
    if (input) input.value = ""
  }

  const handleMultipleSelectChange = (name: 'generosIds' | 'plataformasIds', option: Option | null) => {
    if (!option) return
    const valueNum = typeof option.value === 'number' ? option.value : Number(option.value)
    if (Number.isNaN(valueNum)) return
    setNewMovieState(prev => {
      const current = prev[name]
      const exists = current.includes(valueNum)
      const next = exists ? current.filter(id => id !== valueNum) : [...current, valueNum]
      return { ...prev, [name]: next }
    })
    if (name === 'generosIds') setGenreCache(prev => ({ ...prev, [valueNum]: option.label }))
    if (name === 'plataformasIds') setPlatformCache(prev => ({ ...prev, [valueNum]: option.label }))
  }

  const handleDeleteMultipleSelectItem = (name: 'generosIds' | 'plataformasIds', id: number) => {
    setNewMovieState(prev => {
      const next = prev[name].filter(x => x !== id)
      return { ...prev, [name]: next }
    })
  }

  const handleElencoSelect = (option: Option | null) => {
    const id = option ? (typeof option.value === 'number' ? option.value : Number(option.value)) : null
    if (option && typeof id === 'number' && !Number.isNaN(id)) {
      setPeopleCache(prev => ({ ...prev, [id]: option.label }))
    }
    setNewCast(prev => ({ ...prev, personaId: id }))
  }

  const handleElencoRoleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNewCast(prev => ({ ...prev, personaje: e.target.value }))
  }

  const handleAddElenco = () => {
    if (newCast.personaId == null || newCast.personaje.trim() === '') return
    setNewMovieState(prev => {
      const exists = prev.elenco.some(e => e.personaId === newCast.personaId)
      const nextElenco = exists
        ? prev.elenco.map(e => e.personaId === newCast.personaId ? { ...e, personaje: newCast.personaje.trim() } : e)
        : [...prev.elenco, { personaId: newCast.personaId!, personaje: newCast.personaje.trim(), orden: prev.elenco.length + 1 }]
      return { ...prev, elenco: nextElenco }
    })
    setNewCast({ personaId: null, personaje: '' })
  }

  const handleRemoveElenco = (personaId: number) => {
    setNewMovieState(prev => {
      const next = prev.elenco.filter(e => e.personaId !== personaId).map((e, i) => ({ ...e, orden: i + 1 }))
      return { ...prev, elenco: next }
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setCreatingMovie(true)

      const payload = {
        titulo: newMovieState.titulo,
        sinopsis: newMovieState.sinopsis,
        duracionMinutos: Number(newMovieState.duracionMinutos),
        fechaEstreno: newMovieState.fechaEstreno,
        directorId: Number(newMovieState.directorId),
        generosIds: newMovieState.generosIds,
        plataformasIds: newMovieState.plataformasIds,
        elenco: newMovieState.elenco.map(e => ({ personaId: e.personaId, personaje: e.personaje, orden: e.orden }))
      }

      const response = await createMovie(payload, imageInput)

      if (response.success) {
        toast.success("Película creada con éxito");
        setNewMovieState({
          titulo: '',
          sinopsis: '',
          duracionMinutos: '',
          fechaEstreno: '',
          directorId: '',
          generosIds: [],
          plataformasIds: [],
          elenco: []
        })
        if (imagePreview) URL.revokeObjectURL(imagePreview)
        setImageInput(null)
        setImagePreview(null)
        const input = document.getElementById("image") as HTMLInputElement | null
        if (input) input.value = ""

        navigate(`/movies/${response.data.data.id}`)
      } else {
        toast.error("Error creando película: " + response.error)
      }

    } catch (error) {
      console.error("Error creating movie", error);
    } finally {
      setCreatingMovie(false)
    }
  }

  const canSubmit = Object.values(newMovieState).every(value => {
    if (Array.isArray(value)) return value.length > 0
    return value !== '' && value !== null && value !== undefined
  })

  const handleDirectorCreated = (created: { id: number; name: string }) => {
    setDirectorOptions(prev => [...prev, { label: created.name, value: String(created.id) }])
    setNewMovieState(prev => ({ ...prev, directorId: String(created.id) }))
  }

  const handleActorCreated = (created: { id: number; name: string }) => {
    setPeopleOptions(prev => [...prev, { label: created.name, value: String(created.id) }])
    setPeopleCache(prev => ({ ...prev, [created.id]: created.name }))
    setNewCast(prev => ({ ...prev, personaId: created.id }))
    toast.success("Actor agregado a la lista")
  }

  return (
    <main className="mx-auto max-w-7xl px-4 pb-20">
      <section className="space-y-3 py-20 text-center">
        <p className="text-4xl font-semibold tracking-tight text-white">Nueva película</p>
        <p className="text-white/70">Completá todos los campos y añadí una nueva película</p>
      </section>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="grid grid-cols-3 gap-6 items-start">
          <div className="col-span-2">
            <label htmlFor="image" className="block text-sm font-medium text-white mb-1">Imagen</label>
            <input
              type="file"
              id="image"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full text-sm text-white bg-white/5 rounded-md border border-white/10 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent p-2"
            />
            {imageInput && (
              <div className="mt-2 text-sm text-white/70 flex items-center gap-3">
                <span>Seleccionada: {imageInput.name}</span>
                <button
                  type="button"
                  className="px-2 py-1 rounded bg-white/10 hover:bg-white/20"
                  onClick={handleClearImage}
                >
                  Quitar
                </button>
              </div>
            )}
          </div>

          <div className="col-span-1">
            <p className="text-sm text-white/70 mb-2">Vista previa</p>
            <div className="aspect-[2/3] w-full overflow-hidden rounded-lg bg-white/5 border border-white/10">
              {imagePreview ? (
                <img src={imagePreview} alt="Poster" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full grid place-content-center text-white/40">
                  Sin imagen
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <Input name="titulo" label="Título" value={newMovieState.titulo} onChange={handleInputChange} placeholder="Título de la película" />
          <Input name="duracionMinutos" type="number" label="Duración" value={newMovieState.duracionMinutos} onChange={handleInputChange} placeholder="Duración en minutos" />
          <Input name="fechaEstreno" type="date" label="Fecha estreno" value={newMovieState.fechaEstreno} onChange={handleInputChange} placeholder="Fecha de estreno" />
        </div>

        <Textarea name="sinopsis" label="Sinopsis" value={newMovieState.sinopsis} onChange={handleInputChange} placeholder="Sinopsis de película" />

        <div className="grid grid-cols-3 gap-6">
          <div>
            <div className="mb-2 flex items-end justify-between">
              <label className="font-medium text-white">Director</label>
              <button
                type="button"
                onClick={() => setIsDirectorModalOpen(true)}
                className="text-sm rounded-md bg-white/10 px-2 py-0.5 text-white hover:bg-white/20"
              >
                Nuevo director
              </button>
            </div>
            <SelectWithSearch
              name="directorId"
              value={newMovieState.directorId}
              onChange={(option) => handleSelectChange("directorId", option)}
              placeholder="Seleccionar director"
              options={directorOptions}
            />
          </div>

          <div>
            <SelectWithSearch
              name="generosIds"
              label="Géneros"
              value={null}
              onChange={(option) => handleMultipleSelectChange("generosIds", option)}
              placeholder="Seleccionar géneros"
              options={generoOptions}
            />
            <div className="mt-2 flex flex-wrap gap-2">
              {newMovieState.generosIds.map(id => (
                <span key={id} className="bg-white/10 text-white px-2 py-1 rounded-md text-sm flex items-center gap-2">
                  {getGeneroLabel(id)}
                  <button
                    type="button"
                    className="size-5 p-1 flex items-center justify-center bg-red-500 rounded-full text-xs font-bold hover:bg-red-500/80"
                    onClick={() => handleDeleteMultipleSelectItem("generosIds", id)}
                  >
                    x
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div>
            <SelectWithSearch
              name="plataformasIds"
              label="Plataformas"
              value={null}
              onChange={(option) => handleMultipleSelectChange("plataformasIds", option)}
              placeholder="Seleccionar plataformas"
              options={plataformaOptions}
            />
            <div className="mt-2 flex flex-wrap gap-2">
              {newMovieState.plataformasIds.map(id => (
                <span key={id} className="bg-white/10 text-white px-2 py-1 rounded-md text-sm flex items-center gap-2">
                  {getPlataformaLabel(id)}
                  <button
                    type="button"
                    className="size-5 p-1 flex items-center justify-center bg-red-500 rounded-full text-xs font-bold hover:bg-red-500/80"
                    onClick={() => handleDeleteMultipleSelectItem("plataformasIds", id)}
                  >
                    x
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-[1fr_auto_auto] items-end gap-6">
            <div>
              <div className="mb-2 flex items-end justify-between">
                <label className="font-medium text-white">Elenco</label>
                <button
                  type="button"
                  onClick={() => setIsActorModalOpen(true)}
                  className="text-sm rounded-md bg-white/10 px-2 py-1 text-white hover:bg-white/20"
                >
                  Nuevo actor
                </button>
              </div>
              <SelectWithSearch
                className="w-full"
                name="elenco"
                label=""
                value={newCast.personaId}
                onChange={handleElencoSelect}
                placeholder="Seleccionar persona"
                options={peopleOptions}
              />
            </div>

            <Input name="rol" label="Rol" value={newCast.personaje} onChange={handleElencoRoleChange} placeholder="Rol en la película" />

            <button
              type="button"
              onClick={handleAddElenco}
              disabled={newCast.personaId == null || newCast.personaje.trim() === ''}
              className={cls(
                "h-10 px-4 rounded-md text-white font-semibold transition",
                newCast.personaId == null || newCast.personaje.trim() === ''
                  ? "bg-blue-500/60 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-500/80"
              )}
            >
              Agregar
            </button>
          </div>

          {newMovieState.elenco.length > 0 && (
            <ul className="space-y-2">
              {newMovieState.elenco.map((m) => (
                <li key={m.personaId} className="flex items-center justify-between rounded-md bg-white/10 px-3 py-2">
                  <div className="text-white">
                    <span className="font-medium">{peopleCache[m.personaId] ?? `Persona ${m.personaId}`}</span>
                    <span className="text-white/70">{` — ${m.personaje}`}</span>
                    <span className="ml-2 text-white/50">{`#${m.orden}`}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleRemoveElenco(m.personaId)}
                      className="h-8 px-3 rounded-md bg-red-500 text-white text-sm hover:bg-red-500/80"
                    >
                      Quitar
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex gap-6">
          <button
            type="submit"
            disabled={!canSubmit || creatingMovie}
            className={cls(
              "bg-green-500 flex-1 px-4 py-2 rounded-md text-white font-semibold hover:bg-green-500/80 transition",
              !canSubmit ? "opacity-70 cursor-not-allowed" : "cursor-pointer",
              creatingMovie ? 'opacity-90' : 'opacity-100'
            )}
          >
            Guardar
          </button>
          <Link to="/movies" className="bg-red-500 flex-1 px-4 py-2 rounded-md text-white font-semibold hover:bg-red-500/80 transition cursor-pointer text-center">
            Cancelar
          </Link>
        </div>
      </form>

      <PersonModal
        isOpen={isActorModalOpen}
        type="actor"
        onClose={() => setIsActorModalOpen(false)}
        onCreated={handleActorCreated}
      />
      <PersonModal
        isOpen={isDirectorModalOpen}
        type="director"
        onClose={() => setIsDirectorModalOpen(false)}
        onCreated={handleDirectorCreated}
      />
    </main>
  )
}
