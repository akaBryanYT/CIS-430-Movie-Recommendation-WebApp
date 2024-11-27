import React, { useState } from 'react';

interface FilterProps {
  onFilterChange: (filters: FilterState) => void;
}

interface FilterState {
  genres: string[];
  sentiment: string;
  baseMovie: string | null;
  keywords: string[];
}

const RecommendationFilters: React.FC<FilterProps> = ({ onFilterChange }) => {
  const [filters, setFilters] = useState<FilterState>({
    genres: [],
    sentiment: '',
    baseMovie: null,
    keywords: [],
  });

  const [currentKeyword, setCurrentKeyword] = useState<string>('');

  // Expanded list of genres
  const genres = [
    'Action', 'Adventure', 'Animation', 'Comedy', 'Documentary', 
    'Drama', 'Family', 'Fantasy', 'Horror', 'Kids', 
    'Mystery', 'Romance', 'Sport', 'Thriller', 'War', 'Western'
  ];

  const handleGenreChange = (genre: string) => {
    const updatedGenres = filters.genres.includes(genre)
      ? filters.genres.filter((g) => g !== genre)
      : [...filters.genres, genre];
    updateFilters({ genres: updatedGenres });
  };

  const handleSentimentChange = (sentiment: string) => {
    updateFilters({ sentiment });
  };

  const handleBaseMovieChange = (movieId: string) => {
    updateFilters({ baseMovie: movieId || null });
  };

  const handleAddKeyword = () => {
    if (currentKeyword.trim()) {
      updateFilters({ keywords: [...filters.keywords, currentKeyword.trim()] });
      setCurrentKeyword('');
    }
  };

  const handleRemoveKeyword = (keyword: string) => {
    updateFilters({ keywords: filters.keywords.filter((k) => k !== keyword) });
  };

  const resetFilters = () => {
    const initialFilters = {
      genres: [],
      sentiment: '',
      baseMovie: null,
      keywords: [],
    };
    setFilters(initialFilters);
    onFilterChange(initialFilters);
  };

  const updateFilters = (newFilters: Partial<FilterState>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Genres</h3>
        <div className="flex flex-wrap gap-2">
          {genres.map((genre) => (
            <button
              key={genre}
              onClick={() => handleGenreChange(genre)}
              className={`px-3 py-1 rounded-full text-sm ${
                filters.genres.includes(genre)
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 text-gray-800'
              }`}
            >
              {genre}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Sentiment</h3>
        <div className="flex flex-wrap gap-2">
          {['positive', 'neutral', 'negative'].map((sentiment) => (
            <button
              key={sentiment}
              onClick={() => handleSentimentChange(sentiment)}
              className={`px-3 py-1 rounded-full text-sm ${
                filters.sentiment === sentiment
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-800'
              }`}
            >
              {sentiment.charAt(0).toUpperCase() + sentiment.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Base Movie (Optional)</h3>
        <input
          type="text"
          placeholder="Enter a movie ID"
          value={filters.baseMovie || ''}
          onChange={(e) => handleBaseMovieChange(e.target.value)}
          className="w-full px-3 py-2 border rounded"
        />
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Keywords (Optional)</h3>
        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="Enter a keyword"
            value={currentKeyword}
            onChange={(e) => setCurrentKeyword(e.target.value)}
            className="flex-grow px-3 py-2 border rounded"
          />
          <button
            onClick={handleAddKeyword}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {filters.keywords.map((keyword) => (
            <span
              key={keyword}
              className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full flex items-center"
            >
              {keyword}
              <button
                onClick={() => handleRemoveKeyword(keyword)}
                className="ml-2 text-red-500"
              >
                ✕
              </button>
            </span>
          ))}
        </div>
      </div>

      <button
        onClick={resetFilters}
        className="bg-red-500 text-white px-4 py-2 rounded w-full"
      >
        Reset Filters
      </button>
    </div>
  );
};

export default RecommendationFilters;
