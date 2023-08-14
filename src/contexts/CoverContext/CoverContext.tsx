import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  Dispatch,
  SetStateAction,
  useCallback,
} from 'react';

import {
  Point,
  LocalStorageKeys,
  LocalStorageData,
  CoverImage,
  LinePoint,
  ToolbarConfigParams,
} from 'types';
import {
  useConfigs,
  UseConfigsParams,
  useCover,
  UseCoverParams,
  useLines,
  UseLinesParams,
} from '.';

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
  getLocalStorage: () => LocalStorageData;
  setLocalStorage: (data: LocalStorageData) => void;
  undo: () => void;
  action: Array<Actions>;
}

const CoverContext = createContext<CoverContextData>({} as CoverContextData);
const MAX_UNDO = 10;

export const useCoverContext = () => {
  const context = useContext(CoverContext);
  if (!context) {
    throw new Error('useCoverContext must be used within a CoverProvider');
  }
  return context;
};

export const CoverProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { configs, setConfigs, ...restConfigs } = useConfigs();
  const { lines, setLines, ...restLines } = useLines();
  const { cover, setCover, ...restCover } = useCover();
  const [erase, setErase] = useState(false);
  const [editLines, setEditLines] = useState(false);
  const [points, setPoints] = useState<Point | null>(null);
  const [action, setAction] = useState<Array<Actions>>([]);

  useEffect(() => {
    setPoints(null);
  }, [cover]);

  useEffect(() => {
    if (erase) {
      setEditLines(false);
    }
  }, [erase]);

  useEffect(() => {
    if (editLines) {
      setErase(false);
    }
  }, [editLines]);

  useEffect(() => {
    if (action.length === 0) {
      setAction((currentAction) => [
        ...currentAction,
        { configs, lines, cover },
      ]);
      return;
    }
    if (
      JSON.stringify(configs) !==
        JSON.stringify(action[action.length - 1].configs) ||
      JSON.stringify(lines) !==
        JSON.stringify(action[action.length - 1].lines) ||
      JSON.stringify(cover) !== JSON.stringify(action[action.length - 1].cover)
    ) {
      setAction((currentAction) =>
        currentAction.length < MAX_UNDO
          ? [...currentAction, { configs, lines, cover }]
          : [
              ...currentAction.slice(currentAction.length - (MAX_UNDO - 1)),
              { configs, lines, cover },
            ],
      );
    }
  }, [action, configs, cover, lines]);

  const undo = () => {
    const copyArray = [...action];
    copyArray.pop();
    const another = copyArray.pop();

    if (another) {
      setConfigs(another.configs);
      setLines(another.lines);
      setCover(another.cover);
      setAction(copyArray);
    }
  };

  const getLocalStorage = useCallback<() => LocalStorageData>(
    () => ({
      [LocalStorageKeys.CONFIG]: configs,
      [LocalStorageKeys.COVER]: cover,
      [LocalStorageKeys.LINES]: lines,
    }),
    [configs, cover, lines],
  );

  const setLocalStorage = useCallback<(data: LocalStorageData) => void>(
    (data) => {
      if (
        data[LocalStorageKeys.COVER] &&
        data[LocalStorageKeys.LINES] &&
        data[LocalStorageKeys.CONFIG]
      ) {
        setCover(data[LocalStorageKeys.COVER]);
        setLines(data[LocalStorageKeys.LINES]);
        setConfigs(data[LocalStorageKeys.CONFIG]);
      }
    },
    [setConfigs, setCover, setLines],
  );

  return (
    <CoverContext.Provider
      value={{
        cover,
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
        getLocalStorage,
        setLocalStorage,
        undo,
        action,
        ...restCover,
        ...restLines,
        ...restConfigs,
      }}>
      {children}
    </CoverContext.Provider>
  );
};

/* useEffect(() => {
    try {
      const search = window.location.search;
      const params = new URLSearchParams(search);
      const share = params.get('share');

      if (share) {
        const decoded = window.atob(share);
        const parsed = JSON.parse(decoded);

        if (parsed.cover) {
          setCover(
            parsed.cover.map((star: CoverImage) => ({
              ...star,
              isDragging: false,
            })),
          );
        }
        if (parsed.lines) {
          setLines(parsed.lines);
        }
        if (parsed.coverSize) {
          setCoverSize(parsed.coverSize);
        }

        params.delete('share');
        window.history.replaceState(
          {},
          '',
          `${window.location.pathname}?${params.toString()}`,
        );
      }
    } catch (err) {
      showErrorMessage('Invalid share URL given');

      const search = window.location.search;
      const params = new URLSearchParams(search);
      const share = params.get('share');

      if (share) {
        params.delete('share');
        window.history.replaceState(
          {},
          '',
          `${window.location.pathname}?${params.toString()}`,
        );
      }
    }
  }, [setCover, setCoverSize, setLines, showErrorMessage]); */
