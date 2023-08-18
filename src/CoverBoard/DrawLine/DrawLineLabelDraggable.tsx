import { Group } from 'react-konva';
import { KonvaEventObject } from 'konva/lib/Node';
import { useMemo, useState } from 'react';
import { useCoverContext, useSizesContext } from 'contexts';
import { LineParams, LinePoint, PosTypes } from 'types';
import { v4 as uuidv4 } from 'uuid';
import { getClientPosition } from 'utils';

interface DraggableGroupProps {
  children: React.ReactNode;
  line: LinePoint;
  setUpdate: (dir: PosTypes) => void;
  lineParams: LineParams;
}

export const DrawLineLabelDraggable = ({
  line,
  lineParams,
  setUpdate,
  children,
}: DraggableGroupProps) => {
  const { erase, editLines } = useCoverContext();
  const { coverSize, fontSize, circleRadius, dragLimits } = useSizesContext();
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

  const handleDragEnd = (e: KonvaEventObject<DragEvent>) => {
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
    if (y > dragLimits.y + lineParams.midY + fontSize) {
      dir = PosTypes.BOTTOM;
    } else if (y < dragLimits.y + lineParams.midY - fontSize) {
      dir = PosTypes.TOP;
    } else if (x < dragLimits.x + lineParams.midX) {
      dir = PosTypes.LEFT;
    } else {
      dir = PosTypes.RIGHT;
    }
    setId(uuidv4());
    setUpdate(dir);
  };

  const newPos = useMemo(() => {
    if (line.label.dir === PosTypes.BOTTOM) {
      return {
        x: 0,
        y: 0,
      };
    } else if (line.label.dir === PosTypes.TOP) {
      return {
        x: 0,
        y: -1.5 * 4 * circleRadius,
      };
    } else if (line.label.dir === PosTypes.RIGHT) {
      return {
        x: coverSize + 3 * circleRadius,
        y: -1.5 * 2 * circleRadius,
      };
    } else {
      return {
        x: -coverSize - 3 * circleRadius,
        y: -1.5 * 2 * circleRadius,
      };
    }
  }, [circleRadius, coverSize, line.label.dir]);

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
