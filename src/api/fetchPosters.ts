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
          ...(movie[LabelType.SUBTITLE] && { year: movie[LabelType.TITLE] }),
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
        [LabelType.SUBTITLE]: movies[0].release_date.substring(0, 4),
      };
    }

    return [];
  });
};
