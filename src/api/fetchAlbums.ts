import axios from 'axios';
import { CoverImage } from 'contexts/CoverContext';
import { RenderDir } from 'conva/components/DrawLines';
import { DragLimits } from 'types';
import { v4 as uuidv4 } from 'uuid';
import { apiConfig } from './api.config';

const url = 'https://api.discogs.com/database/search';

export type BandSearchParams = Array<{
  artist: string;
  album: string;
}>;

export const getAlbums = async (
  bandArray: BandSearchParams,
  draglimits: DragLimits,
  coverSize: number,
): Promise<Array<CoverImage>> => {
  const albums = await Promise.all(
    bandArray.map((band) => {
      const searchString = `${band.artist} - ${band.album}`;
      const params = {
        q: searchString,
        type: 'release',
      };

      return axios.get(`${url}?${new URLSearchParams(params)}`, {
        headers: {
          Authorization: `Discogs key=${apiConfig.DiscogsKey}, secret=${apiConfig.DiscogsSecret}`,
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
      const [currentArist, currentAlbum] = results[0].title
        .split('-')
        .map((str: string) => str.trim());

      return {
        id: uuidv4(),
        link: results[0].cover_image,
        x: draglimits.x + coverSize / 2,
        y: draglimits.y + coverSize / 2,
        isDragging: false,
        width: coverSize,
        height: coverSize,
        lines: [],
        artist: currentArist,
        album: currentAlbum,
        dir: RenderDir.DOWN,
      };
    }

    return [];
  });
};
