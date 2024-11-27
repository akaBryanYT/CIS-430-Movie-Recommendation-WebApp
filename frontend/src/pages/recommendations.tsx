import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import RecommendationFilters from '../components/RecommendationFilters';
import RecommendationResults from '../components/RecommendationResults';

interface Movie {
  rotten_tomatoes_link: string;
  keywords: string;
  sentiment_score: number;
}

interface FilterState {
  genres: string[];
  sentiment: string;
  baseMovie: string | null;
  keywords: string[];
}

const Recommendations: React.FC = () => {
  const [filters, setFilters] = useState<FilterState>({
    genres: [],
    sentiment: '',
    baseMovie: null,
    keywords: [],
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isSearchTriggered, setIsSearchTriggered] = useState(false); // Tracks if the user initiated a search

  // New state for movie details (titles and images)
  const [movieDetails, setMovieDetails] = useState<Record<string, { title: string; image: string }>>({});

  const fetchRecommendations = async (filters: FilterState, page: number) => {
    const { genres, sentiment, baseMovie, keywords } = filters;

    const params = new URLSearchParams();
    if (baseMovie) params.append('movie_id', baseMovie);
    if (genres.length > 0) params.append('genres', genres.join(','));
    if (sentiment) params.append('sentiment', sentiment);
    if (keywords.length > 0) params.append('keyword', keywords.join(','));
    params.append('page', page.toString());
    params.append('per_page', '10');
    params.append('top_n', '100')

    try {
      const response = await fetch(`http://localhost:5000/api/recommendations?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors', // Required to enable CORS
      });
      if (!response.ok) throw new Error('Failed to fetch recommendations.');

      const data = await response.json();
      setMovies(data.movies);
      setTotalPages(data.total_pages || 1);

      // Save results to localStorage
      localStorage.setItem('filters', JSON.stringify(filters));
      localStorage.setItem('currentPage', page.toString());
      localStorage.setItem('movies', JSON.stringify(data.movies));
      localStorage.setItem('totalPages', (data.total_pages || 1).toString());
    } catch (err) {
      console.error(err);
      setMovies([]);
      setTotalPages(1);
    }
  };

  const fetchMovieDetails = async (movieId: string) => {
    // Check localStorage for cached data
    const cachedDetails = localStorage.getItem(`movieDetails-${movieId}`);
    if (cachedDetails) {
        setMovieDetails((prevDetails) => ({
            ...prevDetails,
            [movieId]: JSON.parse(cachedDetails),
        }));
        return;
    }

    try {
        const response = await fetch(`/api/fetchMovieDetails?id=${movieId}`);
        if (!response.ok) throw new Error("Failed to fetch movie details");

        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");

        const title = doc.querySelector("title")?.textContent?.replace("| Rotten Tomatoes", "").trim() || "Unknown Title";
        const imageUrl = doc.querySelector('meta[name="twitter:image"]')?.getAttribute("content") || "";

        const details = { title, image: imageUrl };

        // Cache the result
        localStorage.setItem(`movieDetails-${movieId}`, JSON.stringify(details));

        setMovieDetails((prevDetails) => ({
            ...prevDetails,
            [movieId]: details,
        }));
    } catch (error) {
        console.error(`Error fetching movie details for ID ${movieId}:`, error);
    }
};


  useEffect(() => {
    // Restore filters and state from localStorage on page load
    const savedFilters = localStorage.getItem('filters');
    const savedCurrentPage = localStorage.getItem('currentPage');
    const savedMovies = localStorage.getItem('movies');
    const savedTotalPages = localStorage.getItem('totalPages');

    if (savedFilters) setFilters(JSON.parse(savedFilters));
    if (savedCurrentPage) setCurrentPage(parseInt(savedCurrentPage, 10));
    if (savedMovies) setMovies(JSON.parse(savedMovies));
    if (savedTotalPages) setTotalPages(parseInt(savedTotalPages, 10));
  }, []);

  const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  useEffect(() => {
      const fetchAllMovieDetails = async () => {
          for (const movie of movies) {
              if (!movieDetails[movie.rotten_tomatoes_link]) {
                  await fetchMovieDetails(movie.rotten_tomatoes_link);
                  await delay(500); // Throttle requests (0.5 seconds delay)
              }
          }
      };
  
      fetchAllMovieDetails();
  }, [movies, movieDetails]);
  

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    setIsSearchTriggered(false); // Reset search state
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchRecommendations(filters, page);
  };

  const handleSearch = () => {
    setCurrentPage(1);
    setIsSearchTriggered(true);
    fetchRecommendations(filters, 1); // Fetch recommendations based on the current filters
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Head>
        <title>Movie Recommendations | Movie Review Recommendation System</title>
        <meta name="description" content="Get personalized movie recommendations" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <main className="flex-grow container mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold mb-8">Your Movie Recommendations</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <RecommendationFilters onFilterChange={handleFilterChange} />
            <button
              onClick={handleSearch}
              className="mt-4 w-full bg-blue-500 text-white px-4 py-2 rounded"
            >
              Search
            </button>
          </div>
          <div className="md:col-span-2">
            {isSearchTriggered ? (
              <RecommendationResults
                movies={movies}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                movieDetails={movieDetails} // Pass movie details here
              />
            ) : (
              <p className="text-gray-500">Use the filters and click &quot;Search&quot; to see recommendations.</p>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Recommendations;
