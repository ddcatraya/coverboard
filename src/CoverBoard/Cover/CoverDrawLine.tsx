import React from 'react';
import { Group, Rect } from 'react-konva';

import { Covers, PosTypes } from 'types';
import { KonvaEventObject } from 'konva/lib/Node';
import { useUtilsStore, useMainStore } from 'store';

interface CoverDrawLineProps {
  id: Covers['id'];
  scaleX?: number;
  scaleY?: number;
}

export const CoverDrawLine: React.FC<CoverDrawLineProps> = ({
  id,
  scaleX = 1,
  scaleY = 1,
}) => {
  const erase = useUtilsStore((state) => state.erase);
  const points = useUtilsStore((state) => state.points);
  const setPoints = useUtilsStore((state) => state.setPoints);
  const editLines = useUtilsStore((state) => state.editLines);
  const createLine = useMainStore((state) => state.createLine);

  const coverSizeWidth =
    useMainStore((state) => state.coverSizeWidth()) * scaleX;
  const coverSizeHeight =
    useMainStore((state) => state.coverSizeHeight()) * scaleY;
  const selection: PosTypes | null = points?.id === id ? points.dir : null;

  const handleDrawLine = (id: string, dir: PosTypes) => {
    if (!points) {
      setPoints({ id, dir });
    } else if (points.id !== id) {
      createLine(id, points, dir);
      setPoints(null);
    } else if (points.id === id) {
      setPoints(null);
    }
  };

  const posArray = [
    {
      dir: PosTypes.TOP,
      x: coverSizeWidth / 2,
      y: -coverSizeWidth / 4 - coverSizeWidth / 8,
      width: coverSizeWidth / 2,
      height: coverSizeWidth / 2,
    },
    {
      dir: PosTypes.RIGHT,
      x: coverSizeWidth,
      y: coverSizeHeight / 8,
      width: coverSizeHeight / 2,
      height: coverSizeHeight / 2,
    },
    {
      dir: PosTypes.LEFT,
      x: 0,
      y: coverSizeHeight / 8,
      width: coverSizeHeight / 2,
      height: coverSizeHeight / 2,
    },
    {
      dir: PosTypes.BOTTOM,
      x: coverSizeWidth / 2,
      y: coverSizeHeight - coverSizeWidth / 4 - coverSizeWidth / 8,
      width: coverSizeWidth / 2,
      height: coverSizeWidth / 2,
    },
  ];

  if (!editLines) return null;

  return (
    <Group listening={!erase}>
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
