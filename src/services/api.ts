import axios from 'axios';
import { Movie } from '../interfaces/Movie';

const API_KEY = '2dca580c2a14b55200e784d157207b4d'; // Store in env file for security, but since it is demo project using it as const variable
const BASE_URL = 'https://api.themoviedb.org/3';

const movieDetailsCache: { [key: number]: any } = {};

export const fetchMovies = async (year: number, genres: number[], limit: number = 20): Promise<Movie[]> => {
    try {
        const genreQuery = genres.length ? `&with_genres=${genres.join(',')}` : '';
        const response = await axios.get(`${BASE_URL}/discover/movie?api_key=${API_KEY}&primary_release_year=${year}${genreQuery}&sort_by=popularity.desc&page=1`);
        return response.data.results.slice(0, limit);
    } catch (error) {
        console.error('Error fetching movies:', error);
        throw error;
    }
};

export const searchMovies = async (query: string, page: number) => {
    const response = await axios.get(`${BASE_URL}/search/movie`, {
        params: {
            api_key: API_KEY,
            query: query,
            page: page
        }
    });
    return response.data.results;
};

export const fetchMovieDetails = async (movieId: number) => {
    if (movieDetailsCache[movieId]) {
        return movieDetailsCache[movieId];
    }
    
    const response = await axios.get(`${BASE_URL}/movie/${movieId}`, {
        params: {
            api_key: API_KEY,
            append_to_response: 'credits'
        }
    });

    const movie = response.data;
    const cast = movie.credits.cast.slice(0, 5).map((member: any) => member.name); // Get top 5 cast members
    const director = movie.credits.crew.find((member: any) => member.job === 'Director')?.name;

    const movieDetails = { ...movie, cast, director };
    movieDetailsCache[movieId] = movieDetails;

    return movieDetails;
};

export const fetchGenres = async () => {
    const response = await axios.get(`${BASE_URL}/genre/movie/list`, {
        params: {
            api_key: API_KEY
        }
    });
    return response.data.genres;
};
