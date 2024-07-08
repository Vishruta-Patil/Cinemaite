import React, { useState, useEffect, useRef, useCallback } from 'react';
import MovieCard from './MovieCard';
import { Movie, Genre } from '../interfaces/Movie';
import { fetchMovies, searchMovies } from '../services/api';
import '../styles/MovieList.css';

interface MovieListProps {
    selectedGenres: number[];
    searchQuery: string;
    genres: Genre[];
}

const MovieList: React.FC<MovieListProps> = ({ selectedGenres, searchQuery, genres }) => {
    const [moviesByYear, setMoviesByYear] = useState<{ [year: number]: Movie[] }>({});
    const [years, setYears] = useState<number[]>([2012]);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        fetchMoviesForYear(2012, true);
    }, [selectedGenres, searchQuery]);

    const fetchMoviesForYear = async (year: number, reset: boolean = false) => {
        setLoading(true);
        try {
            let newMovies: Movie[] = [];

            if (searchQuery) {
                newMovies = await searchMovies(searchQuery, 1); // Provide page number or additional argument
            } else {
                newMovies = await fetchMovies(year, selectedGenres, 20); // Fetch 20 movies
            }

            setMoviesByYear((prevMoviesByYear) => {
                const updatedMovies = reset ? { [year]: newMovies } : { ...prevMoviesByYear, [year]: [...(prevMoviesByYear[year] || []), ...newMovies] };
                return updatedMovies;
            });

            if (!years.includes(year)) {
                setYears((prevYears) => [...prevYears, year].sort((a, b) => a - b));
            }
        } catch (error) {
            console.error('Error fetching movies:', error);
        } finally {
            setLoading(false);
        }
    };

    const observer = useRef<IntersectionObserver | null>(null);
    const lastMovieElementRef = useCallback((node: any) => {
        if (loading) return;

        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                const lastYear = Math.max(...years);
                const nextYear = lastYear + 1;
                fetchMoviesForYear(nextYear);
            }
        });

        if (node) observer.current.observe(node);
    }, [loading, years]);

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        if (loading) return;

        if (e.currentTarget.scrollTop === 0) {
            const firstYear = Math.min(...years);
            const prevYear = firstYear - 1;
            fetchMoviesForYear(prevYear);
        } else if (e.currentTarget.scrollHeight - e.currentTarget.scrollTop === e.currentTarget.clientHeight) {
            const lastYear = Math.max(...years);
            const nextYear = lastYear + 1;
            fetchMoviesForYear(nextYear);
        }
    };

    return (
        <div className="movie-list" onScroll={handleScroll}>
            {years.map(year => (
                <React.Fragment key={year}>
                    <h2 className="year-header">{year}</h2>
                    {moviesByYear[year]?.map((movie, index) => (
                        <MovieCard 
                            key={movie.id} 
                            movie={movie} 
                            genres={genres} 
                            ref={index === moviesByYear[year].length - 1 ? lastMovieElementRef : null} 
                        />
                    ))}
                </React.Fragment>
            ))}
            {loading && <h4>Loading...</h4>}
        </div>
    );
};

export default MovieList;

