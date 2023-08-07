import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  Dispatch,
  SetStateAction,
  useCallback,
} from 'react';

import { Point, LocalStorageKeys, LocalStorageData } from 'types';
import {
  useConfigs,
  UseConfigsParams,
  useCover,
  UseCoverParams,
  useLines,
  UseLinesParams,
} from '.';

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
}

const CoverContext = createContext<CoverContextData>({} as CoverContextData);

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
