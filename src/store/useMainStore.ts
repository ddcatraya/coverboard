import {
  ToolbarConfigParams,
  Lines,
  Covers,
  LocalStorageData,
  schema,
  DEFAULT_KEY,
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

const MAX_UNDO = 10;

interface Actions {
  configs: ToolbarConfigParams;
  lines: Lines[];
  covers: Covers[];
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
  coverSizeWidthScaled: (coverId: string) => number;
  coverSizeHeightScaled: (coverId: string) => number;
  removeCoverAndRelatedLines: (id: string) => void;
}

type MainStoreUnion = UseCoverParams &
  UseLinesParams &
  UseConfigsParams &
  CoverContextData;

const defaultValues = () => ({
  configs: initialConfigValues(),
  lines: [],
  covers: [],
});

export const useMainStore = createWithEqualityFn<MainStoreUnion>()(
  (set, get, api) => {
    const saveLastAction = () => {
      const { configs, lines, covers } = get();

      set(({ actions }) => ({
        actions:
          actions.length < MAX_UNDO
            ? [
                ...actions,
                {
                  configs,
                  lines,
                  covers,
                },
              ]
            : [
                ...actions.slice(actions.length - (MAX_UNDO - 1)),
                {
                  configs,
                  lines,
                  covers,
                },
              ],
      }));
    };

    const saveLocalStorage = () => {
      const { configs, lines, covers } = get();
      window.localStorage.setItem(
        addPrefix(get().saveId),
        JSON.stringify({ configs, lines, covers }),
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
      coverSizeWidthScaled(coverId: string) {
        return get().coverSizeWidth() * get().getScale(coverId).scaleX;
      },
      coverSizeHeightScaled(coverId: string) {
        return get().coverSizeHeight() * get().getScale(coverId).scaleY;
      },
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
      updateStoreValues({ configs, lines, covers }) {
        storageSet({ configs, lines, covers });
      },
      resetStoreValues() {
        storageSet(defaultValues());
      },
      getStoreValues() {
        const { configs, lines, covers } = get();

        return { configs, lines, covers };
      },
      undoAction() {
        const copyArray = [...get().actions];
        const another = copyArray.pop();

        if (another) {
          set({
            configs: another.configs,
            lines: another.lines,
            covers: another.covers,
            actions: copyArray,
          });
          window.localStorage.setItem(
            addPrefix(get().saveId),
            JSON.stringify({
              configs: another.configs,
              lines: another.lines,
              covers: another.covers,
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
      removeCoverAndRelatedLines(id: string) {
        saveLastAction();
        get().removeCover(id);
        get().removeLinesWithCover(id);
        saveLocalStorage();
      },
    };
  },
  Object.is,
);
