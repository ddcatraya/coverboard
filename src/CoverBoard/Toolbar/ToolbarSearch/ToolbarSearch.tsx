import { Html } from 'react-konva-utils';

import { getLastFMAlbums } from 'api';
import {
  useApiContext,
  useCoverContext,
  useSizesContext,
  useToastContext,
  useToolbarContext,
} from 'contexts';
import { ToolbarSearchPopover } from '.';
import { PosTypes, SearchParams } from 'types';
import { v4 as uuidv4 } from 'uuid';

export const ToolbarSearch: React.FC = () => {
  const { cover, addCovers, configs } = useCoverContext();
  const { dragLimits } = useSizesContext();
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
              star.artistLabel.text === filteredAlbum.artist &&
              star.albumLabel.text === filteredAlbum.album,
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
        showSuccessMessage('Artist and Album Found');
      } else {
        showErrorMessage('Artist and Album Not Found or Already exists');
      }
    } catch (err) {
      showErrorMessage('Artist and Album Not found');
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
