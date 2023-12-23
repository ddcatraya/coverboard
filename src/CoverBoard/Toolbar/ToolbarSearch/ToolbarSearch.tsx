import { Html } from 'react-konva-utils';

import {
  getBookCovers,
  getLastFMAlbums,
  getMoviePosters,
  getGames,
  getTvShowPosters,
} from 'api';
import { ToolbarSearchPopover } from '.';
import { CoverValues, LabelType, Media, PosTypes } from 'types';
import { v4 as uuidv4 } from 'uuid';
import { useMainStore, useToastStore, useToolbarStore } from 'store';
import { shallow } from 'zustand/shallow';

const ApiToCallMap = {
  [Media.MUSIC]: getLastFMAlbums,
  [Media.MOVIE]: getMoviePosters,
  [Media.BOOK]: getBookCovers,
  [Media.GAME]: getGames,
  [Media.TVSHOW]: getTvShowPosters,
};

export const ToolbarSearch: React.FC = () => {
  const covers = useMainStore((state) => state.covers);
  const media = useMainStore((state) => state.configs.media);
  const addCovers = useMainStore((state) => state.addCovers);
  const showSuccessMessage = useToastStore((state) => state.showSuccessMessage);
  const showErrorMessage = useToastStore((state) => state.showErrorMessage);
  const [openSearch, setOpenSearch] = useToolbarStore(
    (state) => [state.openSearch, state.setOpenSearch],
    shallow,
  );

  const handleSearch = async (inputArray: Array<CoverValues>) => {
    try {
      const ApiToCall = ApiToCallMap[media];
      const results = (await ApiToCall(inputArray)) ?? [];
      const resultLength = results.length;

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
        if (resultLength !== filtereResults.length) {
          showErrorMessage('Result already exists on the board');
        } else {
          showErrorMessage('Result not found');
        }

        return Promise.reject('NOT_FOUND');
      }
    } catch (err) {
      showErrorMessage('Invalid API call');
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
