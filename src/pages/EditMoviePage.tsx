import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import Input from "../components/ui/Input";
import Textarea from "../components/ui/Textarea";
import SelectWithSearch, { type Option } from "../components/ui/SelectWithSearch";
import cls from "../utils/cls";
import type { Actor, Director, Genero, Plataforma, Movie } from "../types/Movie";
import apiClient, { BASE_URL } from "../services/apiClient";
import { getMovieById } from "../services/movieService";
import { updateMovie, type MoviePayload } from "../services/movieService"
import toast from "react-hot-toast";
import PersonModal from "../components/movies/PersonModal"

function EditMovieSkeleton() {
    return (
        <main className="mx-auto max-w-7xl px-4 pb-20 animate-pulse">
            <section className="space-y-3 py-20 text-center">
                <div className="h-8 w-60 bg-white/10 rounded mx-auto" />
                <div className="h-4 w-96 bg-white/10 rounded mx-auto" />
            </section>

            <form className="flex flex-col gap-6">
                <div className="grid grid-cols-3 gap-6 items-start">
                    <div className="col-span-2 space-y-2">
                        <div className="h-4 w-24 bg-white/10 rounded" />
                        <div className="h-10 w-full bg-white/10 rounded" />
                    </div>
                    <div className="col-span-1">
                        <div className="h-4 w-24 bg-white/10 rounded mb-2" />
                        <div className="aspect-[2/3] w-full bg-white/10 rounded-lg" />
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-6">
                    <div className="h-10 bg-white/10 rounded" />
                    <div className="h-10 bg-white/10 rounded" />
                    <div className="h-10 bg-white/10 rounded" />
                </div>

                <div className="h-24 bg-white/10 rounded" />

                <div className="grid grid-cols-3 gap-6">
                    <div className="h-10 bg-white/10 rounded" />
                    <div className="h-10 bg-white/10 rounded" />
                    <div className="h-10 bg-white/10 rounded" />
                </div>

                <div className="grid grid-cols-[1fr_1fr_auto] gap-6">
                    <div className="h-10 bg-white/10 rounded" />
                    <div className="h-10 bg-white/10 rounded" />
                    <div className="h-10 w-32 bg-white/10 rounded" />
                </div>

                <div className="flex gap-6">
                    <div className="flex-1 h-10 bg-white/10 rounded" />
                    <div className="flex-1 h-10 bg-white/10 rounded" />
                </div>
            </form>
        </main>
    );
}

function movieToForm(m: Movie) {
    return {
        titulo: m.titulo ?? "",
        sinopsis: m.sinopsis ?? "",
        duracionMinutos: String(m.duracionMinutos ?? ""),
        fechaEstreno: (m.fechaEstreno ?? "").slice(0, 10),
        directorId: String(m.director?.id ?? ""),
        generosIds: (m.generos ?? []).map(g => Number(g.id)),
        plataformasIds: (m.plataformas ?? []).map(p => Number(p.id)),
        elenco: (m.elenco ?? []).map((e, idx) => ({
            personaId: Number(e.personaId),
            personaje: e.personaje ?? "",
            orden: e.orden ?? idx + 1,
        })),
    } as const;
}

