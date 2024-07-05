export interface Genre {
    id: number;
    name: string;
}

export interface Movie {
    id: number;
    title: string;
    overview: string;
    poster_path: string;
    genres: { id: number, name: string }[];
    cast?: string[];
    director?: string;
}

