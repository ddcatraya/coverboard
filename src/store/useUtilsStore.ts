import { Point, ToolConfigIDs } from 'types';
import { getHash } from 'utils';
import { createWithEqualityFn } from 'zustand/traditional';

interface UseUtilParams {
  editLines: boolean;
  points: Point | null;
  setEditLines: (value: boolean) => void;
  setPoints: (value: Point | null) => void;
}

export const useUtilsStore = createWithEqualityFn<UseUtilParams>()((set) => {
  const hash = getHash();

  return {
    editLines: hash === ToolConfigIDs.ARROW,
    points: null,
    setEditLines: (value: boolean) => set({ editLines: value }),
    setPoints: (value: Point | null) => set({ points: value }),
  };
}, Object.is);
