import React from 'react';

import { Elem, LineParams, LineValues, Lines, PosTypes } from 'types';
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
  const editLines = useUtilsStore((state) => state.points);

  const setSelected = useUtilsStore((state) => state.setSelected);
  const isSelected = useUtilsStore((state) =>
    state.isSelected({ id, elem: Elem.ARROW }),
  );
  const isSelectedModalOpen = useUtilsStore((state) =>
    state.isSelectedModalOpen({ id, elem: Elem.ARROW }),
  );

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
      <Group
        onDblClick={() => setSelected({ id, elem: Elem.ARROW, open: true })}
        onDblTap={() => setSelected({ id, elem: Elem.ARROW, open: true })}>
        <DrawLineLabelDraggable
          dir={dir}
          lineParams={lineParams}
          setUpdate={handleUpdateDir}>
          <TextLabel
            label={getLabel()}
            color={color}
            open={isSelected}
            editable={true}
            setOpen={() => setSelected(null)}
            onReset={() => void 0}
            setLabel={(text) => updateLineText(id, text)}
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

      {isSelectedModalOpen && (
        <Html>
          <DrawLinePopover
            id={id}
            open={isSelectedModalOpen}
            onClose={() => setSelected({ id, elem: Elem.ARROW, open: false })}
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
