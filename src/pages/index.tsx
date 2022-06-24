import { useRouter } from 'next/router';
import { useState } from 'react';
import useSWRInfinite from 'swr/infinite';

import { Meta } from '@/layouts/Meta';
import { Main } from '@/templates/Main';

const fetcher = (url: string) => fetch(url).then((res) => res.json());
const OMDB_SEARCH_URL = 'https://www.omdbapi.com/?apikey=a93ceeb4';

type Movie = {
  Title: string;
  Year: string;
  imdbID: string;
  Type: string;
  Poster: string;
};

type MovieDataResponse = {
  Search: Movie[];
  totalResults: string;
  Response: 'True' | 'False';
  Error?: string;
};

const Index = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState('');

  const { data, error, size, setSize } = useSWRInfinite<MovieDataResponse>(
    (index) => `${OMDB_SEARCH_URL}&s=${searchTerm}&page=${index + 1}`,
    fetcher,
    {
      initialSize: 1,
    }
  );

  const isLoadingInitialData = !data && !error;
  const isLoadingMore =
    isLoadingInitialData ||
    (size > 0 && data && typeof data[size - 1] === 'undefined');

  return (
    <Main meta={<Meta title="BMAS Movie DB" description="Movie DB" />}>
      <div className=" relative mx-auto w-full max-w-xl rounded-full bg-white lg:max-w-none">
        <input
          placeholder="e.g. Pulp Fiction"
          className="h-16 w-full rounded-full border-2 border-gray-100 bg-transparent py-0 pl-8 pr-32 shadow-md outline-none hover:outline-none focus:border-red-200 focus:ring-red-200"
          type="text"
          name="query"
          id="query"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              setSearchTerm(searchInput);
              setSize(1);
            }
          }}
        />
        <button
          type="submit"
          className="absolute right-3 top-3 inline-flex h-10 items-center rounded-full bg-red-600 px-4 py-2 text-sm text-white outline-none transition duration-300 ease-in-out hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:px-6 sm:text-base sm:font-medium"
          onClick={() => {
            setSearchTerm(searchInput);
            setSize(1);
          }}
        >
          <svg
            className="-ml-0.5 mr-2 h-4 w-4 sm:-ml-1 sm:h-5 sm:w-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            ></path>
          </svg>
          Search
        </button>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
          {data?.map((response) => {
            return response?.Search?.map((movie) => (
              <div
                className="flex flex-col items-center justify-center transition duration-300 ease-in-out hover:cursor-pointer hover:opacity-75"
                key={movie.imdbID}
                onClick={() => router.push(`/movie/${movie.imdbID}`)}
              >
                <img
                  src={movie.Poster}
                  alt={movie.Title}
                  className="h-80 w-60 rounded-sm shadow-lg shadow-red-500/10 drop-shadow-xl"
                />
                <h3 className="mt-2 h-24 text-xl font-bold">{movie.Title}</h3>
              </div>
            ));
          })}
        </div>
        <view className="flex flex-col items-center justify-center">
          {isLoadingMore && (
            <svg
              role="status"
              className="mr-2 mb-2 inline h-8 w-8 animate-spin fill-red-600 text-gray-200 dark:text-gray-600"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
          )}
          {!isLoadingInitialData && searchTerm !== '' && (
            <button
              type="submit"
              disabled={isLoadingMore}
              className=" inline-flex h-10 w-32 items-center rounded-full bg-red-600 px-4 py-2 text-center text-sm text-white outline-none transition duration-300 ease-in-out hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:px-6 sm:text-base sm:font-medium"
              onClick={() => setSize(size + 1)}
            >
              Load more
            </button>
          )}
        </view>
      </div>
    </Main>
  );
};

export default Index;
