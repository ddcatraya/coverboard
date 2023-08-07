import axios from 'axios';
import { url } from 'inspector';
import { ApiKey, SearchResults } from 'types';

type BandSearchParams = Array<{
  artist: string;
  album: string;
}>;

interface DiscogsKey {
  DiscogsKey: string;
  DiscogsSecret: string;
}

export const testDiscogsAPICredentials = ({
  DiscogsKey,
  DiscogsSecret,
}: DiscogsKey) => {
  const apiUrl = 'https://api.discogs.com/database/search?q=album_title';

  return axios.get(apiUrl, {
    headers: {
      Authorization: `Discogs key=${DiscogsKey}, secret=${DiscogsSecret}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });
};

export const getAlbums = async (
  bandArray: BandSearchParams,
  apiKey: DiscogsKey,
): Promise<Array<SearchResults>> => {
  const albums = await Promise.all(
    bandArray.map((band) => {
      const searchString = `${band.artist} - ${band.album}`;
      const params = {
        q: searchString,
        type: 'release',
      };

      return axios.get(`${url}?${new URLSearchParams(params)}`, {
        headers: {
          Authorization: `Discogs key=${apiKey.DiscogsKey}, secret=${apiKey.DiscogsSecret}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });
    }),
  );

  return albums.flatMap((album) => {
    const {
      data: { results },
    } = album;
    if (results?.length && results[0].master_id !== 0) {
      const [currentArtist, currentAlbum] = results[0].title
        .split('-')
        .map((str: string) => str.trim());

      return {
        link: results[0].cover_image,
        artist: currentArtist,
        album: currentAlbum,
      };
    }

    return [];
  });
};
