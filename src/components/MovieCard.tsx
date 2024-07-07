import React, { useEffect, useState, forwardRef } from 'react';
import { fetchMovieDetails } from '../services/api';
import { Movie } from '../interfaces/Movie';
import '../styles/MovieCard.css';

interface MovieCardProps {
    movie: Movie;
}

const MovieCard = forwardRef<HTMLDivElement, MovieCardProps>(({ movie }, ref) => {
    const [cast, setCast] = useState<string[]>([]);
    const [director, setDirector] = useState<string>('');
    const [showFullDescription, setShowFullDescription] = useState(false);

    useEffect(() => {
        const getMovieDetails = async () => {
            const details = await fetchMovieDetails(movie.id);
            setCast(details.cast);
            setDirector(details.director);
        };
        getMovieDetails();
    }, [movie.id]);

    const toggleDescription = () => {
        setShowFullDescription(!showFullDescription);
    };

    return (
        <div className="movie-card" ref={ref}>
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
                    <div><strong>Cast:</strong> {cast.join(', ')}</div>
                    <div><strong>Director:</strong> {director}</div>
                </div>
            </div>
        </div>
    );
});

export default MovieCard;
