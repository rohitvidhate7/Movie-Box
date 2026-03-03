import React from "react";
import { Link } from "react-router-dom";

export default function MovieCard({ movie }) {
  const poster =
    movie.Poster && movie.Poster !== "N/A"
      ? movie.Poster
      : "https://via.placeholder.com/300x450?text=No+Poster";

  return (
    <Link to={`/movie/${movie.imdbID}`} className="card">
      <img src={poster} alt={`${movie.Title} poster`} />
      <div className="cardBody">
        <h3 title={movie.Title}>{movie.Title}</h3>
        <p>{movie.Year} • {movie.Type}</p>
      </div>
    </Link>
  );
}
