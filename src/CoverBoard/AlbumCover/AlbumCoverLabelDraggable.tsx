import { Group } from 'react-konva';
import { KonvaEventObject } from 'konva/lib/Node';
import { useMemo, useState } from 'react';
import { Covers, PosTypes } from 'types';
import { v4 as uuidv4 } from 'uuid';
import { getClientPosition } from 'utils';
import { useMainStore, useUtilsStore } from 'store';

interface DraggableGroupProps {
  children: React.ReactNode;
  id: Covers['id'];
  x: Covers['x'];
  y: Covers['y'];
  offset: number;
  offSetTop: number;
}

export const AlbumCoverLabelDraggable = ({
  id,
  x,
  y,
  children,
  offset,
  offSetTop,
}: DraggableGroupProps) => {
  const dir = useMainStore((state) => state.getDirById(id));
  const updateCoverDir = useMainStore((state) => state.updateCoverDir);
  const erase = useUtilsStore((state) => state.erase);
  const dragLimits = useMainStore((state) => state.dragLimits());
  const fontSize = useMainStore((state) => state.fontSize());
  const coverSize = useMainStore((state) => state.configs.size);
  const [randId, setId] = useState(uuidv4());

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
    if (yAbs > dragLimits.y + y + coverSize) {
      newDir = PosTypes.BOTTOM;
    } else if (yAbs < y + dragLimits.y) {
      newDir = PosTypes.TOP;
    } else if (xAbs < x + dragLimits.x) {
      newDir = PosTypes.LEFT;
    } else {
      newDir = PosTypes.RIGHT;
    }

    setId(uuidv4());
    updateCoverDir(id, newDir);
  };

  const newPos = useMemo(() => {
    if (dir === PosTypes.BOTTOM) {
      return {
        x: 0,
        y: fontSize / 2,
      };
    } else if (dir === PosTypes.TOP) {
      return {
        x: 0,
        y: -coverSize - 2 * 2 * fontSize + offSetTop,
      };
    } else if (dir === PosTypes.RIGHT) {
      return {
        x: 2 * coverSize + fontSize,
        y: -coverSize / 2 - fontSize - offset / 2,
      };
    } else {
      return {
        x: -2 * coverSize - fontSize,
        y: -coverSize / 2 - fontSize - offset / 2,
      };
    }
  }, [coverSize, dir, fontSize, offSetTop, offset]);

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
