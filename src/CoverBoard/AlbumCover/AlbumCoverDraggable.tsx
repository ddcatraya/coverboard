import { Group, Line } from 'react-konva';
import { KonvaEventObject } from 'konva/lib/Node';
import { Vector2d } from 'konva/lib/types';
import { Covers } from 'types';
import { useState } from 'react';
import { useMainStore, useUtilsStore } from 'store';
import { shallow } from 'zustand/shallow';

interface DraggableGroupProps {
  children: React.ReactNode;
  id: Covers['id'];
  x: Covers['x'];
  y: Covers['y'];
  min: {
    x: number;
    y: number;
  };
  max: {
    x: number;
    y: number;
  };
}

export const AlbumCoverDraggable: React.FC<DraggableGroupProps> = ({
  id,
  x,
  y,
  min,
  max,
  children,
}) => {
  const covers = useMainStore((state) => state.covers);
  const color = useMainStore((state) => state.getColor());
  const updateCoverPosition = useMainStore(
    (state) => state.updateCoverPosition,
  );
  const erase = useUtilsStore((state) => state.erase);

  const dragLimits = useMainStore((state) => state.dragLimits(), shallow);
  const [hintLines, setHintLines] = useState<
    [Covers | undefined, Covers | undefined]
  >([undefined, undefined]);

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
    e.currentTarget.opacity(0.5);
    const container = e.target.getStage()?.container();

    if (container && !erase) {
      container.style.cursor = 'grab';
    } else if (container && erase) {
      container.style.cursor = 'not-allowed';
    }
  };

  const handleDragMove = (e: KonvaEventObject<DragEvent>) => {
    e.cancelBubble = true;

    const foundY = covers.find(
      (star) => star.id !== id && star.y === Math.round(e.target.y()),
    );
    const foundX = covers.find(
      (star) => star.id !== id && star.x === Math.round(e.target.x()),
    );

    if (
      (typeof hintLines[0] === 'undefined' && foundY) ||
      (typeof hintLines[1] === 'undefined' && foundX)
    ) {
      setHintLines([foundY, foundX]);
    } else if (
      (typeof hintLines[0] !== 'undefined' && !foundY) ||
      (typeof hintLines[1] !== 'undefined' && !foundX)
    ) {
      setHintLines([undefined, undefined]);
    }
  };

  const handleDragEnd = (e: KonvaEventObject<DragEvent>) => {
    e.cancelBubble = true;
    setHintLines([undefined, undefined]);
    e.currentTarget.opacity(1);
    const container = e.target.getStage()?.container();

    if (container && !erase) {
      container.style.cursor = 'pointer';
    } else if (container && erase) {
      container.style.cursor = 'not-allowed';
    }

    updateCoverPosition(id, {
      x: Math.round(e.target.x()),
      y: Math.round(e.target.y()),
    });
  };

  return (
    <>
      {hintLines[0] && (
        <Line
          points={[0, hintLines[0].y, dragLimits.width, hintLines[0].y]}
          stroke={color}
          strokeWidth={2}
        />
      )}
      {hintLines[1] && (
        <Line
          points={[hintLines[1].x, 0, hintLines[1].x, dragLimits.height]}
          stroke={color}
          strokeWidth={1}
        />
      )}
      <Group
        x={x}
        y={y}
        draggable
        onDragMove={handleDragMove}
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
    </>
  );
};
