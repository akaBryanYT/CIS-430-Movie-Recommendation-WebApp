import Link from 'next/link';

const Header = () => {
  return (
    <header className="bg-white shadow-md">
      <nav className="container mx-auto px-6 py-4">
        <ul className="flex space-x-4">
          <li>
            <Link href="/" className="text-gray-800 hover:text-gray-600">
              Home
            </Link>
          </li>
          <li>
            <Link href="/recommendations" className="text-gray-800 hover:text-gray-600">
              Recommendations
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;