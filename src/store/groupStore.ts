import { GroupCovers, PosTypes } from 'types';
import { StateCreator } from 'zustand';

export interface UseGrouspParams {
  groups: Array<GroupCovers>;
  updateGroupDir: (coverId: string, dir: PosTypes) => void;
  updateGroupsText: (coverId: string, titleText: string) => void;
  addGroups: (filteredResults: Array<GroupCovers>) => void;
  getScale: (id: string) => {
    scaleX: GroupCovers['scaleX'];
    scaleY: GroupCovers['scaleY'];
  };
}

export const createGroupsSlice: StateCreator<
  UseGrouspParams,
  [],
  [],
  UseGrouspParams
> = (set, get) => ({
  groups: [],
  getScale: (id: string) => ({
    scaleX: get().groups.find((star) => star.id === id)?.scaleX ?? 1,
    scaleY: get().groups.find((star) => star.id === id)?.scaleY ?? 1,
  }),
  updateGroupDir(coverId, dir) {
    set(({ groups }) => ({
      groups: groups.map((star) =>
        star.id === coverId
          ? {
              ...star,
              dir,
            }
          : star,
      ),
    }));
  },
  updateGroupsText(coverId, titleText) {
    set(({ groups }) => ({
      groups: groups.map((star) =>
        coverId === star.id
          ? {
              ...star,
              title: titleText,
            }
          : star,
      ),
    }));
  },
  addGroups(filteredResults) {
    set(({ groups }) => ({
      groups: [...groups, ...filteredResults],
    }));
  },
});
