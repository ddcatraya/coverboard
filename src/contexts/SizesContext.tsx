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
  initialX: number;
  initialY: number;
  getCurrentX: (index: number) => number;
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

  const initialX = coverSize / 2;
  const initialY = coverSize / 2;
  const toobarIconSize = coverSize / 2;
  const spaceBetween = coverSize / 4;
  const fontSize = coverSize / 7;

  const getCurrentX = useCallback(
    (index: number) => initialY + index * (toobarIconSize + spaceBetween),
    [initialY, spaceBetween, toobarIconSize],
  );

  const dragLimits = {
    x: initialX + 2 * toobarIconSize,
    y: initialY - toobarIconSize / 2,
    width: windowSize.width - 1.5 * initialX - 2 * toobarIconSize,
    height: windowSize.height - initialY,
  };

  const toolBarLimits = {
    x: initialX - toobarIconSize / 2,
    y: initialY - toobarIconSize / 2,
    width: toobarIconSize * 2,
    height: getCurrentX(Object.keys(ToolConfigIDs).length - 1) + toobarIconSize,
  };

  const circleRadius = fontSize / 1.5;

  return (
    <SizesContext.Provider
      value={{
        dragLimits,
        toolBarLimits,
        coverSize,
        initialX,
        getCurrentX,
        toobarIconSize,
        fontSize,
        windowSize,
        initialY,
        circleRadius,
      }}>
      {children}
    </SizesContext.Provider>
  );
};
