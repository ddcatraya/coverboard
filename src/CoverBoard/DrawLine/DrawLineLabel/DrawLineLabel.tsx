import React from 'react';

import { Elem, LineParams, Lines, PosTypes } from 'types';
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

  const isSelected = useUtilsStore((state) =>
    state.isSelected({ id, elem: Elem.ARROW }),
  );
  const isSelectedModalOpen = useUtilsStore((state) =>
    state.isSelectedModalOpen({ id, elem: Elem.ARROW }),
  );

  const getLabel = () => {
    if (text) {
      return text;
    } else if (editLines) {
      return '<add text>';
    }
    return '';
  };

  const handleUpdateDir = (dir: PosTypes) => {
    updateLineDir(id, dir);
  };

  return (
    <>
      <Group>
        <DrawLineLabelDraggable
          dir={dir}
          lineParams={lineParams}
          setUpdate={handleUpdateDir}>
          <TextLabel
            label={getLabel()}
            color={color}
            open={isSelected}
            editable={true}
            setOpen={() => void 0}
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
