import axios from 'axios';

import { ApiKey, SearchResults } from 'types';

type BandSearchParams = Array<{
  artist: string;
  album: string;
}>;

const isFulfilled = <T>(
  p: PromiseSettledResult<T>,
): p is PromiseFulfilledResult<T> => p.status === 'fulfilled';

export const getLastFMAlbums = async (
  bandArray: BandSearchParams,
  apiKey: ApiKey,
): Promise<Array<SearchResults>> => {
  const lastFMurl = apiKey.LastFMKey
    ? 'https://ws.audioscrobbler.com/2.0/'
    : 'https://albumcoverboard.vercel.app/api/get-album';

  const albums = await Promise.allSettled(
    bandArray.map((band) => {
      const params = {
        artist: band.artist,
        album: band.album,
        ...(lastFMurl && {
          method: 'album.getinfo',
          api_key: apiKey.LastFMKey,
          format: 'json',
        }),
      };

      return axios.get(`${lastFMurl}?${new URLSearchParams(params)}`);
    }),
  );

  const fullAlbums = albums.filter(isFulfilled);

  return fullAlbums.flatMap((album) => {
    const { data } = album.value;

    if (data.album) {
      if (data.album.image[2]['#text']) {
        return {
          link: data.album.image[2]['#text'],
          artist: data.album.artist,
          album: data.album.name,
        };
      }
    }

    return [];
  });
};
