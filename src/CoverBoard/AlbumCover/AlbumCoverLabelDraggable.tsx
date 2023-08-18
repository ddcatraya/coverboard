import { Group } from 'react-konva';
import { KonvaEventObject } from 'konva/lib/Node';
import { useMemo, useState } from 'react';
import { useCoverContext, useSizesContext } from 'contexts';
import { CoverImage, PosTypes } from 'types';
import { v4 as uuidv4 } from 'uuid';
import { getClientPosition } from 'utils';

interface DraggableGroupProps {
  children: React.ReactNode;
  albumCover: CoverImage;
  setUpdate: (title: PosTypes) => void;
  offset: number;
  offSetTop: number;
}

export const AlbumCoverLabelDraggable = ({
  albumCover,
  setUpdate,
  children,
  offset,
  offSetTop,
}: DraggableGroupProps) => {
  const { erase, editLines } = useCoverContext();
  const { coverSize, fontSize, dragLimits } = useSizesContext();
  const [isDragging, setDragging] = useState(false);
  const [id, setId] = useState(uuidv4());

  const handleDragStart = (e: KonvaEventObject<DragEvent>) => {
    e.cancelBubble = true;
    setDragging(true);
    const container = e.target.getStage()?.container();

    if (container && !erase) {
      container.style.cursor = 'grab';
    } else if (container && erase) {
      container.style.cursor = 'not-allowed';
    }
  };

  const handleDragEnd = (e: KonvaEventObject<DragEvent | TouchEvent>) => {
    setDragging(false);
    e.cancelBubble = true;
    const container = e.target.getStage()?.container();

    if (container && !erase) {
      container.style.cursor = 'grab';
    } else if (container && erase) {
      container.style.cursor = 'not-allowed';
    }

    const { x, y } = getClientPosition(e);

    let dir: PosTypes;
    if (y > dragLimits.y + albumCover.y + coverSize) {
      dir = PosTypes.BOTTOM;
    } else if (y < albumCover.y + dragLimits.y) {
      dir = PosTypes.TOP;
    } else if (x < albumCover.x + dragLimits.x) {
      dir = PosTypes.LEFT;
    } else {
      dir = PosTypes.RIGHT;
    }

    setId(uuidv4());
    setUpdate(dir);
  };

  const newPos = useMemo(() => {
    if (albumCover.dir === PosTypes.BOTTOM) {
      return {
        x: 0,
        y: fontSize / 2,
      };
    } else if (albumCover.dir === PosTypes.TOP) {
      return {
        x: 0,
        y: -coverSize - 2 * 2 * fontSize + offSetTop,
      };
    } else if (albumCover.dir === PosTypes.RIGHT) {
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
  }, [albumCover.dir, coverSize, fontSize, offSetTop, offset]);

  return (
    <Group
      key={id}
      opacity={isDragging ? 0.3 : 1}
      x={newPos.x}
      y={newPos.y}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onMouseMove={(evt: KonvaEventObject<MouseEvent>) => {
        const container = evt.target.getStage()?.container();

        if (container && !erase && !editLines) {
          container.style.cursor = 'grab';
        } else if (container && erase) {
          container.style.cursor = 'not-allowed';
        }
      }}
      onMouseLeave={(evt: KonvaEventObject<MouseEvent>) => {
        const container = evt.target.getStage()?.container();

        if (container) {
          container.style.cursor = 'default';
        }
      }}>
      {children}
    </Group>
  );
};
