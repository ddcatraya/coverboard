import React, { useState } from 'react';

import { LineParams, LineValues, Lines, PosTypes } from 'types';
import { DrawLineCircle, DrawLineLabelDraggable, DrawLinePopover } from '.';
import { TextLabel } from 'components';
import { getAlign } from 'utils';
import { useMainStore, useUtilsStore } from 'store';
import { Html } from 'react-konva-utils';
import { Group } from 'react-konva';

interface LineProps {
  id: Lines['id'];
  dir: Lines['dir'];
  lineParams: LineParams;
}

export const DrawLineLabel: React.FC<LineProps> = ({ id, dir, lineParams }) => {
  const text = useMainStore((state) => state.getLineTextById(id));
  const coverSizeWidth = useMainStore((state) => state.coverSizeWidth());
  const fontSize = useMainStore((state) => state.fontSize());
  const color = useMainStore((state) => state.getArrowColor());
  const updateLineDir = useMainStore((state) => state.updateLineDir);
  const updateLineText = useMainStore((state) => state.updateLineText);
  const editLines = useUtilsStore((state) => state.editLines);

  const [open, setOpen] = useState(false);

  const handleUpdateDir = (dir: PosTypes) => {
    updateLineDir(id, dir);
  };

  const getLabel = () => {
    if (text) {
      return text;
    } else if (editLines) {
      return '<add text>';
    }
    return '';
  };

  const handleSubmit = (values: LineValues) => {
    updateLineText(id, values.text);
    updateLineDir(id, values.dir);
  };

  return (
    <>
      <Group onDblClick={() => setOpen(true)} onDblTap={() => setOpen(true)}>
        <DrawLineLabelDraggable
          dir={dir}
          lineParams={lineParams}
          setUpdate={handleUpdateDir}>
          <TextLabel
            label={getLabel()}
            color={color}
            open={open}
            editable={false}
            setOpen={() => void 0}
            onReset={() => void 0}
            setLabel={() => void 0}
            pos={{
              x: -coverSizeWidth,
              y: fontSize * 1.5,
              width: coverSizeWidth * 2,
              align: getAlign(dir),
            }}
            wrap="word"
          />
        </DrawLineLabelDraggable>
        <DrawLineCircle id={id} />
      </Group>

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
    </>
  );
};
