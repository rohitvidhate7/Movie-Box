import React from "react";

export default function SearchBar({ value, onChange, onSubmit, isLoading }) {
  return (
    <form onSubmit={onSubmit} className="searchBar">
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search movies... (e.g., Batman)"
        aria-label="Search movies"
      />
      <button type="submit" disabled={isLoading || !value.trim()}>
        {isLoading ? "Searching..." : "Search"}
      </button>
    </form>
  );
}
