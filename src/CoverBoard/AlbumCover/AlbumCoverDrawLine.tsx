import React from 'react';
import { Group, Rect } from 'react-konva';

import { Covers, PosTypes } from 'types';
import { KonvaEventObject } from 'konva/lib/Node';
import { useUtilsStore, useMainStore } from 'store';

interface AlbumCoverDrawLineProps {
  id: Covers['id'];
}

export const AlbumCoverDrawLine: React.FC<AlbumCoverDrawLineProps> = ({
  id,
}) => {
  const erase = useUtilsStore((state) => state.erase);
  const points = useUtilsStore((state) => state.points);
  const setPoints = useUtilsStore((state) => state.setPoints);
  const editLines = useUtilsStore((state) => state.editLines);
  const createLine = useMainStore((state) => state.createLine);

  const coverSize = useMainStore((state) => state.coverSize());
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
      x: coverSize / 2,
      y: -coverSize / 4 - coverSize / 8,
    },
    {
      dir: PosTypes.RIGHT,
      x: coverSize,
      y: coverSize / 8,
    },
    {
      dir: PosTypes.LEFT,
      x: 0,
      y: coverSize / 8,
    },
    {
      dir: PosTypes.BOTTOM,
      x: coverSize / 2,
      y: coverSize - coverSize / 4 - coverSize / 8,
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
          width={coverSize / 2}
          height={coverSize / 2}
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
