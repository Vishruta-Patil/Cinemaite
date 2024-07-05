import React, { useState } from 'react';
import { Movie } from '../interfaces/Movie';
import '../styles/MovieCard.css';

interface MovieCardProps {
    movie: Movie;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
    const [showFullDescription, setShowFullDescription] = useState(false);

    const toggleDescription = () => {
        setShowFullDescription(!showFullDescription);
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
                    <div><strong>Genre:</strong> {movie.genre_ids.join(', ')}</div>
                    <div><strong>Cast:</strong> {/* Add cast information here */}</div>
                    <div><strong>Director:</strong> {/* Add director information here */}</div>
                </div>
            </div>
        </div>
    );
};

export default MovieCard;
