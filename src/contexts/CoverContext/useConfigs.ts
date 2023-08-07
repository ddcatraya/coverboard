import { Dispatch, SetStateAction } from 'react';
import {
  Colors,
  BackColors,
  PosTypes,
  ToolbarConfigParams,
  LocalStorageKeys,
  LocalStorageData,
} from 'types';
import { useLocalStorage } from 'usehooks-ts';

const initialConfigValues = {
  size: 100,
  title: 'Album covers',
  color: Colors.YELLOW,
  backColor: BackColors.DARK,
  showArtist: true,
  showAlbum: true,
  showTitle: true,
  labelDir: PosTypes.BOTTOM,
};

export interface UseConfigsParams {
  [LocalStorageKeys.CONFIG]: LocalStorageData[LocalStorageKeys.CONFIG];
  setConfigs: Dispatch<
    SetStateAction<LocalStorageData[LocalStorageKeys.CONFIG]>
  >;
  resetConfigs: () => void;
  updateConfigs: (newConfig: ToolbarConfigParams) => void;
  resetTitle: () => void;
  updateTitle: (title: string) => void;
}

export const useConfigs = (): UseConfigsParams => {
  const [configs, setConfigs] = useLocalStorage<ToolbarConfigParams>(
    LocalStorageKeys.CONFIG,
    {
      ...initialConfigValues,
    },
  );

  return {
    configs,
    setConfigs,
    resetConfigs: () => setConfigs({ ...initialConfigValues }),
    updateConfigs: (newConfig) =>
      setConfigs({
        ...newConfig,
      }),
    resetTitle: () =>
      setConfigs((currentConfigs) => ({
        ...currentConfigs,
        title: initialConfigValues.title,
      })),
    updateTitle: (title) =>
      setConfigs((currentConfigs) => ({
        ...currentConfigs,
        title,
      })),
  };
};
