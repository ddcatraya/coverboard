import { useToastContext } from 'contexts/ToastContext';
import React, {
  createContext,
  useState,
  useContext,
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
} from 'react';
import { useParams } from 'react-router-dom';

import {
  Point,
  LocalStorageData,
  Covers,
  Lines,
  ToolbarConfigParams,
  ToolConfigIDs,
  LocalStorageKeys,
  DEFAULT_KEY,
  schema,
} from 'types';
import { addPrefix, getHash } from 'utils';

import {
  useConfigs,
  UseConfigsParams,
  useCover,
  UseCoverParams,
  useLines,
  UseLinesParams,
} from '.';
import { initialConfigValues } from './useConfigs';

interface Actions {
  configs: ToolbarConfigParams;
  lines: Lines[];
  covers: Covers[];
}

interface CoverContextData
  extends Omit<UseCoverParams, 'setCover'>,
    UseLinesParams,
    UseConfigsParams {
  erase: boolean;
  setErase: Dispatch<SetStateAction<boolean>>;
  points: Point | null;
  setPoints: Dispatch<SetStateAction<Point | null>>;
  editLines: boolean;
  setEditLines: Dispatch<SetStateAction<boolean>>;
  resetConfigs: () => void;
  resetTitle: () => void;
  instance: LocalStorageData;
  setInstance: React.Dispatch<React.SetStateAction<LocalStorageData>>;
  undo: () => void;
  action: Array<Actions>;
  covers: Covers[];
  lines: Lines[];
  configs: ToolbarConfigParams;
  saveId: string;
  resetInstance: () => void;
  setCover: (currentCover: (curr: Covers[]) => Covers[]) => void;
  setLines: (currentLines: (curr: Lines[]) => Lines[]) => void;
  setConfigs: (
    currentConfig: (curr: ToolbarConfigParams) => ToolbarConfigParams,
  ) => void;
}

const CoverContext = createContext<CoverContextData>({} as CoverContextData);
const MAX_UNDO = 10;

const initial = () => {
  return {
    [LocalStorageKeys.CONFIG]: initialConfigValues(),
    [LocalStorageKeys.COVER]: [],
    [LocalStorageKeys.LINES]: [],
  };
};

export const useCoverContext = () => {
  const context = useContext(CoverContext);
  if (!context) {
    throw new Error('useCoverContext must be used within a CoverProvider');
  }

  if (!context.configs) {
    return { ...context, ...initial(), action: [] };
  }

  return context;
};

interface CoverProviderProps {
  children: React.ReactNode;
}

export const CoverProvider: React.FC<CoverProviderProps> = ({ children }) => {
  const { saveId = DEFAULT_KEY } = useParams();
  const hash = getHash();
  const [instance, setInstance] = useState<LocalStorageData>(initial());
  const { showErrorMessage, showWarningMessage } = useToastContext();

  const [erase, setErase] = useState(hash === ToolConfigIDs.ERASE);
  const [editLines, setEditLines] = useState(hash === ToolConfigIDs.ARROW);
  const [points, setPoints] = useState<Point | null>(null);
  const [action, setAction] = useState<Array<Actions>>([]);

  const { configs, lines, covers } = instance;

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(addPrefix(saveId));

      if (item) {
        const parsedItem: LocalStorageData = JSON.parse(item);
        const parsedSchema = schema(parsedItem).parse(parsedItem);
        if (parsedSchema) {
          setInstance(parsedSchema);
          return;
        }
      }
      showWarningMessage(
        'Changes are lost when browser cache is cleaned. Save the json in share options for backup.',
      );
      setInstance(initial());
    } catch (error) {
      console.error(error);
      showErrorMessage(
        'Failed to load albums due to existing save, default applied',
      );
      setInstance(initial());
    }
  }, [saveId, showErrorMessage, showWarningMessage]);

  useEffect(() => {
    window.localStorage.setItem(addPrefix(saveId), JSON.stringify(instance));
  }, [instance, saveId]);

  const updateAction = useCallback(() => {
    setAction((currentAction) =>
      currentAction.length < MAX_UNDO
        ? [...currentAction, { configs, lines, covers }]
        : [
            ...currentAction.slice(currentAction.length - (MAX_UNDO - 1)),
            { configs, lines, covers },
          ],
    );
  }, [configs, lines, covers]);

  const setConfigs = useCallback(
    (currentConfigs: (curr: ToolbarConfigParams) => ToolbarConfigParams) => {
      setInstance((currentInstance) => ({
        ...currentInstance,
        configs: currentConfigs(currentInstance.configs),
      }));
      updateAction();
    },
    [setInstance, updateAction],
  );

  const setLines = useCallback(
    (currentLines: (curr: Lines[]) => Lines[]) => {
      setInstance((currentInstance) => ({
        ...currentInstance,
        lines: currentLines(currentInstance.lines),
      }));
      updateAction();
    },
    [setInstance, updateAction],
  );

  const setCover = useCallback(
    (currentCover: (curr: Covers[]) => Covers[]) => {
      setInstance((currentInstance) => ({
        ...currentInstance,
        covers: currentCover(currentInstance.covers),
      }));
      updateAction();
    },
    [setInstance, updateAction],
  );

  const undo = useCallback(() => {
    const copyArray = [...action];
    const another = copyArray.pop();

    if (another) {
      setConfigs(() => another.configs);
      setLines(() => another.lines);
      setCover(() => another.covers);
      setAction(copyArray);
    }
  }, [action, setConfigs, setCover, setLines]);

  const resetInstance = () => setInstance(initial());

  return (
    <CoverContext.Provider
      value={{
        covers,
        setCover,
        erase,
        setErase,
        points,
        setPoints,
        editLines,
        setEditLines,
        lines,
        setLines,
        configs,
        setConfigs,
        instance,
        setInstance,
        resetInstance,
        undo,
        action,
        saveId,
        ...useCover(setCover, setLines),
        ...useLines(setLines),
        ...useConfigs(setConfigs),
      }}>
      {children}
    </CoverContext.Provider>
  );
};
