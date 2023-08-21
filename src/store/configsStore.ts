import { Colors, BackColors, PosTypes, ToolbarConfigParams } from 'types';
import { StateCreator } from 'zustand';

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
  configs: ToolbarConfigParams;
  resetConfigs: () => void;
  updateConfigs: (newConfig: ToolbarConfigParams) => void;
  resetTitle: () => void;
  updateTitle: (title: string) => void;
}

export const createConfigsSlice: StateCreator<
  UseConfigsParams,
  [],
  [],
  UseConfigsParams
> = (set) => ({
  configs: initialConfigValues(),
  resetConfigs: () => {
    set({ configs: initialConfigValues() });
  },
  updateConfigs: (newConfig) => {
    set({
      configs: { ...newConfig },
    });
  },
  resetTitle: () => {
    set(({ configs }) => ({
      configs: {
        ...configs,
        title: '',
      },
    }));
  },
  updateTitle: (title) => {
    set(({ configs }) => ({
      configs: { ...configs, title },
    }));
  },
});
