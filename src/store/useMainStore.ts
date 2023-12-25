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
            if (parsedSchema) {
              set({
                configs: parsedSchema.configs,
                lines: parsedSchema.lines,
                covers: parsedSchema.covers,
                groups: parsedSchema.groups,
              });
              return;
            }
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

          const colGroup = get().covers.find(
            (cover) =>
              cover.x > x &&
              cover.x < x + get().coverSizeWidth() * group.scaleX &&
              cover.y > y &&
              cover.y < y + get().coverSizeHeight() * group.scaleY,
          );

          if (colGroup) {
            get().removeLinesWithCoverTogether(groupId, colGroup.id);
          }

          const coversDetect = get().covers.filter(
            (cover) =>
              cover.x > prev.x &&
              cover.x < prev.x + get().coverSizeWidth() * group.scaleX &&
              cover.y > prev.y &&
              cover.y < prev.y + get().coverSizeHeight() * group.scaleY,
          );

          if (coversDetect.length > 0) {
            coversDetect.forEach((cover) => {
              set(({ covers }) => ({
                covers: covers.map((currentCover) => {
                  return cover.id === currentCover.id
                    ? {
                        ...currentCover,
                        x: currentCover.x - (prev.x - x),
                        y: currentCover.y - (prev.y - y),
                      }
                    : currentCover;
                }),
              }));
            });
          }
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
              cover.x < newPos.x + get().coverSizeWidth() * scale.scaleX &&
              cover.y > newPos.y &&
              cover.y < newPos.y + get().coverSizeHeight() * scale.scaleY,
          );

          if (colGroup) {
            get().removeLinesWithCoverTogether(groupId, colGroup.id);
          }
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
              x < group.x + get().coverSizeWidth() * group.scaleX &&
              y > group.y &&
              y < group.y + get().coverSizeHeight() * group.scaleY,
          );

          if (colGroup) {
            get().removeLinesWithCoverTogether(coverId, colGroup.id);
          }
        }
        saveLocalStorage();
      },
    };
  },
  Object.is,
);
