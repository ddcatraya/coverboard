import { ToolConfigIDs, TooltipValues } from 'types';
import { getHash } from 'utils';
import { createWithEqualityFn } from 'zustand/traditional';

interface UseToolbarParams {
  openSearch: boolean;
  openConfig: boolean;
  openShare: boolean;
  tooltip: TooltipValues | null;
  setOpenSearch: (value: boolean) => void;
  setOpenConfig: (value: boolean) => void;
  setOpenShare: (value: boolean) => void;
  setTooltip: (value: TooltipValues | null) => void;
}

export const useToolbarStore = createWithEqualityFn<UseToolbarParams>()(
  (set) => {
    const hash = getHash();

    return {
      openSearch: hash === ToolConfigIDs.SEARCH,
      openConfig: hash === ToolConfigIDs.CONFIG,
      openShare: hash === ToolConfigIDs.SHARE,
      tooltip: null,
      setOpenSearch: (value: boolean) => set({ openSearch: value }),
      setOpenConfig: (value: boolean) => set({ openConfig: value }),
      setOpenShare: (value: boolean) => set({ openShare: value }),
      setTooltip: (value: TooltipValues | null) => set({ tooltip: value }),
    };
  },
  Object.is,
);
