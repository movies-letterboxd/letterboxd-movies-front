import apiClient from "./apiClient";
import { Movie } from "../types/Movie"; // Adjust the path if your Movie type is elsewhere

export const agregarAVistos = async (movie: Movie) => {
try {
    const token = localStorage.getItem('token');
    const response = await apiClient.post(
        '/movies/vista',
        { movie },
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
    if (response.status === 200) {
        console.log(`Película "${movie.title}" marcada como vista.`);
        return { success: true, data: response.data };
    } else {
        console.error('Error al marcar como vista:', response.statusText);
        return { success: false, error: response.statusText };
    }
} catch (error: any) {
    console.error('Error al marcar como vista:', error.message);
    return { success: false, error: error.message };
}
}

export const agregarAFavoritos = async (movie: Movie) => {
    try {
        const token = localStorage.getItem('token');
        const response = await apiClient.post(
            '/movies/favoritos',
            { movie },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        if (response.status === 200) {
            console.log(`Película "${movie.title}" agregada a favoritos.`);
            return { success: true, data: response.data };
        } else {
            console.error('Error al agregar a favoritos:', response.statusText);
            return { success: false, error: response.statusText };
        }
    } catch (error: any) {
        console.error('Error al agregar a favoritos:', error.message);
        return { success: false, error: error.message };
    }
}
