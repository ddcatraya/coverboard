import React, { useMemo } from 'react';
import { Group } from 'react-konva';

import { LineParams, Lines, PosTypes } from 'types';
import { DrawLineArrow, DrawLineLabel } from '.';
import { useMainStore } from 'store';

interface LineProps {
  id: Lines['id'];
  dir: Lines['dir'];
  originId: Lines['origin']['id'];
  originDir: Lines['origin']['dir'];
  targetId: Lines['target']['id'];
  targetDir: Lines['target']['dir'];
}

const convertPosToXY = (coverSize: number, pos: PosTypes) => {
  if (pos === PosTypes.TOP) {
    return {
      x: coverSize / 2,
      y: -coverSize / 16,
    };
  } else if (pos === PosTypes.BOTTOM) {
    return {
      x: coverSize / 2,
      y: coverSize + coverSize / 16,
    };
  } else if (pos === PosTypes.LEFT) {
    return {
      x: -coverSize / 16,
      y: coverSize / 2,
    };
  } else {
    return {
      x: coverSize + coverSize / 16,
      y: coverSize / 2,
    };
  }
};

export const DrawLineMemo: React.FC<LineProps> = ({
  id,
  dir,
  originId,
  originDir,
  targetId,
  targetDir,
}) => {
  const coverSize = useMainStore((state) => state.configs.size);
  const originSquare = useMainStore((state) =>
    state.covers.find((cov) => cov.id === originId),
  );
  const targetSquare = useMainStore((state) =>
    state.covers.find((cov) => cov.id === targetId),
  );

  const lineParams = useMemo((): LineParams | undefined => {
    if (originSquare && targetSquare) {
      const originPos = convertPosToXY(coverSize, originDir);
      const targetPos = convertPosToXY(coverSize, targetDir);

      const points = [
        originSquare.x + originPos.x,
        originSquare.y + originPos.y,
        targetSquare.x + targetPos.x,
        targetSquare.y + targetPos.y,
      ];

      const midX = (points[0] + points[2]) / 2;
      const midY = (points[1] + points[3]) / 2;

      return {
        midX,
        midY,
        points,
      };
    }
  }, [targetDir, originSquare, targetSquare, coverSize, originDir]);

  if (!lineParams) return null;

  return (
    <Group>
      <Group x={lineParams.midX} y={lineParams.midY}>
        <DrawLineLabel id={id} dir={dir} lineParams={lineParams} />
      </Group>
      <DrawLineArrow lineParams={lineParams} />
    </Group>
  );
};

export const DrawLine = React.memo(DrawLineMemo);
