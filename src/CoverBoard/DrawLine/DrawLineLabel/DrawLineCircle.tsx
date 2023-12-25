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
}

export const DrawLineCircle: React.FC<LineProps> = ({
  id,
  text,
  dir,
  handleOpen,
}) => {
  const circleRadius = useMainStore((state) => state.circleRadius());
  const color = useMainStore((state) => state.getArrowColor());
  const erase = useUtilsStore((state) => state.erase);
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
        radius={circleRadius}
        fill={color}
        onMouseMove={(evt: KonvaEventObject<MouseEvent>) => {
          evt.currentTarget.scaleX(1.3);
          evt.currentTarget.scaleY(1.3);

          const container = evt.target.getStage()?.container();
          if (container && !erase) {
            container.style.cursor = 'pointer';
          } else if (container && erase) {
            container.style.cursor = 'not-allowed';
          }
        }}
        onMouseLeave={(evt: KonvaEventObject<MouseEvent>) => {
          evt.currentTarget.scaleX(1);
          evt.currentTarget.scaleY(1);

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
