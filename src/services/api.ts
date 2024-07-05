import axios from 'axios';

const API_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = '2dca580c2a14b55200e784d157207b4d'; 

export const fetchGenres = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/genre/movie/list?api_key=${API_KEY}`);
        return response.data.genres;
    } catch (error) {
        console.error('Error fetching genres:', error);
        throw error;
    }
};

export const fetchMovies = async (year: number, genres: number[]) => {
    try {
        const genreString = genres.join(',');
        const response = await axios.get(`${API_BASE_URL}/discover/movie?api_key=${API_KEY}&primary_release_year=${year}&with_genres=${genreString}`);
        return response.data.results;
    } catch (error) {
        console.error('Error fetching movies:', error);
        throw error;
    }
};

export const searchMovies = async (query: string, page: number) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/search/movie?api_key=${API_KEY}&query=${query}&page=${page}`);
        return response.data.results;
    } catch (error) {
        console.error('Error searching movies:', error);
        throw error;
    }
};
