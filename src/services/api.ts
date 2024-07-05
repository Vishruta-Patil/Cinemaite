import axios from 'axios';

const API_KEY = '2dca580c2a14b55200e784d157207b4d';
const BASE_URL = 'https://api.themoviedb.org/3';

export const fetchMovies = async (year: number, genres: number[]) => {
    const genreString = genres.join(',');
    const response = await axios.get(`${BASE_URL}/discover/movie`, {
        params: {
            api_key: API_KEY,
            year: year,
            with_genres: genreString
        }
    });
    return response.data.results;
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
    const response = await axios.get(`${BASE_URL}/movie/${movieId}`, {
        params: {
            api_key: API_KEY,
            append_to_response: 'credits'
        }
    });
    const movie = response.data;

    const cast = movie.credits.cast.slice(0, 3).map((member: any) => member.name);
    const director = movie.credits.crew.find((member: any) => member.job === 'Director')?.name;

    return { ...movie, cast, director };
};

export const fetchGenres = async () => {
    const response = await axios.get(`${BASE_URL}/genre/movie/list`, {
        params: {
            api_key: API_KEY
        }
    });
    return response.data.genres;
};