export default function EditMoviePage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [editingMovie, setEditingMovie] = useState(false);
    const [movie, setMovie] = useState<Movie | null>(null);

    const [form, setForm] = useState({
        titulo: "",
        sinopsis: "",
        duracionMinutos: "",
        fechaEstreno: "",
        directorId: "",
        generosIds: [] as number[],
        plataformasIds: [] as number[],
        elenco: [] as Array<{ personaId: number; personaje: string; orden: number }>,
    });

    const [imageInput, setImageInput] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const [generoOptions, setGeneroOptions] = useState<Option[]>([]);
    const [plataformaOptions, setPlataformaOptions] = useState<Option[]>([]);
    const [peopleOptions, setPeopleOptions] = useState<Option[]>([]);
    const [directorOptions, setDirectorOptions] = useState<Option[]>([]);

    const [genreCache, setGenreCache] = useState<Record<number, string>>({});
    const [platformCache, setPlatformCache] = useState<Record<number, string>>({});
    const [peopleCache, setPeopleCache] = useState<Record<number, string>>({});

    const [newCast, setNewCast] = useState<{ personaId: number | null; personaje: string }>({
        personaId: null,
        personaje: "",
    })

    const [isActorModalOpen, setIsActorModalOpen] = useState(false);
    const [isDirectorModalOpen, setIsDirectorModalOpen] = useState(false);

    useEffect(() => {
        let alive = true;
        (async () => {
            try {
                setLoading(true);
                const [genresRes, platformsRes, peopleRes, directorsRes] = await Promise.all([
                    apiClient.get("/generos"),
                    apiClient.get("/plataformas"),
                    apiClient.get("/personas/actores"),
                    apiClient.get("/personas/directores")
                ]);

                const genresData = (genresRes as any)?.data.data ?? [];
                const platformsData = (platformsRes as any)?.data.data ?? [];
                const peopleData = (peopleRes as any)?.data ?? [];
                const directorsData = (directorsRes as any)?.data ?? [];

                if (!alive) return;
                setGeneroOptions(genresData.map((g: Genero) => ({ label: g.nombre, value: g.id.toString() })));
                setPlataformaOptions(platformsData.map((p: Plataforma) => ({ label: p.nombre, value: p.id.toString() })));
                setPeopleOptions(peopleData.map((p: Actor) => ({ label: p.nombre, value: p.id.toString() })));
                setDirectorOptions(directorsData.map((d: Director) => ({ label: d.nombre, value: d.id.toString() })));

                if (id) {
                    const res = await getMovieById(Number(id));
                    
                    if (!res.success) {
                        navigate('/movies')
                        toast.error('La película no existe.')
                        return
                    }

                    const data = (res as any)?.data?.data ?? res;
                    setMovie(data as Movie);
                    const mapped = movieToForm(data as Movie);
                    setForm({
                        titulo: mapped.titulo,
                        sinopsis: mapped.sinopsis,
                        duracionMinutos: mapped.duracionMinutos,
                        fechaEstreno: mapped.fechaEstreno,
                        directorId: String(mapped.directorId ?? ""),
                        generosIds: mapped.generosIds,
                        plataformasIds: mapped.plataformasIds,
                        elenco: mapped.elenco,
                    });

                    setGenreCache(
                        Object.fromEntries((data.generos ?? []).map((g: Genero) => [Number(g.id), g.nombre]))
                    );
                    setPlatformCache(
                        Object.fromEntries((data.plataformas ?? []).map((p: Plataforma) => [Number(p.id), p.nombre]))
                    );
                    setPeopleCache(
                        Object.fromEntries((data.elenco ?? []).map((e: Actor & { personaId: number }) => [Number(e.personaId), e.nombrePersona]))
                    );
                }
            } catch (err: any) {
                console.error("Error inicializando edición", err);
                if (err?.response?.status === 404) {
                    toast.error("La película no existe.")
                    navigate("/movies");
                } else {
                    toast.error("No se pudieron cargar datos");
                }
            } finally {
                if (alive) setLoading(false);
            }
        })();
        return () => { alive = false };
    }, [id, navigate]);

    const currentPoster = useMemo(() => imagePreview ?? (movie?.poster.startsWith("/uploads") ? `${BASE_URL}${movie.poster}` : movie?.poster) ?? null, [imagePreview, movie]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name: string, option: Option | null) => {
        setForm((prev) => ({ ...prev, [name]: option?.value ?? "" }))
    };

    const handleMultipleSelectChange = (name: "generosIds" | "plataformasIds", option: Option | null) => {
        if (!option) return;
        const valueNum = typeof option.value === "number" ? option.value : Number(option.value);
        if (Number.isNaN(valueNum)) return;
        setForm(prev => {
            const current = prev[name];
            const exists = current.includes(valueNum);
            const next = exists ? current.filter(id => id !== valueNum) : [...current, valueNum];
            return { ...prev, [name]: next };
        });
        if (name === "generosIds") setGenreCache(prev => ({ ...prev, [valueNum]: option.label }));
        if (name === "plataformasIds") setPlatformCache(prev => ({ ...prev, [valueNum]: option.label }));
    };

    const handleDeleteMultipleSelectItem = (name: "generosIds" | "plataformasIds", idNum: number) => {
        setForm(prev => ({ ...prev, [name]: prev[name].filter(x => x !== idNum) }));
    };

    const handleElencoSelect = (option: Option | null) => {
        const idNum = option ? (typeof option.value === "number" ? option.value : Number(option.value)) : null;
        if (option && typeof idNum === "number" && !Number.isNaN(idNum)) {
            setPeopleCache(prev => ({ ...prev, [idNum]: option.label }));
        }
        setNewCast((prev) => ({ ...prev, personaId: idNum }));
    };

    const handleElencoRoleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setNewCast(prev => ({ ...prev, personaje: e.target.value }));
    };

    const handleAddElenco = () => {
        if (newCast.personaId == null || newCast.personaje.trim() === "") return;
        setForm(prev => {
            const exists = prev.elenco.some(e => e.personaId === newCast.personaId);
            const nextElenco = exists
                ? prev.elenco.map(e => (e.personaId === newCast.personaId ? { ...e, personaje: newCast.personaje.trim() } : e))
                : [...prev.elenco, { personaId: newCast.personaId!, personaje: newCast.personaje.trim(), orden: prev.elenco.length + 1 }];
            return { ...prev, elenco: nextElenco };
        });
        setNewCast({ personaId: null, personaje: "" });
    };

    const handleRemoveElenco = (personaId: number) => {
        setForm(prev => ({ ...prev, elenco: prev.elenco.filter(e => e.personaId !== personaId).map((e, i) => ({ ...e, orden: i + 1 })) }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        setImageInput(file);
        setImagePreview(file ? URL.createObjectURL(file) : null);
    };

    const canSubmit = useMemo(() => {
        if (!form.titulo.trim()) return false;
        if (!form.sinopsis.trim()) return false;
        if (!form.duracionMinutos || Number.isNaN(Number(form.duracionMinutos))) return false;
        if (!form.fechaEstreno) return false;
        if (!form.directorId) return false;
        return true;
    }, [form]);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!id) return;
        try {
            setEditingMovie(true)

            const payload: MoviePayload = {
                titulo: form.titulo.trim(),
                sinopsis: form.sinopsis.trim(),
                duracionMinutos: Number(form.duracionMinutos),
                fechaEstreno: form.fechaEstreno,
                directorId: Number(form.directorId),
                generosIds: form.generosIds,
                plataformasIds: form.plataformasIds,
                elenco: form.elenco.map((e) => ({ personaId: e.personaId, personaje: e.personaje, orden: e.orden })),
            };

            const res = await updateMovie(Number(id), payload, imageInput);

            if ((res as any)?.success) {
                toast.success("Película actualizada con éxito")
                navigate(`/movies/${id}`);
            } else {
                toast.error("No se pudo actualizar");
            }
        } catch (err: any) {
            console.error("Error actualizando película", err);
            const msg = err?.response?.data || err?.message || "Error desconocido";
            toast.error(`No se pudo actualizar: ${msg}`);
        } finally {
            setEditingMovie(false)
        }
    };

    if (loading) {
        return <EditMovieSkeleton />;
    }

    if (!movie) return null;

    const getGeneroLabel = (id: number) =>
        genreCache[id] ?? generoOptions.find((o) => Number(o.value) === id)?.label ?? `Género ${id}`;
    const getPlataformaLabel = (id: number) =>
        platformCache[id] ?? plataformaOptions.find((o) => Number(o.value) === id)?.label ?? `Plataforma ${id}`;

    const handleDirectorCreated = (created: { id: number; name: string }) => {
        setDirectorOptions((prev) => [...prev, { label: created.name, value: String(created.id) }]);
        setForm((prev) => ({ ...prev, directorId: String(created.id) }));
        toast.success("Director creado y seleccionado");
    };

    const handleActorCreated = (created: { id: number; name: string }) => {
        setPeopleOptions((prev) => [...prev, { label: created.name, value: String(created.id) }]);
        setPeopleCache((prev) => ({ ...prev, [created.id]: created.name }));
        setNewCast((prev) => ({ ...prev, personaId: created.id }));
        toast.success("Actor creado y listo para agregar al elenco");
    };

    return (
        <main className="mx-auto max-w-7xl px-4 pb-20">
            <section className="space-y-3 py-20 text-center">
                <p className="text-4xl font-semibold tracking-tight text-white">Editar película</p>
                <p className="text-white/70">Actualizá los campos necesarios y guardá los cambios</p>
            </section>

            <form onSubmit={onSubmit} className="flex flex-col gap-6">
                <div className="grid grid-cols-3 gap-6 items-start">
                    <div className="col-span-2">
                        <label htmlFor="image" className="block text-sm font-medium text-white mb-1">
                            Imagen
                        </label>
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
                                    onClick={() => {
                                        if (imagePreview) URL.revokeObjectURL(imagePreview);
                                        setImageInput(null);
                                        setImagePreview(null);
                                        const input = document.getElementById("image") as HTMLInputElement | null;
                                        if (input) input.value = "";
                                    }}
                                >
                                    Quitar
                                </button>
                            </div>
                        )}
                    </div>
                    <div className="col-span-1">
                        <p className="text-sm text-white/70 mb-2">Vista previa</p>
                        <div className="aspect-[2/3] w-full overflow-hidden rounded-lg bg-white/5 border border-white/10">
                            {currentPoster ? (
                                <img
                                    src={currentPoster}
                                    onError={(e) => {
                                        (e.currentTarget as HTMLImageElement).src = "https://placehold.co/500x750?text=Poster";
                                    }}
                                    alt="Poster"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full grid place-content-center text-white/40">Sin imagen</div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-6">
                    <Input
                        name="titulo"
                        label="Título"
                        value={form.titulo}
                        onChange={handleInputChange}
                        placeholder="Título de la película"
                    />
                    <Input
                        name="duracionMinutos"
                        type="number"
                        label="Duración"
                        value={form.duracionMinutos}
                        onChange={handleInputChange}
                        placeholder="Duración en minutos"
                    />
                    <Input
                        name="fechaEstreno"
                        type="date"
                        label="Fecha estreno"
                        value={form.fechaEstreno}
                        onChange={handleInputChange}
                        placeholder="Fecha de estreno"
                    />
                </div>

                <Textarea
                    name="sinopsis"
                    label="Sinopsis"
                    value={form.sinopsis}
                    onChange={handleInputChange}
                    placeholder="Sinopsis de película"
                />

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
                            label=""
                            value={form.directorId}
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
                            {form.generosIds.map((idNum) => (
                                <span
                                    key={idNum}
                                    className="bg-white/10 text-white px-2 py-1 rounded-md text-sm flex items-center gap-2"
                                >
                                    {getGeneroLabel(idNum)}
                                    <button
                                        type="button"
                                        className="size-5 p-1 flex items-center justify-center bg-red-500 rounded-full text-xs font-bold hover:bg-red-500/80"
                                        onClick={() => handleDeleteMultipleSelectItem("generosIds", idNum)}
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
                            {form.plataformasIds.map((idNum) => (
                                <span
                                    key={idNum}
                                    className="bg-white/10 text-white px-2 py-0.5 rounded-md text-sm flex items-center gap-2"
                                >
                                    {getPlataformaLabel(idNum)}
                                    <button
                                        type="button"
                                        className="size-5 p-1 flex items-center justify-center bg-red-500 rounded-full text-xs font-bold hover:bg-red-500/80"
                                        onClick={() => handleDeleteMultipleSelectItem("plataformasIds", idNum)}
                                    >
                                        x
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                    <div className="grid grid-cols-[1fr_1fr_auto] items-end gap-6">
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

                        <Input
                            name="rol"
                            label="Rol"
                            value={newCast.personaje}
                            onChange={handleElencoRoleChange}
                            placeholder="Rol en la película"
                        />

                        <button
                            type="button"
                            onClick={handleAddElenco}
                            disabled={newCast.personaId == null || newCast.personaje.trim() === ""}
                            className={cls(
                                "h-10 px-4 rounded-md text-white font-semibold transition",
                                newCast.personaId == null || newCast.personaje.trim() === ""
                                    ? "bg-blue-500/60 cursor-not-allowed"
                                    : "bg-blue-500 hover:bg-blue-500/80",
                            )}
                        >
                            Agregar/Actualizar
                        </button>
                    </div>

                    {form.elenco.length > 0 && (
                        <ul className="space-y-2">
                            {form.elenco.map((m) => (
                                <li
                                    key={m.personaId}
                                    className="flex items-center justify-between rounded-md bg-white/10 px-3 py-2"
                                >
                                    <div className="text-white">
                                        <span className="font-medium">
                                            {peopleCache[m.personaId] ?? `Persona ${m.personaId}`}
                                        </span>
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
                        disabled={!canSubmit || editingMovie}
                        className={cls(
                            "bg-green-500 flex-1 px-4 py-2 rounded-md text-white font-semibold hover:bg-green-500/80 transition",
                            !canSubmit ? "opacity-70 cursor-not-allowed" : "cursor-pointer",
                            editingMovie ? 'opacity-90' : 'opacity-100'
                        )}
                    >
                        Guardar cambios
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate(`/movies/${id}`)}
                        className="bg-red-500 flex-1 px-4 py-2 rounded-md text-white font-semibold hover:bg-red-500/80 transition cursor-pointer"
                    >
                        Cancelar
                    </button>
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
    );
}
