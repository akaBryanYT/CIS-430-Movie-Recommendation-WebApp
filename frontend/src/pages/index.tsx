import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import MovieList from '../components/MovieList';

interface MovieDetails {
  id: string;
  title: string;
  year: string;
  poster: string;
}

const sampleMovieIds = ['m/0878835', 'm/moana_2', 'm/gladiator_ii', 'm/hot_frosty'];

const Home = () => {
  const [featuredMovies, setFeaturedMovies] = useState<MovieDetails[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMovieDetails = async (movieId: string): Promise<MovieDetails> => {
    try {
      const url = `/api/fetchMovieDetails?id=${movieId}`;
      const response = await fetch(url);
      const html = await response.text(); 

      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const title = doc.querySelector('title')?.textContent?.split('|')[0].trim() || 'Unknown Title';
      const poster = doc.querySelector('meta[name="twitter:image"]')?.getAttribute('content') || '/images/placeholder.svg';

      return {
        id: movieId,
        title,
        year: 'Unknown Year',
        poster,
      };
    } catch (error) {
      console.error(`Failed to fetch details for movie ID ${movieId}:`, error);
      return { id: movieId, title: 'Unknown Title', year: 'Unknown Year', poster: '/images/placeholder.svg' };
    }
  };

  useEffect(() => {
    const fetchAllMovies = async () => {
      setLoading(true);
      const movieDetails = await Promise.all(sampleMovieIds.map(fetchMovieDetails));
      setFeaturedMovies(movieDetails);
      setLoading(false);
    };

    fetchAllMovies();
  }, []); // No dependency on `sampleMovieIds` because it's static

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Head>
        <title>Movie Review Recommendation System</title>
        <meta name="description" content="Find and recommend movies based on reviews" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <main className="flex-grow container mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Featured Movies</h1>
        {loading ? (
          <p>Loading featured movies...</p>
        ) : (
          <MovieList movies={featuredMovies} />
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Home;
