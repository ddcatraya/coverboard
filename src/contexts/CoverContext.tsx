import { RenderDir } from 'conva/components/DrawLines';
import React, {
  createContext,
  useState,
  useContext,
  Dispatch,
  SetStateAction,
} from 'react';

export interface CoverImage {
  id: string;
  link: string;
  x: number;
  y: number;
  width: number;
  height: number;
  isDragging: boolean;
  lines: Array<LinePoint>;
  artist: string;
  album: string;
  dir: RenderDir;
}

export enum PosTypes {
  LEFT = 'left',
  RIGHT = 'right',
  TOP = 'top',
  BOTTOM = 'bottom',
}

export interface LinePoint {
  origin: {
    id: string;
    pos: PosTypes;
  };
  target?: {
    id: string;
    pos: PosTypes;
  };
  text?: string;
  dir?: RenderDir;
}

interface CoverContextData {
  cover: Array<CoverImage>;
  setCover: Dispatch<SetStateAction<Array<CoverImage>>>;
  erase: boolean;
  setErase: Dispatch<SetStateAction<boolean>>;
  points: LinePoint | null;
  setPoints: Dispatch<SetStateAction<LinePoint | null>>;
  showTitles: boolean;
  setShowTitles: Dispatch<SetStateAction<boolean>>;
  editLines: boolean;
  setEditLines: Dispatch<SetStateAction<boolean>>;
  showBalls: boolean;
  setBalls: Dispatch<SetStateAction<boolean>>;
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
  const [cover, setCover] = useState<Array<CoverImage>>([]);
  const [erase, setErase] = useState(false);
  const [showTitles, setShowTitles] = useState(true);
  const [editLines, setEditLines] = useState(true);
  const [points, setPoints] = useState<LinePoint | null>(null);
  const [showBalls, setBalls] = useState(true);

  return (
    <CoverContext.Provider
      value={{
        cover,
        setCover,
        erase,
        setErase,
        points,
        setPoints,
        showTitles,
        setShowTitles,
        editLines,
        setEditLines,
        showBalls,
        setBalls,
      }}>
      {children}
    </CoverContext.Provider>
  );
};
