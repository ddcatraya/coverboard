import {
  ToolbarConfigParams,
  Lines,
  Covers,
  LocalStorageData,
  schema,
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
  updateAction: () => void;
  undoAction: () => void;
  setDefaultValues: (saveId: string) => void;
  updateValues: (saveId: string) => void;
}

export const useMainStore = create<
  UseCoverParams & UseLinesParams & UseConfigsParams & CoverContextData
>()((set, get, api) => ({
  actions: [],
  ...createConfigsSlice(set, get, api),
  ...createLinesSlice(set, get, api),
  ...createCoversSlice(set, get, api),
  setDefaultValues(saveId: string) {
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
  updateValues(saveId: string) {
    const { configs, lines, covers } = get();

    window.localStorage.setItem(
      addPrefix(saveId),
      JSON.stringify({ configs, lines, covers }),
    );
  },
  updateAction() {
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
