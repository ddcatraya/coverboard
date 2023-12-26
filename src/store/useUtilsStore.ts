import { Point } from 'types';
import { createWithEqualityFn } from 'zustand/traditional';

type SelectedElement = { id: string; elem: 'cover' | 'group' | 'arrow' } | null;

interface UseUtilParams {
  selected: SelectedElement;
  editLines: boolean;
  points: Point | null;
  setEditLines: (value: boolean) => void;
  setSelected: (value: SelectedElement) => void;
  setPoints: (value: Point | null) => void;
}

export const useUtilsStore = createWithEqualityFn<UseUtilParams>()((set) => {
  return {
    selected: null,
    editLines: false,
    points: null,
    setEditLines: (value) => set({ editLines: value }),
    setSelected: (value) => set({ selected: value }),
    setPoints: (value) => set({ points: value }),
  };
}, Object.is);
