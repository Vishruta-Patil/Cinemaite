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
    const [years, setYears] = useState<number[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [noMoviesForYear, setNoMoviesForYear] = useState<Set<number>>(new Set());
    const [fetchingYears, setFetchingYears] = useState<Set<number>>(new Set());

    useEffect(() => {
        resetMovies();
        fetchMoviesForYear(2012, true);
    }, [selectedGenres, searchQuery]);

    const resetMovies = () => {
        setMoviesByYear({});
        setYears([]);
        setNoMoviesForYear(new Set());
        setFetchingYears(new Set());
    };

    const fetchMoviesForYear = async (year: number, reset: boolean = false) => {
        if (fetchingYears.has(year)) return; 

        setLoading(true);
        setFetchingYears(prev => new Set(prev).add(year));

        try {
            let newMovies: Movie[] = [];

            if (searchQuery) {
                newMovies = await searchMovies(searchQuery, 1);
            } else {
                newMovies = await fetchMovies(year, selectedGenres, 20);
            }

            if (newMovies.length === 0) {
                setNoMoviesForYear(prev => new Set(prev).add(year));
            } else {
                setMoviesByYear(prevMoviesByYear => ({
                    ...prevMoviesByYear,
                    [year]: [...(prevMoviesByYear[year] || []), ...newMovies]
                }));
                setNoMoviesForYear(prev => {
                    const updated = new Set(prev);
                    updated.delete(year);
                    return updated;
                });
            }

            if (reset) {
                setYears([year]);
            } else {
                setYears(prevYears => {
                    const updatedYears = new Set([...prevYears, year]);
                    return Array.from(updatedYears).sort((a, b) => a - b);
                });
            }
        } catch (error) {
            console.error('Error fetching movies:', error);
        } finally {
            setLoading(false);
            setFetchingYears(prev => {
                const updated = new Set(prev);
                updated.delete(year);
                return updated;
            });
        }
    };

    const observer = useRef<IntersectionObserver | null>(null);
    const lastMovieElementRef = useCallback((node: any) => {
        if (loading) return;

        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver((entries) => {
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

        const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;

        if (scrollTop === 0) {
            const firstYear = Math.min(...years);
            const prevYear = firstYear - 1;
            fetchMoviesForYear(prevYear);
        } else if (scrollHeight - scrollTop === clientHeight) {
            const lastYear = Math.max(...years);
            const nextYear = lastYear + 1;
            fetchMoviesForYear(nextYear);
        }
    };

    return (
        <div className="movie-list" onScroll={handleScroll}>
            {years.length === 0 && noMoviesForYear.has(2012) && <h4>No movies found</h4>}
            {years.map((year) => (
                <React.Fragment key={year}>
                    <h2 className="year-header">{year}</h2>
                    {noMoviesForYear.has(year) ? (
                        <h4>No movies found for {year}</h4>
                    ) : (
                        moviesByYear[year]?.map((movie, index) => (
                            <MovieCard
                                key={movie.id}
                                movie={movie}
                                genres={genres}
                                ref={index === moviesByYear[year].length - 1 ? lastMovieElementRef : null}
                            />
                        ))
                    )}
                </React.Fragment>
            ))}
            {loading && <h4>Loading...</h4>}
        </div>
    );
};

export default MovieList;
