import { Dispatch, SetStateAction } from 'react';
import {
  Colors,
  BackColors,
  PosTypes,
  ToolbarConfigParams,
  LocalStorageKeys,
  LocalStorageData,
} from 'types';

export const initialConfigValues = {
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
  resetConfigs: () => void;
  updateConfigs: (newConfig: ToolbarConfigParams) => void;
  resetTitle: () => void;
  updateTitle: (title: string) => void;
}

export const useConfigs = (
  setConfigs: (
    currentConfig: (curr: ToolbarConfigParams) => ToolbarConfigParams,
  ) => void,
): UseConfigsParams => {
  return {
    resetConfigs: () => {
      setConfigs(() => ({ ...initialConfigValues }));
    },
    updateConfigs: (newConfig) => {
      setConfigs(() => ({
        ...newConfig,
      }));
    },
    resetTitle: () => {
      setConfigs((currentConfigs) => ({
        ...currentConfigs,
        title: initialConfigValues.title,
      }));
    },
    updateTitle: (title) => {
      setConfigs((currentConfigs) => ({
        ...currentConfigs,
        title,
      }));
    },
  };
};
