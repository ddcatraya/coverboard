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
    movieTitles.map((game) => {
      return axios.get(`https://albumcoverboard.vercel.app/api/get-game`, {
        params: {
          game: game[LabelType.TITLE],
          ...(game[LabelType.SUBTITLE] && { year: game[LabelType.SUBTITLE] }),
        },
      });
    }),
  );

  const fullPosters = posters.filter(isFulfilled);

  return fullPosters.flatMap(({ value: game }: any) => {
    const gameCount = game.data ?? [];

    if (gameCount.length > 0) {
      const link = gameCount[0].background_image;
      return {
        link,
        [LabelType.TITLE]: gameCount[0].name,
        [LabelType.SUBTITLE]: gameCount[0].released.substring(0, 4),
      };
    }

    return [];
  });
};
