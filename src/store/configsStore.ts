import {
  Colors,
  BackColors,
  PosTypes,
  ToolbarConfigParams,
  ToolConfigIDs,
  DragLimits,
  colorMap,
  backColorMap,
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
  toobarIconSize: () => number;
  fontSize: () => number;
  circleRadius: () => number;
  getCurrentY: (index: number) => number;
  dragLimits: () => DragLimits;
  toolBarLimits: () => DragLimits;
  setWindowSize: () => void;
  getColor: () => string;
  getBackColor: () => string;
  windowSize: {
    width: number;
    height: number;
  };
}

export const createConfigsSlice: StateCreator<
  UseConfigsParams,
  [],
  [],
  UseConfigsParams
> = (set, get) => ({
  configs: initialConfigValues(),
  getColor: () => colorMap[get().configs.color],
  getBackColor: () => backColorMap[get().configs.backColor],
  windowSize: {
    width: window.innerWidth,
    height: window.innerHeight,
  },
  setWindowSize: () => {
    set({
      windowSize: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
    });
  },
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
  toobarIconSize: () => get().configs.size / 2.5,
  fontSize: () => get().configs.size / 7,
  circleRadius: () => get().configs.size / 7 / 1.5,
  dragLimits: () => ({
    x: 2.5 * get().toobarIconSize(),
    y: 0,
    width: window.innerWidth - 3.5 * get().toobarIconSize(),
    height: window.innerHeight - 1 * get().toobarIconSize(),
  }),
  getCurrentY: (index: number) =>
    0 + index * (get().toobarIconSize() + get().toobarIconSize() / 2),
  toolBarLimits: () => ({
    x: 0,
    y: 0,
    width: get().toobarIconSize() * 2,
    height:
      get().getCurrentY(Object.keys(ToolConfigIDs).length - 1) +
      2 * get().toobarIconSize(),
  }),
});
