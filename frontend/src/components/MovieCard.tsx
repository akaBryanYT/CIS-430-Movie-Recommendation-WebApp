import React, { useState, useEffect } from 'react';
import Image from 'next/image';

interface MovieCardProps {
  movieId: string;
  title: string;
  sentiment?: string;
}

const MovieCard: React.FC<MovieCardProps> = ({ movieId, title, sentiment }) => {
  const [posterUrl, setPosterUrl] = useState<string | null>(null);
  const defaultPoster = '/images/placeholder.svg'; // Default fallback poster

  useEffect(() => {
    const fetchPoster = async () => {
      try {
        // Fetch the Rotten Tomatoes movie page
        const response = await fetch(`/api/fetchMovieDetails?id=${movieId}`);
        if (!response.ok) {
          console.error(`Failed to fetch movie details for ID: ${movieId}`);
          return;
        }

        const html = await response.text();

        // Parse the HTML and extract the twitter:image meta tag
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const metaTag = doc.querySelector('meta[name="twitter:image"]');
        const imageUrl = metaTag?.getAttribute('content');

        if (imageUrl) {
          setPosterUrl(imageUrl);
        } else {
          console.warn(`No poster image found for movie ID: ${movieId}`);
          setPosterUrl(defaultPoster); // Set fallback
        }
      } catch (error) {
        console.error(`Error fetching poster for movie ID: ${movieId}`, error);
        setPosterUrl(defaultPoster); // Set fallback
      }
    };

    fetchPoster();
  }, [movieId]);

  return (
    <div className="border rounded shadow-md p-4 flex flex-col items-center">
      <div className="w-full h-64 flex items-center justify-center bg-gray-200">
        {posterUrl ? (
          <Image
            src={posterUrl}
            alt={`${title} poster`}
            className="object-cover h-full"
            width={300}
            height={450}
            onError={() => setPosterUrl(defaultPoster)} // Fallback on load error
          />
        ) : (
          <p>Loading poster...</p>
        )}
      </div>
      <h3 className="text-lg font-bold mt-4">{title}</h3>
      <p className="text-sm text-gray-500">Sentiment: {sentiment}</p>
    </div>
  );
};

export default MovieCard;
