import Image from 'next/image';
import React, { useState, useEffect } from 'react';

interface Movie {
  rotten_tomatoes_link: string;
  keywords: string;
  sentiment_score: number;
}

interface Props {
  movies: Movie[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  movieDetails: Record<string, { title: string; image: string }>;
}

const RecommendationResults: React.FC<Props> = ({ movies, currentPage, totalPages, onPageChange }) => {
  const [movieDetails, setMovieDetails] = useState<Record<string, { title: string; image: string }>>({});

  const fetchMovieDetails = async (movieId: string) => {
    const url = `/api/fetchMovieDetails?id=${movieId}`;
    try {
      const response = await fetch(url);
      const html = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');

      const title = doc.querySelector('title')?.textContent?.replace('| Rotten Tomatoes', '').trim() || 'Unknown Title';
      const imageUrl = doc.querySelector('meta[name="twitter:image"]')?.getAttribute('content') || '';

      setMovieDetails((prevDetails) => ({
        ...prevDetails,
        [movieId]: { title, image: imageUrl },
      }));
    } catch (error) {
      console.error(`Failed to fetch details for movie ID: ${movieId}`, error);
    }
  };

  useEffect(() => {
    movies.forEach((movie) => {
      if (!movieDetails[movie.rotten_tomatoes_link]) {
        fetchMovieDetails(movie.rotten_tomatoes_link);
      }
    });
  }, [movies, movieDetails]);

  return (
    <div>
      {movies.length === 0 ? (
        <p>No recommendations found.</p>
      ) : (
        <ul>
          {movies.map((movie) => {
            const details = movieDetails[movie.rotten_tomatoes_link] || { title: 'Loading...', image: '' };

            return (
              <li key={movie.rotten_tomatoes_link} className="mb-4 flex">
                <Image
                  src={details.image || '/images/placeholder.svg'}
                  width={300}
                  height={450}
                  alt={details.title}
                  className="w-20 h-30 mr-4"
                />
                <div>
                  <h4 className="text-lg font-bold">{details.title}</h4>
                  <p>Keywords: {movie.keywords}</p>
                  <p>Sentiment Score: {movie.sentiment_score.toFixed(2)}</p>
                </div>
              </li>
            );
          })}
        </ul>
      )}
      <div className="mt-4 flex justify-center space-x-4">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => onPageChange(i + 1)}
            className={`px-3 py-1 rounded-full ${
              i + 1 === currentPage ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default RecommendationResults;
