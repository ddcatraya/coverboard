import { apiConfig } from 'api';
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
import { shallow } from 'zustand/shallow';
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
  apiKey: {
    LastFMKey: string;
  };
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

const defaultValues = () => ({
  configs: initialConfigValues(),
  lines: [],
  covers: [],
});

export const useMainStore = createWithEqualityFn<MainStoreUnion>()(
  (set, get, api) => ({
    actions: [],
    saveId: DEFAULT_KEY,
    ...createConfigsSlice(
      (value) => {
        updateAction(set, get);
        const save = set(value);

        const { configs, lines, covers } = get();
        window.localStorage.setItem(
          addPrefix(get().saveId),
          JSON.stringify({ configs, lines, covers }),
        );

        return save;
      },
      get,
      api,
    ),
    ...createLinesSlice(
      (value) => {
        updateAction(set, get);
        const save = set(value);

        const { configs, lines, covers } = get();
        window.localStorage.setItem(
          addPrefix(get().saveId),
          JSON.stringify({ configs, lines, covers }),
        );

        return save;
      },
      get,
      api,
    ),
    ...createCoversSlice(
      (value) => {
        updateAction(set, get);
        const save = set(value);

        const { configs, lines, covers } = get();
        window.localStorage.setItem(
          addPrefix(get().saveId),
          JSON.stringify({ configs, lines, covers }),
        );

        return save;
      },
      get,
      api,
    ),
    apiKey: {
      LastFMKey: apiConfig.LastFMKey,
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
        window.localStorage.setItem(
          addPrefix(get().saveId),
          JSON.stringify(defaultValues()),
        );
      } catch (error) {
        console.error(error);

        set({
          configs: initialConfigValues(),
          lines: [],
          covers: [],
        });
        window.localStorage.setItem(
          addPrefix(get().saveId),
          JSON.stringify(defaultValues()),
        );
      }
    },
    updateStoreValues({ configs, lines, covers }) {
      updateAction(set, get);
      set({
        configs,
        lines,
        covers,
      });
      window.localStorage.setItem(
        addPrefix(get().saveId),
        JSON.stringify({ configs, lines, covers }),
      );
    },
    resetStoreValues() {
      updateAction(set, get);
      set(defaultValues());
      window.localStorage.setItem(
        addPrefix(get().saveId),
        JSON.stringify(defaultValues()),
      );
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
          (covers.y > dragLimits().height && dragLimits().height > configs.size)
        ) {
          return covers;
        }

        return [];
      });
    },
  }),
  shallow,
);
