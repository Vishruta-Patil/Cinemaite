import React, { useState, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import MovieCard from './MovieCard';
import { Movie } from '../interfaces/Movie';
import { fetchMovies, searchMovies, fetchMovieDetails } from '../services/api';
import '../styles/MovieList.css';

interface MovieListProps {
    selectedGenres: number[];
    searchQuery: string;
}

const MovieList: React.FC<MovieListProps> = ({ selectedGenres, searchQuery }) => {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [page, setPage] = useState<number>(1);
    const [hasMore, setHasMore] = useState<boolean>(true);

    useEffect(() => {
        setMovies([]);
        setPage(1);
        setHasMore(true);
        if (searchQuery) {
            fetchMoviesBySearchQuery(searchQuery, 1, true);
        } else {
            fetchMoviesByYearAndGenre(2012, selectedGenres, true);
        }
    }, [selectedGenres, searchQuery]);

    const fetchMoviesByYearAndGenre = async (year: number, genres: number[], reset: boolean = false) => {
        try {
            const newMovies = await fetchMovies(year, genres);
            const moviesWithDetails = await Promise.all(newMovies.map(async (movie: Movie) => {
                const details = await fetchMovieDetails(movie.id);
                return { ...movie, ...details };
            }));
            setMovies((prevMovies) => reset ? moviesWithDetails : [...prevMovies, ...moviesWithDetails]);
            setHasMore(moviesWithDetails.length > 0);
        } catch (error) {
            console.error('Error fetching movies by year and genre:', error);
            setHasMore(false);
        }
    };

    const fetchMoviesBySearchQuery = async (query: string, page: number, reset: boolean = false) => {
        try {
            const newMovies = await searchMovies(query, page);
            const moviesWithDetails = await Promise.all(newMovies.map(async (movie: Movie) => {
                const details = await fetchMovieDetails(movie.id);
                return { ...movie, ...details };
            }));
            setMovies((prevMovies) => reset ? moviesWithDetails : [...prevMovies, ...moviesWithDetails]);
            setHasMore(moviesWithDetails.length > 0);
        } catch (error) {
            console.error('Error fetching movies by search query:', error);
            setHasMore(false);
        }
    };

    const fetchMoreMovies = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        if (searchQuery) {
            fetchMoviesBySearchQuery(searchQuery, nextPage);
        } else {
            fetchMoviesByYearAndGenre(2012 + nextPage - 1, selectedGenres);
        }
    };

    return (
        <InfiniteScroll
            dataLength={movies.length}
            next={fetchMoreMovies}
            hasMore={hasMore}
            loader={<h4>Loading...</h4>}
            endMessage={<p>No more movies to show</p>}
        >
            <div className="movie-list">
                {movies.map((movie) => (
                    <MovieCard key={movie.id} movie={movie} />
                ))}
            </div>
        </InfiniteScroll>
    );
};

export default MovieList;
