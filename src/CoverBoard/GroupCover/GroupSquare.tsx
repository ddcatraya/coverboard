import React from 'react';
import { Rect } from 'react-konva';

import { GroupCovers } from 'types';
import { KonvaEventObject } from 'konva/lib/Node';
import { useMainStore, useUtilsStore } from 'store';

interface CoverImageProps {
  id: GroupCovers['id'];
}

export const GroupSquare: React.FC<CoverImageProps> = ({ id }) => {
  const removeGroupAndRelatedLines = useMainStore(
    (state) => state.removeGroupAndRelatedLines,
  );
  const color = useMainStore((state) => state.getColor());
  const backColor = useMainStore((state) => state.getBackColor());
  const editLines = useUtilsStore((state) => state.editLines);
  const erase = useUtilsStore((state) => state.erase);
  const scale = useMainStore((state) => state.getScale(id));

  const coverSizeWidth = useMainStore(
    (state) => state.coverSizeWidth() * scale.scaleX,
  );
  const coverSizeHeight = useMainStore(
    (state) => state.coverSizeHeight() * scale.scaleY,
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
      fill={backColor}
      onClick={canDelete ? () => removeGroupAndRelatedLines(id) : undefined}
      onDblTap={canDelete ? () => removeGroupAndRelatedLines(id) : undefined}
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
