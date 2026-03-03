import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getMovieById } from "../api/omdb";

export default function MovieDetails() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
        }
      } catch (e) {
        setError(e.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    }
    run();
  }, [id]);

  if (isLoading) {
    return (
      <div className="container">
        <p className="muted">Loading details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <Link to="/" className="backLink">← Back</Link>
        <p className="error">{error}</p>
      </div>
    );
  }

  const poster =
    movie?.Poster && movie.Poster !== "N/A"
      ? movie.Poster
      : "https://via.placeholder.com/300x450?text=No+Poster";

  return (
    <div className="container">
      <Link to="/" className="backLink">← Back</Link>

      <div className="details">
        <img className="detailsPoster" src={poster} alt={`${movie.Title} poster`} />
        <div className="detailsBody">
          <h2>{movie.Title}</h2>
          <p className="muted">
            {movie.Year} • {movie.Rated} • {movie.Runtime} • {movie.Genre}
          </p>

          <div className="chips">
            <span className="chip">IMDb: {movie.imdbRating}</span>
            <span className="chip">Votes: {movie.imdbVotes}</span>
            <span className="chip">Type: {movie.Type}</span>
          </div>

          <h3>Plot</h3>
          <p>{movie.Plot}</p>

          <h3>Cast & Crew</h3>
          <p><b>Director:</b> {movie.Director}</p>
          <p><b>Writer:</b> {movie.Writer}</p>
          <p><b>Actors:</b> {movie.Actors}</p>

          <h3>Production</h3>
          <p><b>Language:</b> {movie.Language}</p>
          <p><b>Country:</b> {movie.Country}</p>
          <p><b>Awards:</b> {movie.Awards}</p>
        </div>
      </div>
    </div>
  );
}
