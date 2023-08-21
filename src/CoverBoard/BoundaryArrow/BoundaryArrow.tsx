import { useSizesContext } from 'contexts';
import { KonvaEventObject } from 'konva/lib/Node';
import { Vector2d } from 'konva/lib/types';
import { useMemo, useState } from 'react';
import { Arrow, Group, Rect, Text } from 'react-konva';
import { useMainStore, useUtilsStore } from 'store';
import { backColorMap, colorMap, Covers } from 'types';

interface BoundaryArrowProps {
  albumCover: Covers;
}

export const BoundaryArrow: React.FC<BoundaryArrowProps> = ({ albumCover }) => {
  const configs = useMainStore((state) => state.configs);
  const updateCoverPosition = useMainStore(
    (state) => state.updateCoverPosition,
  );
  const removeCover = useMainStore((state) => state.removeCover);
  const erase = useUtilsStore((state) => state.erase);

  const { fontSize, dragLimits, coverSize } = useSizesContext();
  const [tooltip, setTooltip] = useState(false);

  const points = useMemo(() => {
    if (
      albumCover.x > dragLimits.width - coverSize &&
      albumCover.y > dragLimits.height - coverSize
    ) {
      return [
        dragLimits.width - 1.8 * fontSize,
        dragLimits.height - 1.8 * fontSize,
        dragLimits.width - fontSize,
        dragLimits.height - fontSize,
      ];
    } else if (
      albumCover.x > dragLimits.width - coverSize &&
      albumCover.y < dragLimits.height - coverSize
    ) {
      return [
        dragLimits.width - 2 * fontSize,
        albumCover.y + coverSize / 2,
        dragLimits.width - fontSize,
        albumCover.y + coverSize / 2,
      ];
    }
    return [
      albumCover.x + coverSize / 2,
      dragLimits.height - 2 * fontSize,
      albumCover.x + coverSize / 2,
      dragLimits.height - fontSize,
    ];
  }, [
    coverSize,
    dragLimits.height,
    dragLimits.width,
    fontSize,
    albumCover.x,
    albumCover.y,
  ]);

  const handleBringIntoView = () => {
    if (erase) {
      removeCover(albumCover.id);
      return;
    }
    let newPos: Vector2d = { x: albumCover.x, y: albumCover.y };
    if (newPos.x > dragLimits.width) {
      newPos.x = dragLimits.width - coverSize;
    }
    if (newPos.y > dragLimits.height) {
      newPos.y = dragLimits.height - coverSize;
    }
    updateCoverPosition(albumCover.id, newPos);
  };

  return (
    <Group>
      <Arrow
        points={points}
        stroke={colorMap[configs.color]}
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
            fill={backColorMap[configs.backColor]}
            listening={false}
          />
          <Text
            width={coverSize * 2}
            align="right"
            text={albumCover.album.text}
            fontSize={fontSize}
            fill="white"
            listening={false}
          />
        </Group>
      )}
    </Group>
  );
};
