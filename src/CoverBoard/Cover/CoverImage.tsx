import React from 'react';
import { Image, Rect, Text } from 'react-konva';

import { Covers } from 'types';
import { useImage } from 'react-konva-utils';
import { KonvaEventObject } from 'konva/lib/Node';
import { useMainStore, useUtilsStore } from 'store';

interface CoverImageProps {
  id: Covers['id'];
  link: Covers['link'];
}

export const CoverImage: React.FC<CoverImageProps> = ({ id, link }) => {
  const removeCoverAndRelatedLines = useMainStore(
    (state) => state.removeCoverAndRelatedLines,
  );
  const color = useMainStore((state) => state.getColor());
  const backColor = useMainStore((state) => state.getBackColor());
  const editLines = useUtilsStore((state) => state.editLines);
  const erase = useUtilsStore((state) => state.erase);

  const coverSizeWidth = useMainStore((state) => state.coverSizeWidth());
  const coverSizeHeight = useMainStore((state) => state.coverSizeHeight());
  const fontSize = useMainStore((state) => state.fontSize());

  const [image, status] = useImage(link, 'anonymous');

  const canDelete = !editLines && erase;

  return (
    <>
      <Rect
        width={coverSizeWidth - 2}
        height={coverSizeHeight - 2}
        x={1}
        y={1}
        fill={backColor}
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
      {status === 'loaded' && image ? (
        <Image
          listening={false}
          image={image}
          width={coverSizeWidth}
          height={coverSizeHeight}
        />
      ) : (
        <Text
          fontSize={fontSize * 1.2}
          x={0}
          y={coverSizeHeight / 2 - (fontSize * 1.2) / 2}
          width={coverSizeWidth}
          align="center"
          fill={color}
          text={status === 'failed' ? 'Error' : 'Loading...'}
        />
      )}
    </>
  );
};
