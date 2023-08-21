import { Group } from 'react-konva';
import { KonvaEventObject } from 'konva/lib/Node';
import { useMemo, useState } from 'react';
import { useSizesContext } from 'contexts';
import { LineParams, Lines, PosTypes } from 'types';
import { v4 as uuidv4 } from 'uuid';
import { getClientPosition } from 'utils';
import { useUtilsStore } from 'store/utilsStore';

interface DraggableGroupProps {
  children: React.ReactNode;
  line: Lines;
  setUpdate: (dir: PosTypes) => void;
  lineParams: LineParams;
}

export const DrawLineLabelDraggable = ({
  line,
  lineParams,
  setUpdate,
  children,
}: DraggableGroupProps) => {
  const erase = useUtilsStore((state) => state.erase);
  const editLines = useUtilsStore((state) => state.editLines);
  const { coverSize, fontSize, circleRadius, dragLimits } = useSizesContext();
  const [id, setId] = useState(uuidv4());

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

  const handleDragEnd = (e: KonvaEventObject<DragEvent>) => {
    e.currentTarget.opacity(1);
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
    if (line.dir === PosTypes.BOTTOM) {
      return {
        x: 0,
        y: 0,
      };
    } else if (line.dir === PosTypes.TOP) {
      return {
        x: 0,
        y: -1.5 * 4 * circleRadius,
      };
    } else if (line.dir === PosTypes.RIGHT) {
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
  }, [circleRadius, coverSize, line.dir]);

  return (
    <Group
      key={id}
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
