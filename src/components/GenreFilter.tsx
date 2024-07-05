import React, { useState, useEffect } from 'react';
import { fetchGenres } from '../services/api';
import '../styles/GenreFilter.css';

interface GenreFilterProps {
    onGenreSelect: (genres: number[]) => void;
}

const GenreFilter: React.FC<GenreFilterProps> = ({ onGenreSelect }) => {
    const [genres, setGenres] = useState<{ id: number, name: string }[]>([]);
    const [selectedGenres, setSelectedGenres] = useState<number[]>([]);

    useEffect(() => {
        const getGenres = async () => {
            const genres = await fetchGenres();
            setGenres(genres);
        };
        getGenres();
    }, []);

    const handleGenreClick = (genreId: number) => {
        const updatedSelectedGenres = selectedGenres.includes(genreId)
            ? selectedGenres.filter(id => id !== genreId)
            : [...selectedGenres, genreId];
        setSelectedGenres(updatedSelectedGenres);
        onGenreSelect(updatedSelectedGenres);
    };

    return (
        <div className="genre-filter">
            {genres.map(genre => (
                <button
                    key={genre.id}
                    className={`genre-button ${selectedGenres.includes(genre.id) ? 'selected' : ''}`}
                    onClick={() => handleGenreClick(genre.id)}
                >
                    {genre.name}
                </button>
            ))}
        </div>
    );
};

export default GenreFilter;
