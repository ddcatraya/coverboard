import axios from 'axios';

import { CoverValues, LabelType, SearchResults } from 'types';

const isFulfilled = <T>(
  p: PromiseSettledResult<T>,
): p is PromiseFulfilledResult<T> => p.status === 'fulfilled';

export const getLastFMAlbums = async (
  bandArray: Array<CoverValues>,
): Promise<Array<SearchResults>> => {
  const albums = await Promise.allSettled(
    bandArray.map((band) => {
      return axios.get('https://albumcoverboard.vercel.app/api/get-album', {
        params: {
          artist: band[LabelType.TITLE].trim(),
          album: band[LabelType.SUBTITLE].trim(),
        },
      });
    }),
  );

  const fullAlbums = albums.filter(isFulfilled);

  return fullAlbums.flatMap((album) => {
    const { data } = album.value;

    if (data.album) {
      if (data.album.image[2]['#text']) {
        return {
          link: data.album.image[2]['#text'],
          [LabelType.TITLE]: data.album.artist,
          [LabelType.SUBTITLE]: data.album.name,
        };
      }
    }

    return [];
  });
};
