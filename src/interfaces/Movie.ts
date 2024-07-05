export interface Genre {
    id: number;
    name: string;
}

export interface Movie {
    id: number;
    title: string;
    overview: string;
    poster_path: string;
    genre_ids: number[];
}

