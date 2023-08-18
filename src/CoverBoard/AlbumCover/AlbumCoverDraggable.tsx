import { Group } from 'react-konva';
import { KonvaEventObject } from 'konva/lib/Node';
import { Vector2d } from 'konva/lib/types';
import { useState } from 'react';
import { useCoverContext } from 'contexts';

interface DraggableGroupProps<T> {
  children: React.ReactNode;
  update: T;
  setUpdate: (title: T) => void;
  min: {
    x: number;
    y: number;
  };
  max: {
    x: number;
    y: number;
  };
}

export function AlbumCoverDraggable<T extends { x: number; y: number }>({
  update,
  setUpdate,
  min,
  max,
  children,
}: DraggableGroupProps<T>) {
  const { erase } = useCoverContext();
  const [isDragging, setDragging] = useState(false);

  const handleDragBound = (pos: Vector2d) => {
    // Max limit, pos or min
    const maxX = Math.min(pos.x, max.x);
    const maxY = Math.min(pos.y, max.y);

    // Lower limit, pos or min
    const newX = Math.max(min.x, maxX);
    const newY = Math.max(min.y, maxY);

    return {
      x: newX,
      y: newY,
    };
  };

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

  const handleDragEnd = (e: KonvaEventObject<DragEvent>) => {
    setDragging(false);
    e.cancelBubble = true;
    const container = e.target.getStage()?.container();

    if (container && !erase) {
      container.style.cursor = 'grab';
    } else if (container && erase) {
      container.style.cursor = 'not-allowed';
    }

    setUpdate({
      ...update,
      x: e.target.x(),
      y: e.target.y(),
    });
  };

  return (
    <Group
      opacity={isDragging ? 0.3 : 1}
      x={update.x}
      y={update.y}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      dragBoundFunc={handleDragBound}
      onMouseMove={(evt: KonvaEventObject<MouseEvent>) => {
        const container = evt.target.getStage()?.container();

        if (container && !erase) {
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
}
