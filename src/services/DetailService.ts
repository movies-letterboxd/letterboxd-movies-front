import apiClient from "./apiClient";
import { type Movie } from "../types/Movie"; 

// export const agregarAVistos = async (movie: Movie) => {
// try {
//     const token = localStorage.getItem('token');
//     const response = await apiClient.post(
//         '/movies/vista',
//         { movie },
//         {
//             headers: {
//                 Authorization: `Bearer ${token}`,
//             },
//         }
//     );
//     if (response.status === 200) {
//         console.log(`Película "${movie.titulo}" marcada como vista.`);
//         return { success: true, data: response.data };
//     } else {
//         console.error('Error al marcar como vista:', response.statusText);
//         return { success: false, error: response.statusText };
//     }
// } catch (error: any) {
//     console.error('Error al marcar como vista:', error.message);
//     return { success: false, error: error.message };
// }
// }

// export const agregarAFavoritos = async (movie: Movie) => {
//     try {
//         const token = localStorage.getItem('token');
//         const response = await apiClient.post(
//             '/movies/favoritos',
//             { movie },
//             {
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                 },
//             }
//         );
//         if (response.status === 200) {
//             console.log(`Película "${movie.titulo}" agregada a favoritos.`);
//             return { success: true, data: response.data };
//         } else {
//             console.error('Error al agregar a favoritos:', response.statusText);
//             return { success: false, error: response.statusText };
//         }
//     } catch (error: any) {
//         console.error('Error al agregar a favoritos:', error.message);
//         return { success: false, error: error.message };
//     }
// }

export const getPeliculaById = async (id: number) => {
    try {
        const response = await apiClient.get(`/movies/${id}`);
        if (response.status === 200) {
            return { success: true, data: response.data };
        } else {
            console.error('Error al obtener película por ID:', response.statusText);
            return { success: false, error: response.statusText };
        }
    } catch (error: any) {
        console.error('Error al obtener película por ID:', error.message);
        return { success: false, error: error.message };
    }
}
