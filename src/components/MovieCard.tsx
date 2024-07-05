import React, { useState } from 'react';
import { Movie } from '../interfaces/Movie';
import '../styles/MovieCard.css';

interface MovieCardProps {
    movie: Movie;
    genres: { id: number; name: string }[];
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, genres }) => {
    const [showFullDescription, setShowFullDescription] = useState(false);

    const toggleDescription = () => {
        setShowFullDescription(!showFullDescription);
    };

    const getGenreNames = (genreIds: number[]) => {
        return genreIds
            .map((id) => genres.find((genre) => genre.id === id)?.name)
            .filter((name) => name)
            .join(', ');
    };

    return (
        <div className="movie-card">
            <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
            <div className="movie-card-content">
                <div className="movie-card-title">{movie.title}</div>
                <div className="movie-card-description">
                    {showFullDescription ? movie.overview : `${movie.overview.substring(0, 100)}...`}
                    <span className="show-more" onClick={toggleDescription}>
                        {showFullDescription ? ' Show less' : ' Show more'}
                    </span>
                </div>
                <div className="movie-card-info">
                    <div><strong>Genres:</strong> {getGenreNames(movie.genre_ids)}</div>
                </div>
            </div>
        </div>
    );
};

export default MovieCard;
