import axios from 'axios';
import { CoverValues, LabelType, SearchResults } from 'types';

const isFulfilled = <T>(
  p: PromiseSettledResult<T>,
): p is PromiseFulfilledResult<T> => p.status === 'fulfilled';

// Function to get the poster image of a movie
export const getGames = async (
  movieTitles: Array<CoverValues>,
): Promise<Array<SearchResults>> => {
  const posters = await Promise.allSettled(
    movieTitles.map((movie) => {
      return axios.get(`https://albumcoverboard.vercel.app/api/get-game`, {
        params: {
          game: movie[LabelType.TITLE],
        },
      });
    }),
  );

  const fullPosters = posters.filter(isFulfilled);

  return fullPosters.flatMap(({ value: game }: any) => {
    const gameCount = game.data.count;

    if (gameCount > 0) {
      console.log(game.data.results[0]);
      const link = game.data.results[0].background_image;
      return {
        link,
        [LabelType.TITLE]: game.data.results[0].name,
        [LabelType.SUBTITLE]: game.data.results[0].released.substring(0, 4),
      };
    }

    return [];
  });
};
