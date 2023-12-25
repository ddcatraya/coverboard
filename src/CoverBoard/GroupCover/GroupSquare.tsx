import React, { useRef } from 'react';
import { Rect, Transformer } from 'react-konva';

import { GroupCovers } from 'types';
import { KonvaEventObject } from 'konva/lib/Node';
import { useMainStore, useUtilsStore } from 'store';
import Konva from 'konva';

interface CoverImageProps {
  id: GroupCovers['id'];
  isSelected: boolean;
}

export const GroupSquare: React.FC<CoverImageProps> = ({ id, isSelected }) => {
  const removeGroupAndRelatedLines = useMainStore(
    (state) => state.removeGroupAndRelatedLines,
  );
  const color = useMainStore((state) => state.getColor());
  const backColor = useMainStore((state) => state.getBackColor());
  const editLines = useUtilsStore((state) => state.editLines);
  const erase = useUtilsStore((state) => state.erase);
  const scale = useMainStore((state) => state.getScale(id));

  const boxRef = useRef<null | { width: number; height: number }>(null);

  const updateGroupScale = useMainStore((state) => state.updateGroupScale);
  const updateGroupPositionRelative = useMainStore(
    (state) => state.updateGroupPositionRelative,
  );

  const coverSizeWidth = useMainStore((state) => state.coverSizeWidth());
  const coverSizeHeight = useMainStore((state) => state.coverSizeHeight());
  const coverSizeWidthScaled = coverSizeWidth * scale.scaleX;
  const coverSizeHeightScaled = coverSizeHeight * scale.scaleY;

  const canDelete = !editLines && erase;

  const rectRef = useRef<Konva.Rect>(null);
  const trRef = useRef<Konva.Transformer>(null);

  React.useEffect(() => {
    if (trRef.current && rectRef.current && isSelected) {
      trRef.current.nodes([rectRef.current]);

      trRef.current?.getLayer()?.batchDraw();
    }
  }, [isSelected]);

  const handleTransform = () => {
    if (rectRef.current && boxRef.current) {
      const scaleX =
        Math.round(boxRef.current.width / coverSizeWidth / 0.5) * 0.5;
      const scaleY =
        Math.round(boxRef.current.height / coverSizeHeight / 0.5) * 0.5;

      rectRef.current.x(0);
      rectRef.current.y(0);
      rectRef.current.scaleX(1);
      rectRef.current.scaleY(1);
      updateGroupScale(id, { scaleX, scaleY });
      updateGroupPositionRelative(id, {
        x: (coverSizeWidth * scaleX - coverSizeWidthScaled) / 2,
        y: (coverSizeHeight * scaleY - coverSizeHeightScaled) / 2,
      });

      boxRef.current = null;
    }
  };

  return (
    <>
      <Rect
        width={coverSizeWidthScaled - 2}
        height={coverSizeHeightScaled - 2}
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
        ref={rectRef}
        onTransformEnd={handleTransform}
      />
      {isSelected && (
        <Transformer
          ref={trRef}
          centeredScaling
          boundBoxFunc={(oldBox, newBox) => {
            if (
              Math.abs(newBox.width) < coverSizeWidth ||
              Math.abs(newBox.height) < coverSizeHeight
            ) {
              return oldBox;
            }
            if (
              Math.abs(newBox.width) > coverSizeWidth * 10.5 ||
              Math.abs(newBox.height) > coverSizeHeight * 10.5
            ) {
              return oldBox;
            }

            boxRef.current = { width: newBox.width, height: newBox.height };

            return newBox;
          }}
          flipEnabled={false}
          rotateEnabled={false}
        />
      )}
    </>
  );
};
