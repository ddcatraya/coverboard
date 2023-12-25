import { Point } from 'types';
import { createWithEqualityFn } from 'zustand/traditional';

interface UseUtilParams {
  editLines: boolean;
  points: Point | null;
  setEditLines: (value: boolean) => void;
  setPoints: (value: Point | null) => void;
}

export const useUtilsStore = createWithEqualityFn<UseUtilParams>()((set) => {
  return {
    editLines: false,
    points: null,
    setEditLines: (value: boolean) => set({ editLines: value }),
    setPoints: (value: Point | null) => set({ points: value }),
  };
}, Object.is);
