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
      const results = (await getLastFMAlbums(inputArray, apiKey)) ?? [];

      const filtereResults = results.filter(
        (filteredResult) =>
          !covers.find(
            (star) =>
              star[LabelType.TITLE].search ===
                filteredResult[LabelType.TITLE] &&
              star[LabelType.SUBTITLE].search ===
                filteredResult[LabelType.SUBTITLE],
          ),
      );

      if (filtereResults.length) {
        addCovers(
          filtereResults.map((filteredResult) => ({
            id: uuidv4(),
            link: filteredResult.link,
            x: 0,
            y: 0,
            [LabelType.TITLE]: {
              search: filteredResult[LabelType.TITLE],
              text: filteredResult[LabelType.TITLE],
            },
            [LabelType.SUBTITLE]: {
              search: filteredResult[LabelType.SUBTITLE],
              text: filteredResult[LabelType.SUBTITLE],
            },
            dir: PosTypes.BOTTOM,
          })),
        );
        showSuccessMessage(
          `${filtereResults.length}/${inputArray.length} results found`,
        );
      } else {
        showErrorMessage('Not found results or already exists');
      }
    } catch (err) {
      showErrorMessage('Result not found');
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
