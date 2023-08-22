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
  undoAction: () => void;
  setDefaultLocalStoreValues: (saveId: string) => void;
  updateStoreValues: (items: LocalStorageData) => void;
  resetStoreValues: () => void;
  getStoreValues: () => LocalStorageData;
}

type MainStoreUnion = UseCoverParams &
  UseLinesParams &
  UseConfigsParams &
  CoverContextData;

type Setter = (value: MainStoreUnion) => Partial<MainStoreUnion>;

const updateAction = (
  set: (value: Setter) => void,
  get: () => MainStoreUnion,
) => {
  const { configs, lines, covers } = get();

  window.localStorage.setItem(
    addPrefix(get().saveId),
    JSON.stringify({ configs, lines, covers }),
  );

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

export const useMainStore = create<MainStoreUnion>()((set, get, api) => ({
  actions: [],
  saveId: DEFAULT_KEY,
  ...createConfigsSlice(
    (value) => {
      const save = set(value);

      updateAction(set, get);

      return save;
    },
    get,
    api,
  ),
  ...createLinesSlice(
    (value) => {
      const save = set(value);

      updateAction(set, get);

      return save;
    },
    get,
    api,
  ),
  ...createCoversSlice(
    (value) => {
      const save = set(value);

      updateAction(set, get);

      return save;
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
