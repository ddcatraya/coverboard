import { Vector2d } from 'konva/lib/types';
import { GroupCovers, PosTypes } from 'types';
import { StateCreator } from 'zustand';

type Scale = { scaleX: number; scaleY: number };
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
  updateGroupPosition: (coverId: string, { x, y }: Vector2d) => void;
  updateGroupScale: (coverId: string, scale: Scale) => void;
  updateAllGroupPosition: (arrayPos: Array<Vector2d>) => void;
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
  updateGroupScale(coverId, scale) {
    set(({ groups }) => ({
      groups: groups.map((star) => {
        return coverId === star.id
          ? {
              ...star,
              scaleX: scale.scaleX,
              scaleY: scale.scaleY,
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
  updateGroupPosition(coverId, { x, y }) {
    set(({ groups }) => ({
      groups: groups.map((star) => {
        return coverId === star.id ? { ...star, x, y } : star;
      }),
    }));
  },
  updateAllGroupPosition(posArray) {
    set(({ groups }) => ({
      groups: groups.map((star, index) => {
        return { ...star, x: posArray[index].x, y: posArray[index].y };
      }),
    }));
  },
});
