import { Group } from 'react-konva';
import { KonvaEventObject } from 'konva/lib/Node';
import { Vector2d } from 'konva/lib/types';
import { useCoverContext } from 'contexts';
import { Covers } from 'types';

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
  const { erase, covers, updateCoverPosition } = useCoverContext();

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

    if (
      covers.find(
        (star) => star.id !== albumCover.id && star.x === e.target.x(),
      )
    ) {
    }
  };

  const handleDragEnd = (e: KonvaEventObject<DragEvent>) => {
    e.cancelBubble = true;
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
  );
};
