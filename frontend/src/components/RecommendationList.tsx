import MovieCard from './MovieCard';

interface Movie {
  id: string;
  title: string;
  year: string;
  poster: string;
}

interface RecommendationListProps {
  recommendations: Movie[];
}

const RecommendationList = ({ recommendations }: RecommendationListProps) => {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Recommended Movies</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {recommendations.map((movie) => (
          <MovieCard key={movie.id} {...movie} />
        ))}
      </div>
    </div>
  );
};

export default RecommendationList;