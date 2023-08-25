import axios from 'axios';
import { CoverValues, ApiKey, LabelType, SearchResults } from 'types';

const TMDB_URL = 'https://api.themoviedb.org/3';

const isFulfilled = <T>(
  p: PromiseSettledResult<T>,
): p is PromiseFulfilledResult<T> => p.status === 'fulfilled';

// Function to get the poster image of a movie
export const getMoviePosters = async (
  movieTitles: Array<CoverValues>,
  apiKey: ApiKey,
): Promise<Array<SearchResults>> => {
  const posters = await Promise.allSettled(
    movieTitles.map((movie) => {
      return axios.get(`${TMDB_URL}/search/movie`, {
        params: {
          api_key: apiKey.TMDBKey,
          query: movie[LabelType.TITLE],
        },
      });
    }),
  );

  const fullPosters = posters.filter(isFulfilled);

  return fullPosters.flatMap((poster: any) => {
    const movies = poster.value.data.results;

    if (movies.length > 0 && movies[0].poster_path) {
      const posterUrl = `https://image.tmdb.org/t/p/original${movies[0].poster_path}`;
      return {
        link: posterUrl,
        [LabelType.TITLE]: movies[0].original_title,
        [LabelType.SUBTITLE]: '',
      };
    }

    return [];
  });
};
