export interface Movie {
    id: number;
    title: string;
    overview: string;
    poster_path: string;
    genre_ids: number[]; 
    release_date: string;
    vote_average: number;
    vote_count: number;
    original_language: string;
    original_title: string;
    backdrop_path: string;
    popularity: number;
    adult: boolean;
    video: boolean;
}

export interface Genre {
    id: number;
    name: string;
}
