import { Point } from 'types';
import { createWithEqualityFn } from 'zustand/traditional';

type SelectedBaseElement = {
  id: string;
  elem: 'cover' | 'group' | 'arrow';
};

type SelectedElement = {
  id: string;
  elem: 'cover' | 'group' | 'arrow';
  open: boolean;
} | null;

interface UseUtilParams {
  editTitle: boolean;
  selected: SelectedElement;
  points: Point | null;
  setSelected: (value: SelectedElement) => void;
  setPoints: (value: Point | null) => void;
  setEditTitle: (value: boolean) => void;
  hasMode: () => boolean;
  isSelected: (value: SelectedBaseElement) => boolean;
  isSelectedModalOpen: (value: SelectedBaseElement) => boolean;
  isContextModalOpen: () => boolean;
}

export const useUtilsStore = createWithEqualityFn<UseUtilParams>()(
  (set, get) => {
    return {
      editTitle: false,
      selected: null,
      points: null,
      isSelected: ({ id, elem }) =>
        !!get().selected &&
        get().selected?.id === id &&
        get().selected?.elem === elem,
      isSelectedModalOpen: (sel) =>
        get().isSelected(sel) && !!get().selected?.open,
      isContextModalOpen: () => !!get().selected?.open,
      setSelected: (value) => set({ selected: value }),
      setPoints: (value) => set({ points: value }),
      setEditTitle: (value) => set({ editTitle: value }),
      hasMode: () => get().editTitle || !!get().selected || !!get().points,
    };
  },
  Object.is,
);
