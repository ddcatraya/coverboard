import React from 'react';
import { Circle, Group } from 'react-konva';
import { KonvaEventObject } from 'konva/lib/Node';

import { useMainStore, useUtilsStore } from 'store';
import { Elem } from 'types';

export const DrawLineCircle: React.FC<{ id: string }> = ({ id }) => {
  const circleRadius = useMainStore((state) => state.circleRadius());
  const isSelected = useUtilsStore((state) =>
    state.isSelected({ id, elem: Elem.ARROW }),
  );
  const setSelected = useUtilsStore((state) => state.setSelected);
  const color = useMainStore((state) => state.getArrowColor());

  return (
    <Group
      width={circleRadius * 3}
      height={circleRadius * 3}
      onDblClick={() => setSelected({ id, elem: Elem.ARROW, open: true })}
      onDblTap={() => setSelected({ id, elem: Elem.ARROW, open: true })}>
      <Circle
        radius={isSelected ? circleRadius * 1.4 : circleRadius}
        fill={color}
        onMouseMove={(evt: KonvaEventObject<MouseEvent>) => {
          if (!isSelected) {
            evt.currentTarget.scaleX(1.4);
            evt.currentTarget.scaleY(1.4);
          }

          const container = evt.target.getStage()?.container();
          if (container) {
            container.style.cursor = 'pointer';
          }
        }}
        onMouseLeave={(evt: KonvaEventObject<MouseEvent>) => {
          if (!isSelected) {
            evt.currentTarget.scaleX(1);
            evt.currentTarget.scaleY(1);
          }

          const container = evt.target.getStage()?.container();

          if (container) {
            container.style.cursor = 'default';
          }
        }}
      />
    </Group>
  );
};
