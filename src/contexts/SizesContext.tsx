import { Vector2d } from 'konva/lib/types';
import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
  useMemo,
} from 'react';

import { CoverImage, DragLimits, ToolConfigIDs } from 'types';
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
  moveIntoView: () => void;
  offLimitCovers: Array<CoverImage>;
}

const SizesContext = createContext<SizeContextData>({} as SizeContextData);

export const useSizesContext = () => {
  const context = useContext(SizesContext);
  if (!context) {
    throw new Error('useSizesContext must be used within a SizesProvider');
  }

  if (!context.dragLimits) {
    return {
      ...context,
      coverSize: 100,
      toobarIconSize: 100 / 2,
      fontSize: 100 / 7,
      circleRadius: 100 / 7 / 1.5,
      dragLimits: {
        x: 0,
        y: 0,
        width: 1,
        height: 1,
      },
      toolBarLimits: {
        x: 0,
        y: 0,
        width: 1,
        height: 1,
      },
      windowSize: {
        width: 1,
        height: 1,
      },
      getCurrentY: () => 1,
    };
  }
  return context;
};

const throttle = (func: () => void, delay: number) => {
  let inProgress = false;
  return () => {
    if (inProgress) {
      return;
    }
    inProgress = true;
    setTimeout(() => {
      func();
      inProgress = false;
    }, delay);
  };
};

export const SizesProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { configs, cover, updateAllCoverPosition } = useCoverContext();
  const coverSize = configs.size;
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const toobarIconSize = coverSize / 2.5;
  const spaceBetween = toobarIconSize / 2;
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

  const moveIntoView = useCallback(() => {
    const posArray = cover.map(({ x, y }) => {
      let pos: Vector2d = { x, y };
      if (x > dragLimits.width - coverSize && x > 0) {
        pos.x = dragLimits.width - coverSize;
      }
      if (y > dragLimits.height - coverSize && y > 0) {
        pos.y = dragLimits.height - coverSize;
      }
      return pos;
    });
    if (posArray.length) {
      updateAllCoverPosition(posArray);
    }
  }, [
    cover,
    coverSize,
    dragLimits.height,
    dragLimits.width,
    updateAllCoverPosition,
  ]);

  const offLimitCovers = useMemo(
    () =>
      cover.flatMap((cover) => {
        if (
          (cover.x > dragLimits.width && dragLimits.width > coverSize) ||
          (cover.y > dragLimits.height && dragLimits.height > coverSize)
        ) {
          return cover;
        }

        return [];
      }),
    [cover, coverSize, dragLimits.height, dragLimits.width],
  );

  useEffect(() => {
    const throttleResize = throttle(() => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }, 500);

    window.addEventListener('resize', throttleResize);
    return () => {
      window.removeEventListener('resize', throttleResize);
    };
  }, []);

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
        moveIntoView,
        offLimitCovers,
      }}>
      {children}
    </SizesContext.Provider>
  );
};
