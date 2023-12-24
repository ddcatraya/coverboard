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

const convertPosToXY = (
  coverSizeWidth: number,
  coverSizeHeight: number,
  pos: PosTypes,
) => {
  if (pos === PosTypes.TOP) {
    return {
      x: coverSizeWidth / 2,
      y: -coverSizeHeight / 16,
    };
  } else if (pos === PosTypes.BOTTOM) {
    return {
      x: coverSizeWidth / 2,
      y: coverSizeHeight + coverSizeHeight / 16,
    };
  } else if (pos === PosTypes.LEFT) {
    return {
      x: -coverSizeWidth / 16,
      y: coverSizeHeight / 2,
    };
  } else {
    return {
      x: coverSizeWidth + coverSizeWidth / 16,
      y: coverSizeHeight / 2,
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
  const coverSizeOriginWidth = useMainStore((state) =>
    state.coverSizeWidthScaled(originId),
  );
  const coverSizeOriginHeight = useMainStore((state) =>
    state.coverSizeHeightScaled(originId),
  );
  const coverSizeDestWidth = useMainStore((state) =>
    state.coverSizeWidthScaled(targetId),
  );
  const coverSizeDestHeight = useMainStore((state) =>
    state.coverSizeHeightScaled(targetId),
  );
  const originSquare = useMainStore((state) =>
    state.covers.find((cov) => cov.id === originId),
  );
  const targetSquare = useMainStore((state) =>
    state.covers.find((cov) => cov.id === targetId),
  );

  const lineParams = useMemo((): LineParams | undefined => {
    if (originSquare && targetSquare) {
      const originPos = convertPosToXY(
        coverSizeOriginWidth,
        coverSizeOriginHeight,
        originDir,
      );
      const targetPos = convertPosToXY(
        coverSizeDestWidth,
        coverSizeDestHeight,
        targetDir,
      );

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
  }, [
    originSquare,
    targetSquare,
    coverSizeOriginWidth,
    coverSizeOriginHeight,
    originDir,
    coverSizeDestWidth,
    coverSizeDestHeight,
    targetDir,
  ]);

  if (!lineParams) return null;

  return (
    <Group>
      <DrawLineArrow lineParams={lineParams} />
      <Group x={lineParams.midX} y={lineParams.midY}>
        <DrawLineLabel id={id} dir={dir} lineParams={lineParams} />
      </Group>
    </Group>
  );
};

export const DrawLine = React.memo(DrawLineMemo);
