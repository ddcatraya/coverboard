import { Tooltip } from 'components';
import { KonvaEventObject } from 'konva/lib/Node';
import { Vector2d } from 'konva/lib/types';
import React from 'react';
import { useMemo, useState } from 'react';
import { Arrow, Group } from 'react-konva';
import { useMainStore, useUtilsStore } from 'store';
import { Covers } from 'types';
import { shallow } from 'zustand/shallow';

interface BoundaryArrowProps {
  id: Covers['id'];
  title: string;
  x: Covers['x'];
  y: Covers['y'];
}

export const BoundaryArrowMemo: React.FC<BoundaryArrowProps> = ({
  id,
  title,
  x,
  y,
}) => {
  const color = useMainStore((state) => state.getArrowColor());

  const updateCoverPosition = useMainStore(
    (state) => state.updateCoverPosition,
  );
  const removeCoverAndRelatedLines = useMainStore(
    (state) => state.removeCoverAndRelatedLines,
  );
  const erase = useUtilsStore((state) => state.erase);
  const coverSizeWidth = useMainStore((state) => state.coverSizeWidth());
  const coverSizeHeight = useMainStore((state) => state.coverSizeHeight());
  const fontSize = useMainStore((state) => state.fontSize());
  const dragLimits = useMainStore((state) => state.dragLimits(), shallow);

  const [tooltip, setTooltip] = useState(false);

  const points: [number, number, number, number] = useMemo(() => {
    if (
      x > dragLimits.width - coverSizeWidth &&
      y > dragLimits.height - coverSizeHeight
    ) {
      return [
        dragLimits.width - 1.8 * fontSize,
        dragLimits.height - 1.8 * fontSize,
        dragLimits.width - fontSize,
        dragLimits.height - fontSize,
      ];
    } else if (
      x > dragLimits.width - coverSizeWidth &&
      y < dragLimits.height - coverSizeHeight
    ) {
      return [
        dragLimits.width - 2 * fontSize,
        y + coverSizeHeight / 2,
        dragLimits.width - fontSize,
        y + coverSizeHeight / 2,
      ];
    }
    return [
      x + coverSizeWidth / 2,
      dragLimits.height - 2 * fontSize,
      x + coverSizeWidth / 2,
      dragLimits.height - fontSize,
    ];
  }, [
    x,
    dragLimits.width,
    dragLimits.height,
    coverSizeWidth,
    y,
    coverSizeHeight,
    fontSize,
  ]);

  const handleBringIntoView = () => {
    if (erase) {
      removeCoverAndRelatedLines(id);
      return;
    }
    let newPos: Vector2d = { x, y };
    if (newPos.x > dragLimits.width) {
      newPos.x = dragLimits.width - coverSizeWidth;
    }
    if (newPos.y > dragLimits.height) {
      newPos.y = dragLimits.height - coverSizeHeight;
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
        <Tooltip
          text={title}
          x={points[0] - 2 * coverSizeWidth - fontSize}
          y={points[1] - fontSize}
          align="right"
        />
      )}
    </Group>
  );
};

export const BoundaryArrow = React.memo(BoundaryArrowMemo);
