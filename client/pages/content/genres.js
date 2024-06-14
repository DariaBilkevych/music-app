import { Genre } from '@dbmusicapp/common';
import Link from 'next/link';

const GenresPage = () => {
  const genres = Object.values(Genre);

  return (
    <div className="container overflow-y-auto h-[65vh] p-3 flex flex-col gap-8">
      <h1 className="text-3xl font-bold text-center shadow-orange-400">
        Музична бібліотека
      </h1>
      <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {genres.map((genre, index) => (
          <Link
            href={`/content/genre/${encodeURIComponent(genre.toLowerCase())}`}
          >
            <li
              key={index}
              className="rounded-lg shadow-md bg-white hover:shadow-orange-300 hover:shadow-md hover:shadow-spread-radius-2 p-4 flex items-center justify-between cursor-pointer"
            >
              <span className="text-sm font-medium">
                {genre.charAt(0).toUpperCase() + genre.slice(1)}
              </span>
              <i className="ri-arrow-right-s-line h-6 w-6 text-3xl text-orange-400 hover:text-orange-600"></i>
            </li>
          </Link>
        ))}
      </ul>
    </div>
  );
};

export default GenresPage;
