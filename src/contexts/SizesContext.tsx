import React, { createContext, useState, useContext, useEffect } from 'react';
import { DragLimits } from 'types';

interface SizeContextData {
  dragLimits: DragLimits;
  toolBarLimits: DragLimits;
  coverSize: number;
  initialX: number;
  getCurrentX: (index: number) => number;
  toobarIconSize: number;
  fontSize: number;
  windowSize: { width: number; height: number };
  setCoverSize: React.Dispatch<React.SetStateAction<number>>;
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
  const [coverSize, setCoverSize] = useState(100);
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

  const getCurrentX = (index: number) =>
    initialY + index * (toobarIconSize + spaceBetween);

  const dragLimits = {
    x: initialX + 2 * toobarIconSize,
    y: initialY - toobarIconSize / 2,
    width: windowSize.width - initialX - 3 * toobarIconSize,
    height: windowSize.height - initialY - toobarIconSize / 2,
  };

  const toolBarLimits = {
    x: initialX - toobarIconSize / 2,
    y: initialY - toobarIconSize / 2,
    width: toobarIconSize * 2,
    height: getCurrentX(5) + toobarIconSize,
  };

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
        setCoverSize,
      }}>
      {children}
    </SizesContext.Provider>
  );
};
