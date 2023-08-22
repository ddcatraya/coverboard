import {
  Colors,
  BackColors,
  PosTypes,
  ToolbarConfigParams,
  ToolConfigIDs,
  DragLimits,
} from 'types';
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
  coverSize: () => number;
  toobarIconSize: () => number;
  fontSize: () => number;
  circleRadius: () => number;
  getCurrentY: (index: number) => number;
  dragLimits: () => DragLimits;
  toolBarLimits: () => DragLimits;
}

export const createConfigsSlice: StateCreator<
  UseConfigsParams,
  [],
  [],
  UseConfigsParams
> = (set, get) => ({
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
  coverSize: () => get().configs.size,
  toobarIconSize: () => get().configs.size / 2.5,
  fontSize: () => get().configs.size / 7,
  circleRadius: () => get().configs.size / 7 / 1.5,
  dragLimits: () => ({
    x: 3 * get().toobarIconSize(),
    y: get().toobarIconSize() / 2,
    width:
      window.innerWidth -
      3 * get().toobarIconSize() -
      get().toobarIconSize() / 2,
    height: window.innerHeight - get().toobarIconSize(),
  }),
  getCurrentY: (index: number) =>
    0 + index * (get().toobarIconSize() + get().toobarIconSize() / 2),
  toolBarLimits: () => ({
    x: get().toobarIconSize() / 2,
    y: get().toobarIconSize() / 2,
    width: get().toobarIconSize() * 2,
    height:
      get().getCurrentY(Object.keys(ToolConfigIDs).length - 1) +
      2 * get().toobarIconSize(),
  }),
});

/*
onst dragLimits = {
    x: 3 * toobarIconSize,
    y: toobarIconSize / 2,
    width: windowSize.width - 3 * toobarIconSize - toobarIconSize / 2,
    height: windowSize.height - toobarIconSize,
  };

  const toolBarLimits = {
    x: toobarIconSize / 2,
    y: toobarIconSize / 2,
    width: toobarIconSize * 2,
    height:
      getCurrentY(Object.keys(ToolConfigIDs).length - 1) + 2 * toobarIconSize,
  };*/
