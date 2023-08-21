import { Group, Line } from 'react-konva';
import { KonvaEventObject } from 'konva/lib/Node';
import { Vector2d } from 'konva/lib/types';
import { useSizesContext } from 'contexts';
import { Covers, colorMap } from 'types';
import { useState } from 'react';
import { useMainStore, useUtilsStore } from 'store';

interface DraggableGroupProps {
  children: React.ReactNode;
  albumCover: Covers;
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
  albumCover,
  min,
  max,
  children,
}) => {
  const covers = useMainStore((state) => state.covers);
  const configs = useMainStore((state) => state.configs);
  const updateCoverPosition = useMainStore(
    (state) => state.updateCoverPosition,
  );
  const erase = useUtilsStore((state) => state.erase);

  const { dragLimits } = useSizesContext();
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

    setHintLines([
      covers.find(
        (star) => star.id !== albumCover.id && star.y === e.target.y(),
      ),
      covers.find(
        (star) => star.id !== albumCover.id && star.x === e.target.x(),
      ),
    ]);
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

    updateCoverPosition(albumCover.id, {
      x: e.target.x(),
      y: e.target.y(),
    });
  };

  return (
    <>
      {hintLines[0] && (
        <Line
          points={[0, hintLines[0].y, dragLimits.width, hintLines[0].y]}
          stroke={colorMap[configs.color]}
          strokeWidth={2}
        />
      )}
      {hintLines[1] && (
        <Line
          points={[hintLines[1].x, 0, hintLines[1].x, dragLimits.height]}
          stroke={colorMap[configs.color]}
          strokeWidth={1}
        />
      )}
      <Group
        x={albumCover.x}
        y={albumCover.y}
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
