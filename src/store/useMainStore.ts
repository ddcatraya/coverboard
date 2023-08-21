import {
  ToolbarConfigParams,
  Lines,
  Covers,
  LocalStorageData,
  schema,
  DEFAULT_KEY,
} from 'types';
import { addPrefix } from 'utils';
import { create } from 'zustand';
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
  updateAction: (values: LocalStorageData) => void;
  undoAction: () => void;
  setDefaultLocalStoreValues: (saveId: string) => void;
  updateLocalStoreValues: (saveId: string) => void;
  updateStoreValues: (items: LocalStorageData) => void;
  resetStoreValues: () => void;
  getStoreValues: () => LocalStorageData;
}

export const useMainStore = create<
  UseCoverParams & UseLinesParams & UseConfigsParams & CoverContextData
>()((set, get, api) => ({
  actions: [],
  saveId: DEFAULT_KEY,
  ...createConfigsSlice(
    (value: any) => {
      const { lines, covers } = get();

      window.localStorage.setItem(
        addPrefix(get().saveId),
        JSON.stringify({ configs: value.configs, lines, covers }),
      );

      set(({ actions }) => ({
        actions: [...actions, { configs: value.configs, lines, covers }],
      }));

      return set(value);
    },
    get,
    api,
  ),
  ...createLinesSlice(
    (value: any) => {
      const { configs, covers } = get();

      window.localStorage.setItem(
        addPrefix(get().saveId),
        JSON.stringify({ configs, lines: value.lines, covers }),
      );

      set(({ actions }) => ({
        actions: [...actions, { configs, lines: value.lines, covers }],
      }));

      return set(value);
    },
    get,
    api,
  ),
  ...createCoversSlice(
    (value: any) => {
      const { configs, lines } = get();

      window.localStorage.setItem(
        addPrefix(get().saveId),
        JSON.stringify({ configs, lines, covers: value.covers }),
      );

      set(({ actions }) => ({
        actions: [...actions, { configs, lines, covers: value.covers }],
      }));

      return set(value);
    },
    get,
    api,
  ),
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

      set({
        configs: initialConfigValues(),
        lines: [],
        covers: [],
      });
    } catch (error) {
      console.error(error);

      set({
        configs: initialConfigValues(),
        lines: [],
        covers: [],
      });
    }
  },
  updateLocalStoreValues(saveId: string) {
    const { configs, lines, covers } = get();

    window.localStorage.setItem(
      addPrefix(saveId),
      JSON.stringify({ configs, lines, covers }),
    );
  },
  updateStoreValues({ configs, lines, covers }) {
    set({
      configs,
      lines,
      covers,
    });
  },
  getStoreValues() {
    const { configs, lines, covers } = get();

    return { configs, lines, covers };
  },
  resetStoreValues() {
    set({
      configs: initialConfigValues(),
      lines: [],
      covers: [],
    });
  },
  updateAction({ configs, lines, covers }) {
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
    }
  },
}));
