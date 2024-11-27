import { useRouter } from 'next/router';
import Head from 'next/head';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Image from 'next/image';

const MovieDetails = () => {
  const router = useRouter();
  const { id } = router.query;

  // In a real application, you'd fetch the movie details from an API using the id
  // For now, we'll just use some dummy data
  const movie = {
    id: id,
    title: `Movie ${id}`,
    year: '2023',
    poster: 'https://via.placeholder.com/300x450',
    description: 'This is a sample movie description. In a real application, this would contain detailed information about the movie, including its plot, cast, and reviews.',
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Head>
        <title>{movie.title} | Movie Review Recommendation System</title>
        <meta name="description" content={`Details and reviews for ${movie.title}`} />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <main className="flex-grow container mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/3">
            <Image 
              src={"/images/placeholder.svg"}
              alt={movie.title}
              width={300}
              height={450}
              className="w-full rounded-lg shadow-md"
            />
          </div>
          <div className="md:w-2/3">
            <h1 className="text-3xl font-bold mb-4">{movie.title}</h1>
            <p className="text-gray-600 mb-4">{movie.year}</p>
            <p className="text-gray-800">{movie.description}</p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MovieDetails;