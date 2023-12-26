import { Point } from 'types';
import { createWithEqualityFn } from 'zustand/traditional';

type SelectedElement = { id: string; elem: 'cover' | 'group' | 'arrow' } | null;

interface UseUtilParams {
  editTitle: boolean;
  selected: SelectedElement;
  points: Point | null;
  setSelected: (value: SelectedElement) => void;
  setPoints: (value: Point | null) => void;
  setEditTitle: (value: boolean) => void;
  hasMode: () => boolean;
}

export const useUtilsStore = createWithEqualityFn<UseUtilParams>()(
  (set, get) => {
    return {
      editTitle: false,
      selected: null,
      points: null,
      setSelected: (value) => set({ selected: value }),
      setPoints: (value) => set({ points: value }),
      setEditTitle: (value) => set({ editTitle: value }),
      hasMode: () => get().editTitle || !!get().selected || !!get().points,
    };
  },
  Object.is,
);
