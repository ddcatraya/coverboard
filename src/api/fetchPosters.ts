import axios from 'axios';
import { CoverLabelValues, SearchResults } from 'types';

const isFulfilled = <T>(
  p: PromiseSettledResult<T>,
): p is PromiseFulfilledResult<T> => p.status === 'fulfilled';

// Function to get the poster image of a movie
export const getMoviePosters = async (
  movieTitles: Array<CoverLabelValues>,
): Promise<Array<SearchResults>> => {
  const posters = await Promise.allSettled(
    movieTitles.map((movie) => {
      return axios.get(`https://albumcoverboard.vercel.app/api/get-movie`, {
        params: {
          query: movie.title,
          ...(movie.subtitle && { year: movie.subtitle }),
        },
      });
    }),
  );

  const fullPosters = posters.filter(isFulfilled);

  return fullPosters.flatMap((poster: any) => {
    const movies = poster.value.data;

    if (movies.length > 0 && movies[0].poster_path) {
      const posterUrl = `https://image.tmdb.org/t/p/original${movies[0].poster_path}`;
      return {
        link: posterUrl,
        title: movies[0].original_title,
        subtitle: movies[0].release_date.substring(0, 4),
      };
    }

    return [];
  });
};

export const getTvShowPosters = async (
  movieTitles: Array<CoverLabelValues>,
): Promise<Array<SearchResults>> => {
  const posters = await Promise.allSettled(
    movieTitles.map((movie) => {
      return axios.get(`https://albumcoverboard.vercel.app/api/get-tv`, {
        params: {
          query: movie.title,
          ...(movie.subtitle && { year: movie.subtitle }),
        },
      });
    }),
  );

  const fullPosters = posters.filter(isFulfilled);

  return fullPosters.flatMap((poster: any) => {
    const movies = poster.value.data;

    if (movies.length > 0 && movies[0].poster_path) {
      const posterUrl = `https://image.tmdb.org/t/p/original${movies[0].poster_path}`;
      return {
        link: posterUrl,
        title: movies[0].name,
        subtitle: movies[0].first_air_date.substring(0, 4),
      };
    }

    return [];
  });
};
