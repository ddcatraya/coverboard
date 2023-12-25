import React, { useState } from 'react';
import { Circle, Group } from 'react-konva';
import { KonvaEventObject } from 'konva/lib/Node';

import { LineValues, Lines } from 'types';
import { useMainStore, useUtilsStore } from 'store';
import { Html } from 'react-konva-utils';
import { DrawLinePopover } from './DrawLinePopover';

interface LineProps {
  id: Lines['id'];
  text: Lines['text'];
  dir: Lines['dir'];
  handleOpen: () => void;
  isSelected: boolean;
}

export const DrawLineCircle: React.FC<LineProps> = ({
  id,
  text,
  dir,
  handleOpen,
  isSelected,
}) => {
  const circleRadius = useMainStore((state) => state.circleRadius());
  const color = useMainStore((state) => state.getArrowColor());
  const [open, setOpen] = useState(false);

  const updateLineText = useMainStore((state) => state.updateLineText);
  const updateLineDir = useMainStore((state) => state.updateLineDir);

  const handleSubmit = (values: LineValues) => {
    updateLineText(id, values.text);
    updateLineDir(id, values.dir);
  };

  return (
    <Group
      width={circleRadius * 2}
      height={circleRadius * 2}
      onMouseClick={handleOpen}
      onTap={handleOpen}
      onDblclick={() => setOpen(true)}
      onDblTap={() => setOpen(true)}>
      <Circle
        radius={isSelected ? circleRadius * 1.3 : circleRadius}
        fill={color}
        onMouseMove={(evt: KonvaEventObject<MouseEvent>) => {
          if (!isSelected) {
            evt.currentTarget.scaleX(1.3);
            evt.currentTarget.scaleY(1.3);
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
      {open && (
        <Html>
          <DrawLinePopover
            id={id}
            open={open}
            onClose={() => setOpen(false)}
            onSubmit={handleSubmit}
            values={{
              text,
              dir,
            }}
          />
        </Html>
      )}
    </Group>
  );
};
