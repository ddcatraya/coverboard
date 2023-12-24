import axios from 'axios';
import { CoverValues, LabelType, SearchResults } from 'types';

const isFulfilled = <T>(
  p: PromiseSettledResult<T>,
): p is PromiseFulfilledResult<T> => p.status === 'fulfilled';

// Function to get the poster image of a movie
export const getMoviePosters = async (
  movieTitles: Array<CoverValues>,
): Promise<Array<SearchResults>> => {
  const posters = await Promise.allSettled(
    movieTitles.map((movie) => {
      return axios.get(`https://albumcoverboard.vercel.app/api/get-movie`, {
        params: {
          query: movie[LabelType.TITLE],
          ...(movie[LabelType.SUBTITLE] && { year: movie[LabelType.SUBTITLE] }),
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
        [LabelType.TITLE]: movies[0].original_title,
        [LabelType.SUBTITLE]: movies[0].release_date.substring(0, 4),
      };
    }

    return [];
  });
};

export const getTvShowPosters = async (
  movieTitles: Array<CoverValues>,
): Promise<Array<SearchResults>> => {
  const posters = await Promise.allSettled(
    movieTitles.map((movie) => {
      return axios.get(`https://albumcoverboard.vercel.app/api/get-tv`, {
        params: {
          query: movie[LabelType.TITLE],
          ...(movie[LabelType.SUBTITLE] && { year: movie[LabelType.SUBTITLE] }),
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
        [LabelType.TITLE]: movies[0].name,
        [LabelType.SUBTITLE]: movies[0].first_air_date.substring(0, 4),
      };
    }

    return [];
  });
};