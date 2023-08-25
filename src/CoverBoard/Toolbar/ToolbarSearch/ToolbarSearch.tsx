import { Html } from 'react-konva-utils';

import { getLastFMAlbums, getMoviePosters } from 'api';
import { ToolbarSearchPopover } from '.';
import { AlbumCoverValues, LabelType, PosTypes } from 'types';
import { v4 as uuidv4 } from 'uuid';
import { useMainStore, useToastStore, useToolbarStore } from 'store';
import { shallow } from 'zustand/shallow';

export const ToolbarSearch: React.FC = () => {
  const covers = useMainStore((state) => state.covers);
  const addCovers = useMainStore((state) => state.addCovers);
  const apiKey = useMainStore((state) => state.apiKey);
  const showSuccessMessage = useToastStore((state) => state.showSuccessMessage);
  const showErrorMessage = useToastStore((state) => state.showErrorMessage);
  const [openSearch, setOpenSearch] = useToolbarStore(
    (state) => [state.openSearch, state.setOpenSearch],
    shallow,
  );

  const handleSearch = async (inputArray: Array<AlbumCoverValues>) => {
    try {
      const albums = (await getLastFMAlbums(inputArray, apiKey)) ?? [];

      const filteredAlbums = albums.filter(
        (filteredAlbum) =>
          !covers.find(
            (star) =>
              star[LabelType.TITLE].search === filteredAlbum[LabelType.TITLE] &&
              star[LabelType.SUBTITLE].search ===
                filteredAlbum[LabelType.SUBTITLE],
          ),
      );

      if (filteredAlbums.length) {
        addCovers(
          filteredAlbums.map((filteredAlbum) => ({
            id: uuidv4(),
            link: filteredAlbum.link,
            x: 0,
            y: 0,
            [LabelType.TITLE]: {
              search: filteredAlbum[LabelType.TITLE],
              text: filteredAlbum[LabelType.TITLE],
            },
            [LabelType.SUBTITLE]: {
              search: filteredAlbum[LabelType.SUBTITLE],
              text: filteredAlbum[LabelType.SUBTITLE],
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
