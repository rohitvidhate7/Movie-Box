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

export default function Home() {
  const [query, setQuery] = useState("batman");
  const debouncedQuery = useDebounced(query, 500);

  const [movies, setMovies] = useState([]);
  const [total, setTotal] = useState(0);

  const [page, setPage] = useState(1);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const canPrev = page > 1;
  const canNext = page * 10 < total;

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

  // Auto-search while typing (debounced)
  useEffect(() => {
    setPage(1);
  }, [debouncedQuery]);

  useEffect(() => {
    fetchMovies(debouncedQuery, page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery, page]);

  function onSubmit(e) {
    e.preventDefault();
    // force search now
    setPage(1);
    fetchMovies(query, 1);
  }

  const subtitle = useMemo(() => {
    if (isLoading) return "Loading...";
    if (error) return error;
    if (!movies.length) return "Try searching for a movie title.";
    return `Showing ${movies.length} results (page ${page}) • Total: ${total}`;
  }, [isLoading, error, movies.length, page, total]);

  return (
    <div className="container">
      <header className="header">
        <h1>Movie Search</h1>
        <p className="muted">{subtitle}</p>
        <SearchBar
          value={query}
          onChange={setQuery}
          onSubmit={onSubmit}
          isLoading={isLoading}
        />
      </header>

      <div className="grid">
        {movies.map((m) => (
          <MovieCard key={m.imdbID} movie={m} />
        ))}
      </div>

      <div className="pagination">
        <button
          disabled={!canPrev || isLoading}
          onClick={() => setPage((p) => p - 1)}
        >
          Prev
        </button>
        <span className="muted">Page {page}</span>
        <button
          disabled={!canNext || isLoading}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}
