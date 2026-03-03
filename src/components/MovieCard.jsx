import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function MovieCard({ movie }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isFavorite, setIsFavorite] = useState(() => {
    if (typeof window !== 'undefined') {
      const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
      return favorites.includes(movie.imdbID);
    }
    return false;
  });

  const poster =
    movie.Poster && movie.Poster !== "N/A"
      ? movie.Poster
      : "https://via.placeholder.com/300x450?text=No+Poster";

  const toggleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    let newFavorites;
    
    if (favorites.includes(movie.imdbID)) {
      newFavorites = favorites.filter(id => id !== movie.imdbID);
    } else {
      newFavorites = [...favorites, movie.imdbID];
    }
    
    localStorage.setItem("favorites", JSON.stringify(newFavorites));
    setIsFavorite(!isFavorite);
  };

  return (
    <Link to={`/movie/${movie.imdbID}`} className="card">
      <div className="cardImageWrapper">
        {!imageLoaded && <div className="cardSkeleton"></div>}
        <img 
          src={poster} 
          alt={`${movie.Title} poster`} 
          onLoad={() => setImageLoaded(true)}
          style={{ opacity: imageLoaded ? 1 : 0 }}
        />
        <button 
          className={`favoriteBtn ${isFavorite ? 'active' : ''}`}
          onClick={toggleFavorite}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <svg viewBox="0 0 24 24" fill={isFavorite ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>
      </div>
      <div className="cardBody">
        <h3 title={movie.Title}>{movie.Title}</h3>
        <p>{movie.Year} • {movie.Type}</p>
      </div>
    </Link>
  );
}

