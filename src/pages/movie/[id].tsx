import { useRouter } from 'next/router';
import useSWR from 'swr';

import { Meta } from '@/layouts/Meta';
import { Main } from '@/templates/Main';

const fetcher = (url: string) => fetch(url).then((res) => res.json());
const OMDB_MOVIE_URL = 'https://www.omdbapi.com/?apikey=a93ceeb4&i=';

type IMovie = {
  Title: string;
  Year: string;
  Rated: string;
  Released: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Writer: string;
  Actors: string;
  Plot: string;
  Language: string;
  Country: string;
  Awards: string;
  Poster: string;
  Ratings: [
    { Source: string; Value: string },
    { Source: string; Value: string },
    { Source: string; Value: string }
  ];
  Metascore: string;
  imdbRating: string;
  imdbVotes: string;
  imdbID: string;
  Type: string;
  DVD: string;
  BoxOffice: string;
  Production: string;
  Website: string;
  Response: string;
};

const Movie = () => {
  const router = useRouter();
  const { id } = router.query;

  const { data } = useSWR<IMovie>(OMDB_MOVIE_URL + id, fetcher);

  const renderRating = (rating: number) => {
    const imdbRatingToStars = Math.floor(rating / 2);
    const greyStars = 5 - imdbRatingToStars;
    const goldStarsArray = Array(imdbRatingToStars).fill(
      <svg
        className="h-5 w-5 text-yellow-400"
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
      </svg>
    );
    const greyStarsArray = Array(greyStars).fill(
      <svg
        className="h-5 w-5 text-gray-300 dark:text-gray-500"
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
      </svg>
    );
    return [...goldStarsArray, ...greyStarsArray];
  };

  return (
    <Main
      meta={<Meta title={data?.Title || ''} description={data?.Plot || ''} />}
    >
      <div>
        <div className="flex flex-col items-start sm:flex-row">
          <div className="w-full sm:mr-4 sm:w-40">
            <img
              className="w-full shadow-lg drop-shadow-lg sm:w-96"
              src={data?.Poster}
              alt={data?.Title}
              loading="lazy"
            />
          </div>
          <div className="flex-1 flex-col align-top">
            <h1 className="text-2xl font-bold">{data?.Title || ''}</h1>
            <div className="flex">
              {renderRating(
                data?.imdbRating ? parseInt(data.imdbRating, 10) : 0
              )}
            </div>
            <div>
              <p>{data?.Plot || ''}</p>
              {data?.Released ? (
                <p className="text-sm text-gray-600">
                  Released in {new Date(data?.Released).getFullYear() || ''}
                </p>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </Main>
  );
};

export default Movie;
