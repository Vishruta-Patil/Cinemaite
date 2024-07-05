import React, { useState, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import MovieCard from './MovieCard';
import { Movie } from '../interfaces/Movie';
import { fetchMovies, searchMovies, fetchGenres } from '../services/api';
import '../styles/MovieList.css';

interface MovieListProps {
    selectedGenres: number[];
    searchQuery: string;
}

const MovieList: React.FC<MovieListProps> = ({ selectedGenres, searchQuery }) => {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [page, setPage] = useState<number>(1);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [genres, setGenres] = useState<{ id: number, name: string }[]>([]);

    useEffect(() => {
        const fetchGenresData = async () => {
            const genres = await fetchGenres();
            setGenres(genres);
        };
        fetchGenresData();
    }, []);

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
            setMovies((prevMovies) => reset ? newMovies : [...prevMovies, ...newMovies]);
            setHasMore(newMovies.length > 0);
        } catch (error) {
            console.error('Error fetching movies by year and genre:', error);
            setHasMore(false);
        }
    };

    const fetchMoviesBySearchQuery = async (query: string, page: number, reset: boolean = false) => {
        try {
            const newMovies = await searchMovies(query, page);
            setMovies((prevMovies) => reset ? newMovies : [...prevMovies, ...newMovies]);
            setHasMore(newMovies.length > 0);
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
                    <MovieCard key={movie.id} movie={movie} genres={genres} />
                ))}
            </div>
        </InfiniteScroll>
    );
};

export default MovieList;
