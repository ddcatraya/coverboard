import { KonvaEventObject } from 'konva/lib/Node';
import { Vector2d } from 'konva/lib/types';
import React from 'react';
import { useMemo, useState } from 'react';
import { Arrow, Group, Rect, Text } from 'react-konva';
import { useMainStore, useUtilsStore } from 'store';
import { Covers } from 'types';
import { shallow } from 'zustand/shallow';

interface BoundaryArrowProps {
  id: Covers['id'];
  album: Covers['album']['text'];
  x: Covers['x'];
  y: Covers['y'];
}

export const BoundaryArrowMemo: React.FC<BoundaryArrowProps> = ({
  id,
  album,
  x,
  y,
}) => {
  const color = useMainStore((state) => state.getColor());
  const backColor = useMainStore((state) => state.getBackColor());

  const updateCoverPosition = useMainStore(
    (state) => state.updateCoverPosition,
  );
  const removeCoverAndRelatedLines = useMainStore(
    (state) => state.removeCoverAndRelatedLines,
  );
  const erase = useUtilsStore((state) => state.erase);
  const coverSize = useMainStore((state) => state.configs.size);
  const fontSize = useMainStore((state) => state.fontSize());
  const dragLimits = useMainStore((state) => state.dragLimits(), shallow);

  const [tooltip, setTooltip] = useState(false);

  const points = useMemo(() => {
    if (x > dragLimits.width - coverSize && y > dragLimits.height - coverSize) {
      return [
        dragLimits.width - 1.8 * fontSize,
        dragLimits.height - 1.8 * fontSize,
        dragLimits.width - fontSize,
        dragLimits.height - fontSize,
      ];
    } else if (
      x > dragLimits.width - coverSize &&
      y < dragLimits.height - coverSize
    ) {
      return [
        dragLimits.width - 2 * fontSize,
        y + coverSize / 2,
        dragLimits.width - fontSize,
        y + coverSize / 2,
      ];
    }
    return [
      x + coverSize / 2,
      dragLimits.height - 2 * fontSize,
      x + coverSize / 2,
      dragLimits.height - fontSize,
    ];
  }, [x, dragLimits.width, dragLimits.height, coverSize, y, fontSize]);

  const handleBringIntoView = () => {
    if (erase) {
      removeCoverAndRelatedLines(id);
      return;
    }
    let newPos: Vector2d = { x, y };
    if (newPos.x > dragLimits.width) {
      newPos.x = dragLimits.width - coverSize;
    }
    if (newPos.y > dragLimits.height) {
      newPos.y = dragLimits.height - coverSize;
    }
    updateCoverPosition(id, newPos);
  };

  return (
    <Group>
      <Arrow
        points={points}
        stroke={color}
        strokeWidth={fontSize / 2}
        pointerLength={fontSize}
        onClick={handleBringIntoView}
        onTap={handleBringIntoView}
        onMouseMove={(evt: KonvaEventObject<MouseEvent>) => {
          const container = evt.target.getStage()?.container();
          setTooltip(true);
          if (container) {
            container.style.cursor = 'pointer';
          }
        }}
        onMouseLeave={(evt: KonvaEventObject<MouseEvent>) => {
          const container = evt.target.getStage()?.container();
          setTooltip(false);
          if (container) {
            container.style.cursor = 'default';
          }
        }}
      />
      {tooltip && (
        <Group
          x={points[0] - 2 * coverSize - fontSize}
          y={points[1] - fontSize}>
          <Rect
            width={coverSize * 2}
            height={fontSize}
            fill={backColor}
            listening={false}
          />
          <Text
            width={coverSize * 2}
            align="right"
            text={album}
            fontSize={fontSize}
            fill="white"
            listening={false}
          />
        </Group>
      )}
    </Group>
  );
};

export const BoundaryArrow = React.memo(BoundaryArrowMemo);
