import { Group } from 'react-konva';
import { KonvaEventObject } from 'konva/lib/Node';
import { useMemo, useState } from 'react';
import { LineParams, Lines, PosTypes } from 'types';
import { v4 as uuidv4 } from 'uuid';
import { getClientPosition } from 'utils';
import { useUtilsStore } from 'store/useUtilsStore';
import { useMainStore } from 'store';
import { shallow } from 'zustand/shallow';

interface DraggableGroupProps {
  children: React.ReactNode;
  dir: Lines['dir'];
  setUpdate: (dir: PosTypes) => void;
  lineParams: LineParams;
}

export const DrawLineLabelDraggable: React.FC<DraggableGroupProps> = ({
  dir,
  lineParams,
  setUpdate,
  children,
}) => {
  const erase = useUtilsStore((state) => state.erase);
  const editLines = useUtilsStore((state) => state.editLines);
  const coverSizeWidth = useMainStore((state) => state.coverSizeWidth());
  const fontSize = useMainStore((state) => state.fontSize());
  const circleRadius = useMainStore((state) => state.circleRadius());
  const dragLimits = useMainStore((state) => state.dragLimits(), shallow);
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
    if (y > dragLimits.y + lineParams.midY + 2 * fontSize) {
      dir = PosTypes.BOTTOM;
    } else if (y < dragLimits.y + lineParams.midY - 1.2 * fontSize) {
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
    if (dir === PosTypes.BOTTOM) {
      return {
        x: 0,
        y: 0,
      };
    } else if (dir === PosTypes.TOP) {
      return {
        x: 0,
        y: -1.5 * 4 * circleRadius,
      };
    } else if (dir === PosTypes.RIGHT) {
      return {
        x: coverSizeWidth + 3 * circleRadius,
        y: -1.5 * 2 * circleRadius,
      };
    } else {
      return {
        x: -coverSizeWidth - 3 * circleRadius,
        y: -1.5 * 2 * circleRadius,
      };
    }
  }, [circleRadius, coverSizeWidth, dir]);

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
