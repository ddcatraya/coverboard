import React from 'react';
import { Group, Rect } from 'react-konva';

import { Covers, PosTypes } from 'types';
import { KonvaEventObject } from 'konva/lib/Node';
import { useUtilsStore, useMainStore } from 'store';
import { shallow } from 'zustand/shallow';

interface CommonDrawLineProps {
  id: Covers['id'];
  scaleX?: number;
  scaleY?: number;
  selected?: boolean;
}

export const CommonDrawLine: React.FC<CommonDrawLineProps> = ({
  id,
  scaleX = 1,
  scaleY = 1,
  selected = false,
}) => {
  const points = useUtilsStore((state) => state.points);
  const setPoints = useUtilsStore((state) => state.setPoints);
  const createLine = useMainStore((state) => state.createLine);
  const [editLines, setEditLines] = useUtilsStore(
    (state) => [state.editLines, state.setEditLines],
    shallow,
  );

  const coverSizeWidth =
    useMainStore((state) => state.coverSizeWidth()) * scaleX;
  const coverSizeHeight =
    useMainStore((state) => state.coverSizeHeight()) * scaleY;
  const selection: PosTypes | null = points?.id === id ? points.dir : null;

  const square = 40 + coverSizeWidth / 20;

  const handleDrawLine = (id: string, dir: PosTypes) => {
    if (!points) {
      setPoints({ id, dir });
      setEditLines(true);
    } else if (points.id !== id) {
      createLine(id, points, dir);
      setPoints(null);
      setEditLines(false);
    } else if (points.id === id) {
      setPoints(null);
      setEditLines(false);
    }
  };

  const posArray = [
    {
      dir: PosTypes.TOP,
      x: coverSizeWidth / 2,
      y: -square / 1.5,
      width: square,
      height: square,
    },
    {
      dir: PosTypes.RIGHT,
      x: coverSizeWidth,
      y: coverSizeHeight / 2 - square / 1.5,
      width: square,
      height: square,
    },
    {
      dir: PosTypes.LEFT,
      x: 0,
      y: coverSizeHeight / 2 - square / 1.5,
      width: square,
      height: square,
    },
    {
      dir: PosTypes.BOTTOM,
      x: coverSizeWidth / 2,
      y: coverSizeHeight - square / 1.5,
      width: square,
      height: square,
    },
  ];

  if (!editLines && !selected) return null;

  return (
    <Group>
      {posArray.map((pos) => (
        <Rect
          key={pos.dir}
          x={pos.x}
          y={pos.y}
          width={pos.width}
          height={pos.height}
          fill={selection === pos.dir ? 'red' : 'white'}
          rotation={45}
          opacity={selection === pos.dir ? 0.3 : 0.05}
          visible={!(!!selection && selection !== pos.dir)}
          onClick={() => handleDrawLine(id, pos.dir)}
          onTap={() => handleDrawLine(id, pos.dir)}
          onMouseMove={(evt: KonvaEventObject<MouseEvent>) => {
            if (selection !== pos.dir) {
              evt.currentTarget.opacity(0.3);
            }
          }}
          onMouseLeave={(evt: KonvaEventObject<MouseEvent>) => {
            evt.currentTarget.opacity(selection === pos.dir ? 0.3 : 0.05);
          }}
        />
      ))}
    </Group>
  );
};
