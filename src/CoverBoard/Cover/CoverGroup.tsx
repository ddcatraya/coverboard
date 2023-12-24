import React from 'react';
import { Rect } from 'react-konva';

import { Covers } from 'types';
import { KonvaEventObject } from 'konva/lib/Node';
import { useMainStore, useUtilsStore } from 'store';

interface CoverImageProps {
  id: Covers['id'];
}

export const CoverGroup: React.FC<CoverImageProps> = ({ id }) => {
  const removeCoverAndRelatedLines = useMainStore(
    (state) => state.removeCoverAndRelatedLines,
  );
  const color = useMainStore((state) => state.getColor());
  const backColor = useMainStore((state) => state.getBackColor());
  const editLines = useUtilsStore((state) => state.editLines);
  const erase = useUtilsStore((state) => state.erase);

  const coverSizeWidth = useMainStore((state) =>
    state.coverSizeWidthScaled(id),
  );
  const coverSizeHeight = useMainStore((state) =>
    state.coverSizeHeightScaled(id),
  );

  const canDelete = !editLines && erase;

  return (
    <Rect
      width={coverSizeWidth - 2}
      height={coverSizeHeight - 2}
      x={1}
      y={1}
      strokeWidth={1}
      stroke={color}
      onClick={canDelete ? () => removeCoverAndRelatedLines(id) : undefined}
      onDblTap={canDelete ? () => removeCoverAndRelatedLines(id) : undefined}
      onMouseMove={(evt: KonvaEventObject<MouseEvent>) => {
        if (!editLines) {
          evt.currentTarget.opacity(0.5);
        }
      }}
      onMouseLeave={(evt: KonvaEventObject<MouseEvent>) => {
        evt.currentTarget.opacity(1);
      }}
    />
  );
};
