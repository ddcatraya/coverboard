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
  CoverImage,
  LinePoint,
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
  lines: LinePoint[];
  cover: CoverImage[];
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
  cover: CoverImage[];
  lines: LinePoint[];
  configs: ToolbarConfigParams;
  saveId: string;
  setCover: (currentCover: (curr: CoverImage[]) => CoverImage[]) => void;
  setLines: (currentLines: (curr: LinePoint[]) => LinePoint[]) => void;
  setConfigs: (
    currentConfig: (curr: ToolbarConfigParams) => ToolbarConfigParams,
  ) => void;
}

const CoverContext = createContext<CoverContextData>({} as CoverContextData);
const MAX_UNDO = 10;

const initial = () => {
  return {
    [LocalStorageKeys.CONFIG]: { ...initialConfigValues },
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

  const { configs, lines, cover } = instance;

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(addPrefix(saveId));

      if (item) {
        const parsedItem: LocalStorageData = JSON.parse(item);
        const parsedSchema = schema(parsedItem.cover, parsedItem.lines).parse(
          parsedItem,
        );
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
        ? [...currentAction, { configs, lines, cover }]
        : [
            ...currentAction.slice(currentAction.length - (MAX_UNDO - 1)),
            { configs, lines, cover },
          ],
    );
  }, [configs, lines, cover]);

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
    (currentLines: (curr: LinePoint[]) => LinePoint[]) => {
      setInstance((currentInstance) => ({
        ...currentInstance,
        lines: currentLines(currentInstance.lines),
      }));
      updateAction();
    },
    [setInstance, updateAction],
  );

  const setCover = useCallback(
    (currentCover: (curr: CoverImage[]) => CoverImage[]) => {
      setInstance((currentInstance) => ({
        ...currentInstance,
        cover: currentCover(currentInstance.cover),
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
      setCover(() => another.cover);
      setAction(copyArray);
    }
  }, [action, setConfigs, setCover, setLines]);

  return (
    <CoverContext.Provider
      value={{
        cover,
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
