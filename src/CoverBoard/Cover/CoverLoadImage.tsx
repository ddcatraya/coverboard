import React, { useEffect, useState } from 'react';
import { Rect, Text } from 'react-konva';

import { Covers } from 'types';
import { KonvaEventObject } from 'konva/lib/Node';
import { useMainStore, useUtilsStore } from 'store';
import { CoverImage } from '.';

interface CoverImageProps {
  id: Covers['id'];
  link: Covers['link'];
  renderTime: number;
}

export const CoverLoadImage: React.FC<CoverImageProps> = ({
  id,
  link,
  renderTime,
}) => {
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

  const canDelete = !editLines && erase;

  const [shouldRender, setShouldRender] = useState(false);
  const [hasRetries, setHasRetries] = useState(false);

  const onRetry = (evt) => {
    evt.cancelBubble = true;
    setHasRetries(true);
    setShouldRender(false);
  };

  useEffect(() => {
    if (shouldRender) return;

    const timeoutId = setTimeout(
      () => {
        setShouldRender(true);
      },
      hasRetries ? 1000 : renderTime,
    );

    return () => clearTimeout(timeoutId);
  }, [hasRetries, renderTime, shouldRender]);

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
      {shouldRender ? (
        <CoverImage link={link} onRetry={onRetry} />
      ) : (
        <Text
          fontSize={fontSize * 1.2}
          x={0}
          y={coverSizeHeight / 2 - (fontSize * 1.2) / 2}
          width={coverSizeWidth}
          align="center"
          fill={color}
          text="Loading..."
        />
      )}
    </>
  );
};
