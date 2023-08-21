import { Point, ToolConfigIDs } from 'types';
import { getHash } from 'utils';
import { create } from 'zustand';

interface UseUtilParams {
  erase: boolean;
  editLines: boolean;
  points: Point | null;
}

export const useUtilsStore = create<UseUtilParams>()((set) => {
  const hash = getHash();

  return {
    erase: hash === ToolConfigIDs.ERASE,
    editLines: hash === ToolConfigIDs.ARROW,
    points: null,
    setErase: (value: boolean) => set({ erase: value }),
    setEditLines: (value: boolean) => set({ editLines: value }),
    setPoints: (value: Point | null) => set({ points: value }),
  };
});
