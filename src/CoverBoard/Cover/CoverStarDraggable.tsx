import { Group } from 'react-konva';
import { KonvaEventObject } from 'konva/lib/Node';
import { useMemo, useState } from 'react';
import { Covers, PosTypes } from 'types';
import { v4 as uuidv4 } from 'uuid';
import { getClientPosition } from 'utils';
import { useMainStore, useUtilsStore } from 'store';
import { shallow } from 'zustand/shallow';

interface DraggableGroupProps {
  children: React.ReactNode;
  id: Covers['id'];
  x: Covers['x'];
  y: Covers['y'];
  offset: number;
  offSetTop: number;
}

export const CoverStarDraggable = ({
  id,
  x,
  y,
  children,
  offset,
  offSetTop,
}: DraggableGroupProps) => {
  const dir = useMainStore((state) => state.getStarDirById(id));
  const updateCoverStarDir = useMainStore((state) => state.updateCoverStarDir);
  const erase = useUtilsStore((state) => state.erase);
  const dragLimits = useMainStore((state) => state.dragLimits(), shallow);
  const coverSizeWidth = useMainStore((state) =>
    state.coverSizeWidthScaled(id),
  );
  const coverSizeHeight = useMainStore((state) =>
    state.coverSizeHeightScaled(id),
  );
  const [randId, setId] = useState(uuidv4());
  const starRadius = useMainStore((state) => state.starRadius());

  const handleDragStart = (e: KonvaEventObject<DragEvent>) => {
    e.cancelBubble = true;
    // e.currentTarget.opacity(0.5);
    const container = e.target.getStage()?.container();

    if (container && !erase) {
      container.style.cursor = 'grab';
    } else if (container && erase) {
      container.style.cursor = 'not-allowed';
    }
  };

  const handleDragEnd = (e: KonvaEventObject<DragEvent | TouchEvent>) => {
    // e.currentTarget.opacity(1);
    e.cancelBubble = true;
    const container = e.target.getStage()?.container();

    if (container && !erase) {
      container.style.cursor = 'grab';
    } else if (container && erase) {
      container.style.cursor = 'not-allowed';
    }

    const { x: xAbs, y: yAbs } = getClientPosition(e);

    let newDir: PosTypes;
    if (yAbs > dragLimits.y + y + coverSizeHeight) {
      newDir = PosTypes.BOTTOM;
    } else if (yAbs < y + dragLimits.y) {
      newDir = PosTypes.TOP;
    } else if (xAbs < x + dragLimits.x) {
      newDir = PosTypes.LEFT;
    } else {
      newDir = PosTypes.RIGHT;
    }

    setId(uuidv4());
    updateCoverStarDir(id, newDir);
  };

  const totalWidth = 4 * starRadius * 3;

  const newPos = useMemo(() => {
    if (dir === PosTypes.BOTTOM) {
      return {
        x: -totalWidth / 2,
        y: starRadius * 2,
      };
    } else if (dir === PosTypes.TOP) {
      return {
        x: -totalWidth / 2,
        y: -coverSizeHeight - 4 * starRadius + offSetTop,
      };
    } else if (dir === PosTypes.RIGHT) {
      return {
        x: coverSizeWidth / 2 + 2.5 * starRadius,
        y: -coverSizeHeight / 2 - starRadius - offset / 2,
      };
    } else {
      return {
        x: -coverSizeWidth - 2 * starRadius,
        y: -coverSizeHeight / 2 - starRadius - offset / 2,
      };
    }
  }, [
    coverSizeHeight,
    coverSizeWidth,
    dir,
    offSetTop,
    offset,
    starRadius,
    totalWidth,
  ]);

  return (
    <Group
      key={randId}
      x={newPos.x}
      y={newPos.y}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onMouseMove={(evt: KonvaEventObject<MouseEvent>) => {
        const container = evt.target.getStage()?.container();
        evt.currentTarget.opacity(0.5);
        if (container && !erase) {
          container.style.cursor = 'grab';
        } else if (container && erase) {
          container.style.cursor = 'not-allowed';
        }
      }}
      onMouseLeave={(evt: KonvaEventObject<MouseEvent>) => {
        const container = evt.target.getStage()?.container();
        evt.currentTarget.opacity(1);
        if (container) {
          container.style.cursor = 'default';
        }
      }}>
      {children}
    </Group>
  );
};
