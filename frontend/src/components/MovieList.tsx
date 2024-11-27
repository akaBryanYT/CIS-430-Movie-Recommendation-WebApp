import MovieCard from './MovieCard';

interface Movie {
  id: string;
  title: string;
  year: string;
  poster: string;
}

interface MovieListProps {
  movies: Movie[];
}

const MovieList: React.FC<MovieListProps> = ({ movies }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {movies.map((movie) => (
        <MovieCard
          key={movie.id}
          movieId={movie.id}
          title={movie.title}
          sentiment="Neutral" // Provide a default sentiment or make it optional
        />
      ))}
    </div>
  );
};

export default MovieList;