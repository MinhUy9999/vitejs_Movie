// MovieList.jsx
import React, { useEffect, useState } from 'react';
import { fetchMovies } from '../services/apiService';
import { useNavigate } from 'react-router-dom';

const MovieList = () => {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const BASE_IMAGE_URL = 'http://localhost:8080/';
    const navigate = useNavigate();

    useEffect(() => {
        const loadMovies = async () => {
            try {
                const data = await fetchMovies();
                if (data.movies && data.movies.length > 0) {
                    setMovies(data.movies);
                } else {
                    setError("No movies found.");
                }
            } catch (err) {
                setError("Failed to fetch movies. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        loadMovies();
    }, []);

    const getMovieImage = (picture) => {
        return picture ? BASE_IMAGE_URL + picture.replace(/\\/g, '/') : 'default-image.jpg';
    };

    const handleBuyTicket = (movieId) => {
        navigate(`/theaters/${movieId}`);
    };

    if (loading) {
        return <div>Loading movies...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="flex flex-wrap gap-6 justify-center">
            {movies.map((movie) => (
                <div
                    key={movie.movie_id}
                    className="relative bg-white rounded-lg shadow-md overflow-hidden w-52 text-center group"
                >
                    <img
                        src={getMovieImage(movie.picture)}
                        className="w-full h-auto"
                    />
                    <h2 className="text-lg font-bold p-2">{movie.title}</h2>
                    <h2 className="text-lg font-bold p-2">{movie.genre}</h2>
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button
                            className="mb-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                            onClick={() => handleViewDetails(movie.movie_id)}
                        >
                            View Details
                        </button>
                        <button
                            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                            onClick={() => handleBuyTicket(movie.movie_id)}
                        >
                            Buy Ticket
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );

    function handleViewDetails(movieId) {
        navigate(`/movies/${movieId}`);
    }
};

export default MovieList;
