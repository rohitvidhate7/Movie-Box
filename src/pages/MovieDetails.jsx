import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getMovieById } from "../api/omdb";

export default function MovieDetails() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    async function run() {
      setLoading(true);
      setError("");
      try {
        const data = await getMovieById(id);
        if (data.Response === "False") {
          setError(data.Error || "Movie not found");
          setMovie(null);
        } else {
          setMovie(data);
          // Check if favorite
          const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
          setIsFavorite(favorites.includes(id));
        }
      } catch (e) {
        setError(e.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    }
    run();
  }, [id]);

  const toggleFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    let newFavorites;
    
    if (favorites.includes(id)) {
      newFavorites = favorites.filter(fid => fid !== id);
    } else {
      newFavorites = [...favorites, id];
    }
    
    localStorage.setItem("favorites", JSON.stringify(newFavorites));
    setIsFavorite(!isFavorite);
  };

  if (isLoading) {
    return (
      <div className="container">
        <div className="detailsLoading">
          <div className="loading-spinner"></div>
          <p className="muted">Loading movie details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <Link to="/" className="backLink">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="m15 18-6-6 6-6" />
          </svg>
          Back to Home
        </Link>
        <p className="error">{error}</p>
      </div>
    );
  }

  const poster =
    movie?.Poster && movie.Poster !== "N/A"
      ? movie.Poster
      : "https://via.placeholder.com/300x450?text=No+Poster";

  // Parse genre if available
  const genres = movie?.Genre ? movie.Genre.split(',').map(g => g.trim()) : [];

  return (
    <div className="container">
      <Link to="/" className="backLink">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="m15 18-6-6 6-6" />
        </svg>
        Back to Search
      </Link>

      <div className="details">
        <div className="detailsPosterWrapper">
          <img className="detailsPoster" src={poster} alt={`${movie.Title} poster`} />
          <button 
            className={`detailsFavoriteBtn ${isFavorite ? 'active' : ''}`}
            onClick={toggleFavorite}
          >
            <svg viewBox="0 0 24 24" fill={isFavorite ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
          </button>
        </div>
        
        <div className="detailsBody">
          <h2>{movie.Title}</h2>
          
          <div className="detailsMeta">
            <span className="year">{movie.Year}</span>
            <span className="dot">•</span>
            <span className="rated">{movie.Rated}</span>
            <span className="dot">•</span>
            <span className="runtime">{movie.Runtime}</span>
          </div>

          <div className="chips">
            {genres.map((genre, index) => (
              <span key={index} className="chip">{genre}</span>
            ))}
          </div>

          <div className="ratingRow">
            <div className="ratingBox imdb">
              <span className="ratingLabel">IMDb</span>
              <span className="ratingValue">{movie.imdbRating}</span>
            </div>
            {movie.imdbVotes !== "N/A" && (
              <div className="ratingBox">
                <span className="ratingLabel">Votes</span>
                <span className="ratingValue">{movie.imdbVotes}</span>
              </div>
            )}
            <div className="ratingBox">
              <span className="ratingLabel">Type</span>
              <span className="ratingValue">{movie.Type}</span>
            </div>
          </div>

          <div className="plotSection">
            <h3>Plot</h3>
            <p>{movie.Plot}</p>
          </div>

          <div className="crewSection">
            <div className="crewItem">
              <h4>Director</h4>
              <p>{movie.Director}</p>
            </div>
            <div className="crewItem">
              <h4>Writers</h4>
              <p>{movie.Writer}</p>
            </div>
            <div className="crewItem">
              <h4>Cast</h4>
              <p>{movie.Actors}</p>
            </div>
          </div>

          <div className="infoSection">
            <h3>Additional Info</h3>
            <div className="infoGrid">
              <div className="infoItem">
                <span className="infoLabel">Language</span>
                <span className="infoValue">{movie.Language}</span>
              </div>
              <div className="infoItem">
                <span className="infoLabel">Country</span>
                <span className="infoValue">{movie.Country}</span>
              </div>
              <div className="infoItem">
                <span className="infoLabel">Awards</span>
                <span className="infoValue">{movie.Awards}</span>
              </div>
              {movie.BoxOffice && movie.BoxOffice !== "N/A" && (
                <div className="infoItem">
                  <span className="infoLabel">Box Office</span>
                  <span className="infoValue">{movie.BoxOffice}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

