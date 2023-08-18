import React from 'react';
import { Group, Rect } from 'react-konva';

import { useCoverContext, useSizesContext } from 'contexts';
import { CoverImage, PosTypes } from 'types';

interface AlbumCoverDrawLineProps {
  id: CoverImage['id'];
}

export const AlbumCoverDrawLine: React.FC<AlbumCoverDrawLineProps> = ({
  id,
}) => {
  const { erase, points, setPoints, editLines, createLine } = useCoverContext();
  const { coverSize } = useSizesContext();
  const selection: PosTypes | null = points?.id === id ? points.pos : null;

  const handleDrawLine = (id: string, pos: PosTypes) => {
    if (!points) {
      setPoints({ id, pos });
    } else if (points.id !== id) {
      createLine(id, points, pos);
      setPoints(null);
    } else if (points.id === id) {
      setPoints(null);
    }
  };

  if (!editLines) return null;

  return (
    <Group listening={!erase}>
      <Rect
        x={coverSize / 2}
        y={-coverSize / 4 - coverSize / 8}
        width={coverSize / 2}
        height={coverSize / 2}
        fill={selection === PosTypes.TOP ? 'red' : 'white'}
        rotation={45}
        opacity={selection === PosTypes.TOP ? 0.3 : 0.05}
        visible={!(!!selection && selection !== PosTypes.TOP)}
        onClick={() => handleDrawLine(id, PosTypes.TOP)}
        onDblTap={() => handleDrawLine(id, PosTypes.TOP)}
      />
      <Rect
        x={coverSize}
        y={coverSize / 8}
        width={coverSize / 2}
        height={coverSize / 2}
        fill={selection && selection === PosTypes.RIGHT ? 'red' : 'white'}
        rotation={45}
        visible={!(!!selection && selection !== PosTypes.RIGHT)}
        opacity={selection === PosTypes.RIGHT ? 0.3 : 0.05}
        onClick={() => handleDrawLine(id, PosTypes.RIGHT)}
        onDblTap={() => handleDrawLine(id, PosTypes.RIGHT)}
      />
      <Rect
        y={coverSize / 8}
        width={coverSize / 2}
        height={coverSize / 2}
        fill={selection === PosTypes.LEFT ? 'red' : 'white'}
        rotation={45}
        opacity={selection === PosTypes.LEFT ? 0.3 : 0.05}
        visible={!(!!selection && selection !== PosTypes.LEFT)}
        onClick={() => handleDrawLine(id, PosTypes.LEFT)}
        onDblTap={() => handleDrawLine(id, PosTypes.LEFT)}
      />
      <Rect
        x={coverSize / 2}
        y={coverSize - coverSize / 4 - coverSize / 8}
        width={coverSize / 2}
        height={coverSize / 2}
        fill={selection === PosTypes.BOTTOM ? 'red' : 'white'}
        rotation={45}
        opacity={selection === PosTypes.BOTTOM ? 0.3 : 0.05}
        visible={!(!!selection && selection !== PosTypes.BOTTOM)}
        onClick={() => handleDrawLine(id, PosTypes.BOTTOM)}
        onDblTap={() => handleDrawLine(id, PosTypes.BOTTOM)}
      />
    </Group>
  );
};
