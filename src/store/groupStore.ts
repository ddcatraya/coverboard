import { GroupCovers, PosTypes } from 'types';
import { StateCreator } from 'zustand';

export interface UseGrouspParams {
  groups: Array<GroupCovers>;
  updateGroupDir: (coverId: string, dir: PosTypes) => void;
  updateGroupSubDir: (coverId: string, dir: PosTypes) => void;
  updateGroupsText: (
    coverId: string,
    titleText: string,
    subtitleText: string,
  ) => void;
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
    scaleX: get().groups.find((group) => group.id === id)?.scaleX ?? 1,
    scaleY: get().groups.find((group) => group.id === id)?.scaleY ?? 1,
  }),
  updateGroupDir(coverId, dir) {
    set(({ groups }) => ({
      groups: groups.map((group) =>
        group.id === coverId
          ? {
              ...group,
              title: {
                ...group.title,
                dir,
              },
            }
          : group,
      ),
    }));
  },
  updateGroupSubDir(coverId, dir) {
    set(({ groups }) => ({
      groups: groups.map((group) =>
        group.id === coverId
          ? {
              ...group,
              subtitle: {
                ...group.subtitle,
                dir,
              },
            }
          : group,
      ),
    }));
  },
  updateGroupsText(coverId, titleText, subtitleText) {
    set(({ groups }) => ({
      groups: groups.map((group) =>
        coverId === group.id
          ? {
              ...group,
              title: {
                ...group.title,
                text: titleText,
              },
              subtitle: {
                ...group.subtitle,
                text: subtitleText,
              },
            }
          : group,
      ),
    }));
  },
  addGroups(filteredResults) {
    set(({ groups }) => ({
      groups: [...groups, ...filteredResults],
    }));
  },
});
