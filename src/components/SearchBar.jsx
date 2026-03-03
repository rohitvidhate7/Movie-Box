import React, { useState } from "react";

export default function SearchBar({ value, onChange, onSubmit, isLoading }) {
  const [isFocused, setIsFocused] = useState(false);

  const popularSearches = ["Batman", "Spider-Man", "Harry Potter", "Avengers", "Inception"];

  return (
    <div className="searchWrapper">
      <form onSubmit={onSubmit} className="searchBar">
        <div className="searchIcon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
        </div>
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Search for movies..."
          aria-label="Search movies"
          className={isFocused ? "focused" : ""}
        />
        <button type="submit" disabled={isLoading || !value.trim()}>
          {isLoading ? (
            <span className="btnSpinner"></span>
          ) : (
            <>
              <span>Search</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="m9 18 6-6-6-6" />
              </svg>
            </>
          )}
        </button>
      </form>
      
      {!value && !isLoading && (
        <div className="popularSearches">
          <span className="popularLabel">Popular:</span>
          {popularSearches.map((term) => (
            <button
              key={term}
              className="popularBtn"
              onClick={() => onChange(term)}
            >
              {term}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

