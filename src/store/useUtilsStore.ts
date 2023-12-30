import { Point, SelectedElement, SelectedText } from 'types';
import { createWithEqualityFn } from 'zustand/traditional';

type SelectedBaseElement = {
  id: string;
};

type SelectedBaseText = {
  id: string;
  text: string;
};

interface UseUtilParams {
  editingText: SelectedText;
  editTitle: boolean;
  selected: SelectedElement;
  points: Point | null;
  setSelected: (value: SelectedElement) => void;
  setPoints: (value: Point | null) => void;
  setEditTitle: (value: boolean) => void;
  setEditingText: (value: SelectedText) => void;
  hasMode: () => boolean;
  isSelected: (value: SelectedBaseElement) => boolean;
  isSelectedModalOpen: (value: SelectedBaseElement) => boolean;
  isContextModalOpen: () => boolean;
  isCurrentTextSelected: (value: SelectedBaseText) => boolean;
  isTextSelected: () => boolean;
}

export const useUtilsStore = createWithEqualityFn<UseUtilParams>()(
  (set, get) => {
    return {
      editingText: null,
      editTitle: false,
      selected: null,
      points: null,
      isTextSelected: () => !!get().editingText,
      isCurrentTextSelected: ({ id, text }) => {
        return (
          !!get().editingText &&
          get().editingText?.id === id &&
          get().editingText?.text === text
        );
      },
      isSelected: ({ id }) => !!get().selected && get().selected?.id === id,
      isSelectedModalOpen: (sel) =>
        get().isSelected(sel) && !!get().selected?.open,
      isContextModalOpen: () => !!get().selected?.open,
      setSelected: (value) => set({ selected: value }),
      setPoints: (value) => set({ points: value }),
      setEditingText: (value) => {
        set({ selected: null });
        set({ editingText: value });
      },
      setEditTitle: (value) => set({ editTitle: value }),
      hasMode: () => get().editTitle || !!get().selected || !!get().points,
    };
  },
  Object.is,
);
