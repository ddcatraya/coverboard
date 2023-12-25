import { Vector2d } from 'konva/lib/types';
import { GroupCovers, PosTypes } from 'types';
import { StateCreator } from 'zustand';

export interface UseGrouspParams {
  groups: Array<GroupCovers>;
  updateGroupDir: (coverId: string, dir: PosTypes) => void;
  updateAllGroupsDir: (dir: PosTypes) => void;
  resetAllGroups: () => void;
  resetGroupLabel: (coverId: string) => void;
  updateGroupLabel: (coverId: string, label: string) => void;
  removeGroup: (coverId: string) => void;
  updateGroupsText: (coverId: string, titleText: string) => void;
  addGroups: (filteredResults: Array<GroupCovers>) => void;
  updateGroupPositionRelative: (coverId: string, { x, y }: Vector2d) => void;
  getDirById: (id: string) => GroupCovers['dir'];
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
  getDirById: (id: string) =>
    get().groups.find((star) => star.id === id)?.dir ?? PosTypes.BOTTOM,
  updateAllGroupsDir(dir) {
    set(({ groups }) => ({
      groups: groups.map((star) => ({
        ...star,
        dir,
      })),
    }));
  },
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
  resetAllGroups() {
    set(({ groups }) => ({
      groups: groups.map((star) => ({
        ...star,
        title: '',
        dir: PosTypes.BOTTOM,
        x: 0,
        y: 0,
      })),
    }));
  },
  resetGroupLabel(coverId) {
    set(({ groups }) => ({
      groups: groups.map((star) =>
        star.id === coverId
          ? {
              ...star,
              title: '',
              dir: PosTypes.BOTTOM,
            }
          : star,
      ),
    }));
  },
  updateGroupLabel(coverId, title) {
    set(({ groups }) => ({
      groups: groups.map((star) => {
        return coverId === star.id
          ? {
              ...star,
              title,
            }
          : star;
      }),
    }));
  },
  removeGroup(coverId) {
    set(({ groups }) => ({
      groups: groups.filter((c) => c.id !== coverId),
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
  updateGroupPositionRelative(groupId, { x, y }) {
    set(({ groups }) => ({
      groups: groups.map((star) => {
        return groupId === star.id
          ? { ...star, x: star.x - x, y: star.y - y }
          : star;
      }),
    }));
  },
});
