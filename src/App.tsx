import React, { useState } from 'react';
import SearchBar from './components/SearchBar';
import GenreFilter from './components/GenreFilter';
import MovieList from './components/MovieList';
import './styles/App.css';

const App: React.FC = () => {
    const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>('');

    const handleGenreSelect = (genres: number[]) => {
        setSelectedGenres(genres);
    };

    const handleSearch = (query: string) => {
        setSearchQuery(query);
    };

    return (
        <div className="app">
            <header>
                <h1>CINEMAITE</h1>
                <SearchBar onSearch={handleSearch} />
                <GenreFilter onGenreSelect={handleGenreSelect} />
            </header>
            <MovieList selectedGenres={selectedGenres} searchQuery={searchQuery} />
        </div>
    );
};

export default App;
