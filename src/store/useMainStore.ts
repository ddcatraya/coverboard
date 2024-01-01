import {
  ToolbarConfigParams,
  Lines,
  Covers,
  LocalStorageData,
  schema,
  DEFAULT_KEY,
  GroupCovers,
} from 'types';
import { addPrefix } from 'utils';
import { createWithEqualityFn } from 'zustand/traditional';
import {
  UseConfigsParams,
  createConfigsSlice,
  initialConfigValues,
} from './configsStore';
import { UseCoverParams, createCoversSlice } from './coversStore';
import { UseLinesParams, createLinesSlice } from './linesStore';
import { UseGrouspParams, createGroupsSlice } from './groupStore';
import { Vector2d } from 'konva/lib/types';
import { useUtilsStore } from './useUtilsStore';

const MAX_UNDO = 10;

interface Actions {
  configs: ToolbarConfigParams;
  lines: Lines[];
  covers: Covers[];
  groups: GroupCovers[];
}

interface CoverContextData {
  actions: Array<Actions>;
  saveId: string;
  undoAction: () => void;
  setDefaultLocalStoreValues: (saveId: string) => void;
  updateStoreValues: (items: LocalStorageData) => void;
  resetStoreValues: () => void;
  getStoreValues: () => LocalStorageData;
  offLimitCovers: () => Covers[];
  offLimitGroups: () => GroupCovers[];
  removeCoverAndRelatedLines: (id: string) => void;
  removeGroupAndRelatedLines: (id: string) => void;
  updateGroupPosition: (coverId: string, { x, y }: Vector2d) => void;
  updateCoverPosition: (coverId: string, { x, y }: Vector2d) => void;
  updateGroupScale: (
    coverId: string,
    scale: { scaleX: number; scaleY: number },
  ) => void;
  refreshGroups: (groupId: string) => void;
}

type MainStoreUnion = UseCoverParams &
  UseLinesParams &
  UseConfigsParams &
  UseGrouspParams &
  CoverContextData;

const defaultValues = () => ({
  configs: initialConfigValues(),
  lines: [],
  covers: [],
  groups: [],
});

