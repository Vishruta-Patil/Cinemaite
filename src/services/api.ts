import axios from 'axios';

const API_KEY = '2dca580c2a14b55200e784d157207b4d';
const BASE_URL = 'https://api.themoviedb.org/3';

export const fetchGenres = async () => {
    const response = await axios.get(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}`);
    return response.data.genres;
};

export const fetchMovies = async (year: number, genres: number[]) => {
    const genreFilter = genres.length > 0 ? `&with_genres=${genres.join(',')}` : '';
    const response = await axios.get(
        `${BASE_URL}/discover/movie?api_key=${API_KEY}&sort_by=popularity.desc&primary_release_year=${year}&vote_count.gte=100${genreFilter}`
    );
    return response.data.results;
};

export const searchMovies = async (query: string, page: number) => {
    const response = await axios.get(
        `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${query}&page=${page}`
    );
    return response.data.results;
};
