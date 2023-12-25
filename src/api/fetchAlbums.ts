import axios from 'axios';

import { CoverLabelValues, SearchResults } from 'types';

const isFulfilled = <T>(
  p: PromiseSettledResult<T>,
): p is PromiseFulfilledResult<T> => p.status === 'fulfilled';

export const getLastFMAlbums = async (
  bandArray: Array<CoverLabelValues>,
): Promise<Array<SearchResults>> => {
  const albums = await Promise.allSettled(
    bandArray.map((band) => {
      return axios.get('https://albumcoverboard.vercel.app/api/get-album', {
        params: {
          artist: band.title.trim(),
          album: band.subtitle.trim(),
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
          title: data.album.artist,
          subtitle: data.album.name,
        };
      }
    }

    return [];
  });
};
