import { useCoverContext, useSizesContext } from 'contexts';
import { KonvaEventObject } from 'konva/lib/Node';
import { Vector2d } from 'konva/lib/types';
import { useMemo } from 'react';
import { Arrow } from 'react-konva';
import { colorMap } from 'types';

interface BoundaryArrowProps {
  pos: Vector2d;
  id: string;
}

export const BoundaryArrow: React.FC<BoundaryArrowProps> = ({ pos, id }) => {
  const { configs, updateCoverPosition, erase, removeCover } =
    useCoverContext();
  const { fontSize, dragLimits, coverSize } = useSizesContext();

  const points = useMemo(() => {
    if (
      pos.x > dragLimits.width - coverSize &&
      pos.y > dragLimits.height - coverSize
    ) {
      return [
        dragLimits.width - 1.8 * fontSize,
        dragLimits.height - 1.8 * fontSize,
        dragLimits.width - fontSize,
        dragLimits.height - fontSize,
      ];
    } else if (
      pos.x > dragLimits.width - coverSize &&
      pos.y < dragLimits.height - coverSize
    ) {
      return [
        dragLimits.width - 2 * fontSize,
        pos.y + coverSize / 2,
        dragLimits.width - fontSize,
        pos.y + coverSize / 2,
      ];
    }
    return [
      pos.x + coverSize / 2,
      dragLimits.height - 2 * fontSize,
      pos.x + coverSize / 2,
      dragLimits.height - fontSize,
    ];
  }, [coverSize, dragLimits.height, dragLimits.width, fontSize, pos.x, pos.y]);

  const handleBringIntoView = () => {
    if (erase) {
      removeCover(id);
      return;
    }
    let newPos: Vector2d = { ...pos };
    if (newPos.x > dragLimits.width) {
      newPos.x = dragLimits.width - coverSize;
    }
    if (newPos.y > dragLimits.height) {
      newPos.y = dragLimits.height - coverSize;
    }
    updateCoverPosition(id, newPos);
  };

  return (
    <Arrow
      points={points}
      stroke={colorMap[configs.color]}
      strokeWidth={fontSize / 2}
      pointerLength={fontSize}
      onClick={handleBringIntoView}
      onMouseMove={(evt: KonvaEventObject<MouseEvent>) => {
        const container = evt.target.getStage()?.container();

        if (container) {
          container.style.cursor = 'pointer';
        }
      }}
      onMouseLeave={(evt: KonvaEventObject<MouseEvent>) => {
        const container = evt.target.getStage()?.container();

        if (container) {
          container.style.cursor = 'default';
        }
      }}
    />
  );
};
