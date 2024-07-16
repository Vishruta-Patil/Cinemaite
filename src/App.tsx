import React, { useState, useEffect, useCallback } from 'react';
import SearchBar from './components/SearchBar';
import GenreFilter from './components/GenreFilter';
import MovieList from './components/MovieList';
import { fetchGenres, fetchMovies } from './services/api';
import { Movie, Genre } from './interfaces/Movie';
import './styles/App.css';

const App: React.FC = () => {
    const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [genres, setGenres] = useState<Genre[]>([]);
    const [movies, setMovies] = useState<Movie[]>([]);

    useEffect(() => {
        const fetchAllGenres = async () => {
            const genreData = await fetchGenres();
            setGenres(genreData);
        };

        const fetchAllMovies = async () => {
            const movieData = await fetchMovies(2012, []);
            setMovies(movieData);
        };

        fetchAllGenres();
        fetchAllMovies();
    }, []);

    const debounce = (func: Function, delay: number) => {
        let timeoutId: NodeJS.Timeout;
        return (...args: any[]) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func(...args), delay);
        };
    };

    const handleGenreSelect = (genreIds: number[]) => {
        setSelectedGenres(genreIds);
    };

    const debounceSearch = useCallback(debounce((query: string) => {
        setSearchQuery(query);
    }, 300), []);

    return (
        <div className="app">
            <header>
                <h1>CINEMAITE</h1>
                <SearchBar onSearch={debounceSearch} />
                <GenreFilter onGenreSelect={handleGenreSelect} />
            </header>
            <MovieList
                selectedGenres={selectedGenres}
                searchQuery={searchQuery}
                genres={genres}
            />
        </div>
    );
};

export default App;
