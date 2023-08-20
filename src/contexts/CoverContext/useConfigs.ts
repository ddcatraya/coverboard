import { Colors, BackColors, PosTypes, ToolbarConfigParams } from 'types';

const getSize = () => {
  const size = Math.min(150, Math.max(70, window.innerWidth / 20));
  return Math.ceil(size / 10) * 10;
};
export const initialConfigValues = () => ({
  size: getSize(),
  title: '',
  color: Colors.YELLOW,
  backColor: BackColors.DARK,
  showArtist: true,
  showAlbum: true,
  showTitle: true,
  labelDir: PosTypes.BOTTOM,
});

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
      setConfigs(() => initialConfigValues());
    },
    updateConfigs: (newConfig) => {
      setConfigs(() => ({
        ...newConfig,
      }));
    },
    resetTitle: () => {
      setConfigs((currentConfigs) => ({
        ...currentConfigs,
        title: '',
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
