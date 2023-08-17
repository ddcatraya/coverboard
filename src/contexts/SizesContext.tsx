import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from 'react';

import { DragLimits, ToolConfigIDs } from 'types';
import { useCoverContext } from './CoverContext/CoverContext';

interface SizeContextData {
  dragLimits: DragLimits;
  toolBarLimits: DragLimits;
  coverSize: number;
  getCurrentY: (index: number) => number;
  toobarIconSize: number;
  fontSize: number;
  windowSize: { width: number; height: number };
  circleRadius: number;
}

const SizesContext = createContext<SizeContextData>({} as SizeContextData);

export const useSizesContext = () => {
  const context = useContext(SizesContext);
  if (!context) {
    throw new Error('useSizesContext must be used within a SizesProvider');
  }
  return context;
};

export const SizesProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { configs } = useCoverContext();
  const coverSize = configs.size;
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const toobarIconSize = coverSize / 2;
  const spaceBetween = coverSize / 4;
  const fontSize = coverSize / 7;
  const circleRadius = fontSize / 1.5;

  const getCurrentY = useCallback(
    (index: number) => 0 + index * (toobarIconSize + spaceBetween),
    [spaceBetween, toobarIconSize],
  );

  const dragLimits = {
    x: 3 * toobarIconSize,
    y: toobarIconSize / 2,
    width: windowSize.width - 3 * toobarIconSize - toobarIconSize / 2,
    height: windowSize.height - toobarIconSize,
  };

  const toolBarLimits = {
    x: toobarIconSize / 2,
    y: toobarIconSize / 2,
    width: toobarIconSize * 2,
    height:
      getCurrentY(Object.keys(ToolConfigIDs).length - 1) + 2 * toobarIconSize,
  };

  return (
    <SizesContext.Provider
      value={{
        dragLimits,
        toolBarLimits,
        coverSize,
        getCurrentY,
        toobarIconSize,
        fontSize,
        windowSize,
        circleRadius,
      }}>
      {children}
    </SizesContext.Provider>
  );
};
