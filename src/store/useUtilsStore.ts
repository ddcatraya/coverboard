import { Point } from 'types';
import { createWithEqualityFn } from 'zustand/traditional';

type SelectedElement = { id: string; elem: 'cover' | 'group' | 'arrow' } | null;

interface UseUtilParams {
  selected: SelectedElement;
  points: Point | null;
  setSelected: (value: SelectedElement) => void;
  setPoints: (value: Point | null) => void;
}

export const useUtilsStore = createWithEqualityFn<UseUtilParams>()((set) => {
  return {
    selected: null,
    points: null,
    setSelected: (value) => set({ selected: value }),
    setPoints: (value) => set({ points: value }),
  };
}, Object.is);
