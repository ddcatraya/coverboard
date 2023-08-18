import { Html } from 'react-konva-utils';

import { getLastFMAlbums } from 'api';
import {
  useApiContext,
  useCoverContext,
  useToastContext,
  useToolbarContext,
} from 'contexts';
import { ToolbarSearchPopover } from '.';
import { PosTypes, SearchParams } from 'types';
import { v4 as uuidv4 } from 'uuid';

export const ToolbarSearch: React.FC = () => {
  const { cover, addCovers } = useCoverContext();
  const { showSuccessMessage, showErrorMessage } = useToastContext();
  const { apiKey } = useApiContext();
  const { openSearch, setOpenSearch } = useToolbarContext();

  const handleSearch = async (inputArray: Array<SearchParams>) => {
    try {
      const albums = (await getLastFMAlbums(inputArray, apiKey)) ?? [];

      const filteredAlbums = albums.filter(
        (filteredAlbum) =>
          !cover.find(
            (star) =>
              star.artistLabel.originalText === filteredAlbum.artist &&
              star.albumLabel.originalText === filteredAlbum.album,
          ),
      );

      if (filteredAlbums.length) {
        addCovers(
          filteredAlbums.map((filteredAlbum) => ({
            id: uuidv4(),
            link: filteredAlbum.link,
            x: 0,
            y: 0,
            artistLabel: {
              originalText: filteredAlbum.artist,
              text: filteredAlbum.artist,
            },
            albumLabel: {
              originalText: filteredAlbum.album,
              text: filteredAlbum.album,
            },
            dir: PosTypes.BOTTOM,
          })),
        );
        showSuccessMessage(
          `${filteredAlbums.length}/${inputArray.length} album found`,
        );
      } else {
        showErrorMessage('Album not found or already exists');
      }
    } catch (err) {
      showErrorMessage('Albums not found');
    }
  };

  if (!openSearch) return null;

  return (
    <Html>
      <ToolbarSearchPopover
        open={openSearch}
        onClose={() => setOpenSearch(false)}
        onSubmit={handleSearch}
      />
    </Html>
  );
};