export const useMainStore = createWithEqualityFn<MainStoreUnion>()(
  (set, get, api) => {
    const saveLastAction = () => {
      const { configs, lines, covers, groups } = get();

      set(({ actions }) => ({
        actions:
          actions.length < MAX_UNDO
            ? [
                ...actions,
                {
                  configs,
                  lines,
                  covers,
                  groups,
                },
              ]
            : [
                ...actions.slice(actions.length - (MAX_UNDO - 1)),
                {
                  configs,
                  lines,
                  covers,
                  groups,
                },
              ],
      }));
    };

    const saveLocalStorage = () => {
      const { configs, lines, covers, groups } = get();
      window.localStorage.setItem(
        addPrefix(get().saveId),
        JSON.stringify({ configs, lines, covers, groups }),
      );
    };

    const storageSet = (
      value:
        | Partial<MainStoreUnion>
        | ((value: MainStoreUnion) => Partial<MainStoreUnion>),
    ) => {
      saveLastAction();
      const save = set(value);
      saveLocalStorage();

      return save;
    };

    return {
      actions: [],
      saveId: DEFAULT_KEY,
      ...createConfigsSlice((value) => storageSet(value), get, api),
      ...createLinesSlice((value) => storageSet(value), get, api),
      ...createCoversSlice((value) => storageSet(value), get, api),
      ...createGroupsSlice((value) => storageSet(value), get, api),
      setDefaultLocalStoreValues(saveId: string) {
        set({ saveId });
        try {
          const item = window.localStorage.getItem(addPrefix(saveId));

          if (item) {
            const parsedItem: LocalStorageData = JSON.parse(item);
            const parsedSchema = schema(parsedItem).parse(parsedItem);

            set({
              configs: parsedSchema.configs,
              lines: parsedSchema.lines,
              covers: parsedSchema.covers,
              groups: parsedSchema.groups,
            });
            return;
          }

          set(defaultValues());
          saveLocalStorage();
        } catch (error) {
          console.error(error);

          set({
            configs: initialConfigValues(),
            lines: [],
            covers: [],
          });
          saveLocalStorage();
        }
      },
      updateStoreValues({ configs, lines, covers, groups }) {
        storageSet({ configs, lines, covers, groups });
      },
      resetStoreValues() {
        storageSet(defaultValues());
      },
      getStoreValues() {
        const { configs, lines, covers, groups } = get();

        return { configs, lines, covers, groups };
      },
      undoAction() {
        const copyArray = [...get().actions];
        const another = copyArray.pop();

        if (another) {
          set({
            configs: another.configs,
            lines: another.lines,
            covers: another.covers,
            groups: another.groups,
            actions: copyArray,
          });
          window.localStorage.setItem(
            addPrefix(get().saveId),
            JSON.stringify({
              configs: another.configs,
              lines: another.lines,
              covers: another.covers,
              groups: another.groups,
            }),
          );
        }
      },
      offLimitCovers() {
        const { dragLimits, configs } = get();

        return get().covers.flatMap((covers) => {
          if (
            (covers.x > dragLimits().width &&
              dragLimits().width > configs.size) ||
            (covers.y > dragLimits().height &&
              dragLimits().height > configs.size)
          ) {
            return covers;
          }

          return [];
        });
      },
      offLimitGroups() {
        const { dragLimits, configs } = get();

        return get().groups.flatMap((group) => {
          if (
            (group.x > dragLimits().width &&
              dragLimits().width > configs.size) ||
            (group.y > dragLimits().height &&
              dragLimits().height > configs.size)
          ) {
            return group;
          }

          return [];
        });
      },
      removeCoverAndRelatedLines(coverId) {
        saveLastAction();

        useUtilsStore.getState().setPoints(null);

        set(({ covers }) => ({
          covers: covers.filter((c) => c.id !== coverId),
        }));

        set(({ lines }) => ({
          lines: lines.filter(
            (l) => l.origin.id !== coverId || l.target.id !== coverId,
          ),
        }));

        saveLocalStorage();
      },
      removeGroupAndRelatedLines(groupId: string) {
        saveLastAction();

        useUtilsStore.getState().setPoints(null);

        const group = get().groups.find((group) => group.id === groupId);

        if (group) {
          if (group.x !== 0 || group.y !== 0) {
            const groupsDetected = get().groups.filter(
              (currentGroup) =>
                currentGroup.id !== group.id &&
                currentGroup.x > group.x &&
                currentGroup.x + get().coverSizeWidth() * currentGroup.scaleX <
                  group.x + get().coverSizeWidth() * group.scaleX &&
                currentGroup.y > group.y &&
                currentGroup.y + get().coverSizeHeight() * currentGroup.scaleY <
                  group.y + get().coverSizeHeight() * group.scaleY,
            );

            if (groupsDetected.length > 0) {
              groupsDetected.forEach((grp) =>
                get().removeGroupAndRelatedLines(grp.id),
              );
            }

            const coversDetect = get().covers.filter(
              (cover) =>
                cover.x > group.x &&
                cover.x + get().coverSizeWidth() <
                  group.x + get().coverSizeWidth() * group.scaleX &&
                cover.y > group.y &&
                cover.y + get().coverSizeHeight() <
                  group.y + get().coverSizeHeight() * group.scaleY,
            );

            if (coversDetect.length > 0) {
              coversDetect.forEach((cover) => {
                get().removeCoverAndRelatedLines(cover.id);
              });
            }
          }
        }

        set(({ groups }) => ({
          groups: groups.filter((c) => c.id !== groupId),
        }));

        set(({ lines }) => ({
          lines: lines.filter(
            (l) => l.origin.id !== groupId || l.target.id !== groupId,
          ),
        }));

        saveLocalStorage();
      },
      updateGroupPosition(groupId, { x, y }) {
        saveLastAction();
        const group = get().groups.find((group) => group.id === groupId);

        if (group) {
          const prev = {
            x: group.x,
            y: group.y,
          };

          const filteredGroups = get().groups.filter(
            (cov) => cov.id !== groupId,
          );
          filteredGroups.push({ ...group, x, y });

          set({ groups: filteredGroups });

          if (group.x !== 0 || group.y !== 0) {
            const colGroup = get().covers.find(
              (cover) =>
                cover.x > x &&
                cover.x + get().coverSizeWidth() <
                  x + get().coverSizeWidth() * group.scaleX &&
                cover.y > y &&
                cover.y + get().coverSizeHeight() <
                  y + get().coverSizeHeight() * group.scaleY,
            );

            if (colGroup) {
              get().removeLinesWithCoverTogether(groupId, colGroup.id);
            }

            const groupsDetected = get().groups.filter(
              (currentGroup) =>
                currentGroup.id !== group.id &&
                currentGroup.x > prev.x &&
                currentGroup.x + get().coverSizeWidth() * currentGroup.scaleX <
                  prev.x + get().coverSizeWidth() * group.scaleX &&
                currentGroup.y > prev.y &&
                currentGroup.y + get().coverSizeHeight() * currentGroup.scaleY <
                  prev.y + get().coverSizeHeight() * group.scaleY,
            );

            if (groupsDetected.length > 0) {
              groupsDetected.forEach((currentGroup) => {
                set(({ groups }) => {
                  const newGroup = groups.filter(
                    (grp) => grp.id !== currentGroup.id,
                  );
                  newGroup.push({
                    ...currentGroup,
                    x: currentGroup.x - (prev.x - x),
                    y: currentGroup.y - (prev.y - y),
                  });

                  return {
                    groups: newGroup,
                  };
                });
              });
            }

            const coversDetect = get().covers.filter(
              (cover) =>
                cover.x > prev.x &&
                cover.x + get().coverSizeWidth() <
                  prev.x + get().coverSizeWidth() * group.scaleX &&
                cover.y > prev.y &&
                cover.y + get().coverSizeWidth() <
                  prev.y + get().coverSizeHeight() * group.scaleY,
            );

            if (coversDetect.length > 0) {
              coversDetect.forEach((cover) => {
                get().updateCoverPosition(cover.id, {
                  x: cover.x - (prev.x - x),
                  y: cover.y - (prev.y - y),
                });
              });
            }
          }

          get().refreshGroups(group.id);
        }
        saveLocalStorage();
      },
      updateGroupScale(groupId, scale) {
        saveLastAction();

        const group = get().groups.find((group) => group.id === groupId);

        if (group) {
          const newPos = {
            x:
              group.x -
              (get().coverSizeWidth() * scale.scaleX -
                get().coverSizeWidth() * group.scaleX) /
                2,
            y:
              group.y -
              (get().coverSizeHeight() * scale.scaleY -
                get().coverSizeHeight() * group.scaleY) /
                2,
          };

          const filteredGroups = get().groups.filter(
            (cov) => cov.id !== groupId,
          );
          filteredGroups.push({
            ...group,
            scaleX: scale.scaleX,
            scaleY: scale.scaleY,
            x: newPos.x,
            y: newPos.y,
          });

          set({ groups: filteredGroups });

          const colGroup = get().covers.find(
            (cover) =>
              cover.x > newPos.x &&
              cover.x + get().coverSizeWidth() <
                newPos.x + get().coverSizeWidth() * scale.scaleX &&
              cover.y > newPos.y &&
              cover.y + get().coverSizeHeight() <
                newPos.y + get().coverSizeHeight() * scale.scaleY,
          );

          if (colGroup) {
            get().removeLinesWithCoverTogether(groupId, colGroup.id);
          }

          get().refreshGroups(group.id);
        }
        saveLocalStorage();
      },
      updateCoverPosition(coverId, { x, y }) {
        saveLastAction();
        const cover = get().covers.find((cover) => cover.id === coverId);

        if (cover) {
          const filteredCovers = get().covers.filter(
            (cov) => cov.id !== coverId,
          );
          filteredCovers.push({ ...cover, x, y });

          set({ covers: filteredCovers });

          const colGroup = get().groups.find(
            (group) =>
              x > group.x &&
              x + get().coverSizeWidth() <
                group.x + get().coverSizeWidth() * group.scaleX &&
              y > group.y &&
              y + get().coverSizeHeight() <
                group.y + get().coverSizeHeight() * group.scaleY,
          );

          if (colGroup) {
            get().removeLinesWithCoverTogether(coverId, colGroup.id);
          }
        }
        saveLocalStorage();
      },
      refreshGroups(groupId) {
        const foundGroup = get().groups.find((cov) => cov.id === groupId);

        if (foundGroup) {
          const filteredGroups = get().groups.filter(
            (cov) => cov.id !== foundGroup.id,
          );
          filteredGroups.push(foundGroup);

          set({ groups: filteredGroups });

          const groupsDetected = get().groups.filter(
            (currentGroup) =>
              currentGroup.id !== foundGroup.id &&
              currentGroup.x > foundGroup.x &&
              currentGroup.x + get().coverSizeWidth() * currentGroup.scaleX <
                foundGroup.x + get().coverSizeWidth() * foundGroup.scaleX &&
              currentGroup.y > foundGroup.y &&
              currentGroup.y + get().coverSizeHeight() * currentGroup.scaleY <
                foundGroup.y + get().coverSizeHeight() * foundGroup.scaleY,
          );

          if (groupsDetected.length > 0) {
            groupsDetected.forEach((currentGroup) =>
              get().refreshGroups(currentGroup.id),
            );
          }
        }
      },
    };
  },
  Object.is,
);
