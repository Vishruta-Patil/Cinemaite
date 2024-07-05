import React, { useState } from 'react';
import GenreFilter from './components/GenreFilter';
import MovieList from './components/MovieList';
import SearchBar from './components/SearchBar';
import './App.css';

const App: React.FC = () => {
    const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>('');

    const handleGenreSelect = (genres: number[]) => {
        setSelectedGenres(genres);
        setSearchQuery(''); // Clear search query when selecting genres
    };

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        setSelectedGenres([]); // Clear selected genres when searching
    };

    return (
        <div className="app">
            <header>
                <h1>Movie List App</h1>
                <SearchBar onSearch={handleSearch} />
                <GenreFilter onGenreSelect={handleGenreSelect} />
            </header>
            <MovieList selectedGenres={selectedGenres} searchQuery={searchQuery} />
        </div>
    );
};

export default App;
