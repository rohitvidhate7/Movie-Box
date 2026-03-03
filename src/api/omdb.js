const API_KEY = import.meta.env.VITE_OMDB_API_KEY;
const BASE_URL = "https://www.omdbapi.com/";

export async function searchMovies(query, page = 1) {
  if (!query?.trim()) return { Search: [], totalResults: "0", Response: "True" };

  const url = `${BASE_URL}?apikey=${API_KEY}&s=${encodeURIComponent(query)}&page=${page}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Network error while searching movies");
  const data = await res.json();

  // OMDb returns Response: "False" with Error: "Movie not found!"
  return data;
}

export async function getMovieById(imdbID) {
  const url = `${BASE_URL}?apikey=${API_KEY}&i=${encodeURIComponent(imdbID)}&plot=full`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Network error while fetching movie details");
  const data = await res.json();
  return data;
}
