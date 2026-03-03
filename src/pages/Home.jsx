import React, { useEffect, useMemo, useState } from "react";
import SearchBar from "../components/SearchBar";
import MovieCard from "../components/MovieCard";
import { searchMovies } from "../api/omdb";

function useDebounced(value, delayMs = 500) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(id);
  }, [value, delayMs]);
  return debounced;
}

const TRENDING_SEARCHES = ["Avengers", "Batman", "Spider-Man", "Harry Potter", "Star Wars", "Inception", "The Matrix", "Titanic"];

export default function Home() {
  const [query, setQuery] = useState("");
  const [showFavorites, setShowFavorites] = useState(false);
  const debouncedQuery = useDebounced(query, 500);

  const [movies, setMovies] = useState([]);
  const [total, setTotal] = useState(0);
  const [trendingMovies, setTrendingMovies] = useState([]);

  const [page, setPage] = useState(1);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const canPrev = page > 1;
  const canNext = page * 10 < total;

  const [favorites, setFavorites] = useState(() => {
    if (typeof window !== 'undefined') {
      return JSON.parse(localStorage.getItem("favorites") || "[]");
    }
    return [];
  });

  async function fetchMovies(q, p) {
    setLoading(true);
    setError("");
    try {
      const data = await searchMovies(q, p);
      if (data.Response === "False") {
        setMovies([]);
        setTotal(0);
        setError(data.Error || "No results found");
      } else {
        setMovies(data.Search || []);
        setTotal(Number(data.totalResults || 0));
      }
    } catch (e) {
      setError(e.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function fetchTrending() {
    const randomQuery = TRENDING_SEARCHES[Math.floor(Math.random() * TRENDING_SEARCHES.length)];
    try {
      const data = await searchMovies(randomQuery, 1);
      if (data.Response === "True") {
        setTrendingMovies(data.Search?.slice(0, 8) || []);
      }
    } catch (e) {
      console.error("Failed to fetch trending:", e);
    }
  }

  // Auto-search while typing (debounced)
  useEffect(() => {
    setPage(1);
  }, [debouncedQuery]);

  useEffect(() => {
    if (debouncedQuery && !showFavorites) {
      fetchMovies(debouncedQuery, page);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery, page]);

  useEffect(() => {
    if (!query && !showFavorites) {
      fetchTrending();
    }
  }, [query, showFavorites]);

  // Handle favorites display
  useEffect(() => {
    const handleStorage = () => {
      setFavorites(JSON.parse(localStorage.getItem("favorites") || "[]"));
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  async function fetchFavoriteMovies() {
    setLoading(true);
    setError("");
    try {
      const favMovies = [];
      for (const id of favorites.slice(0, 10)) {
        try {
          const data = await searchMovies(id, 1);
          if (data.Response === "True" && data.Search?.[0]) {
            favMovies.push(data.Search[0]);
          }
        } catch (e) {
          console.error(`Failed to fetch movie ${id}:`, e);
        }
      }
      setMovies(favMovies);
      setTotal(favorites.length);
    } catch (e) {
      setError(e.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (showFavorites && favorites.length > 0) {
      fetchFavoriteMovies();
    } else if (showFavorites) {
      setMovies([]);
      setTotal(0);
    }
  }, [showFavorites, favorites]);

  function onSubmit(e) {
    e.preventDefault();
    setShowFavorites(false);
    setPage(1);
    if (query.trim()) {
      fetchMovies(query, 1);
    }
  }

  function toggleFavorites() {
    setShowFavorites(!showFavorites);
    if (!showFavorites) {
      setQuery("");
    }
  }

  const subtitle = useMemo(() => {
    if (isLoading) return "Loading...";
    if (error) return error;
    if (showFavorites) {
      if (favorites.length === 0) return "No favorites yet. Click the heart on any movie to add it here!";
      return `Your favorites (${movies.length} movies)`;
    }
    if (!movies.length && !query) return "Search for movies or browse trending";
    if (!movies.length) return "Try searching for a movie title.";
    return `Showing ${movies.length} results (page ${page}) • Total: ${total}`;
  }, [isLoading, error, movies.length, page, total, query, showFavorites, favorites.length]);

  return (
    <div className="container">
      <header className="header">
        <h1>MovieBox</h1>
        <p className="subtitle">{subtitle}</p>
        
        <div className="headerActions">
          <button 
            className={`favoritesToggle ${showFavorites ? 'active' : ''}`}
            onClick={toggleFavorites}
          >
            <svg viewBox="0 0 24 24" fill={showFavorites ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            <span>Favorites</span>
            {favorites.length > 0 && <span className="favCount">{favorites.length}</span>}
          </button>
        </div>

        <SearchBar
          value={query}
          onChange={(val) => { setQuery(val); if (showFavorites) setShowFavorites(false); }}
          onSubmit={onSubmit}
          isLoading={isLoading}
        />
      </header>

      {!query && !showFavorites && trendingMovies.length > 0 && (
        <section className="trendingSection">
          <h2 className="sectionTitle">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
            Trending Now
          </h2>
          <div className="grid">
            {trendingMovies.map((m) => (
              <MovieCard key={m.imdbID} movie={m} />
            ))}
          </div>
        </section>
      )}

      {showFavorites && favorites.length > 0 && (
        <section className="favoritesSection">
          <div className="grid">
            {movies.map((m) => (
              <MovieCard key={m.imdbID} movie={m} />
            ))}
          </div>
        </section>
      )}

      {query && !showFavorites && (
        <>
          <div className="grid">
            {movies.map((m) => (
              <MovieCard key={m.imdbID} movie={m} />
            ))}
          </div>

          {movies.length > 0 && (
            <div className="pagination">
              <button
                disabled={!canPrev || isLoading}
                onClick={() => setPage((p) => p - 1)}
              >
                ← Prev
              </button>
              <span className="muted">Page {page}</span>
              <button
                disabled={!canNext || isLoading}
                onClick={() => setPage((p) => p + 1)}
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

