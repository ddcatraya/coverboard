import React, { useMemo, useState } from 'react';
import { Group } from 'react-konva';

import { useCoverContext, useSizesContext } from 'contexts';
import { LineParams, LinePoint, PosTypes } from 'types';
import { DrawLineArrow, DrawLineCircle, DrawLineLabel } from '.';

interface LineProps {
  line: LinePoint;
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

export const DrawLine: React.FC<LineProps> = ({ line }) => {
  const { coverSize } = useSizesContext();
  const { cover, removeLine, erase } = useCoverContext();
  const [textEdit, setTextEdit] = useState(false);

  const lineParams = useMemo((): LineParams | undefined => {
    if (line.target) {
      const originSquare = cover.find((cov) => cov.id === line.origin.id);
      const targetSquare = cover.find((cov) => cov.id === line.target?.id);

      if (originSquare && targetSquare) {
        const originPos = convertPosToXY(coverSize, line.origin.pos);
        const targetPos = convertPosToXY(coverSize, line.target.pos);

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
    }
  }, [cover, coverSize, line.origin, line.target]);

  const handleOpen = (line: LinePoint) => {
    if (erase) {
      removeLine(line.id);
      return;
    }

    setTextEdit(true);
  };

  if (!lineParams) return null;

  return (
    <Group>
      <DrawLineArrow lineParams={lineParams} />
      <Group x={lineParams.midX} y={lineParams.midY}>
        <DrawLineCircle line={line} handleOpen={handleOpen} />
        <DrawLineLabel
          line={line}
          open={textEdit}
          setOpen={setTextEdit}
          lineParams={lineParams}
        />
      </Group>
    </Group>
  );
};
