import React, { useState } from 'react';

import { LineParams, Lines, PosTypes } from 'types';
import { DrawLineCircle, DrawLineLabelDraggable } from '.';
import { TextLabel } from 'components';
import { getAlign } from 'utils';
import { useMainStore, useUtilsStore } from 'store';

interface LineProps {
  id: Lines['id'];
  dir: Lines['dir'];
  lineParams: LineParams;
  isSelected: boolean;
}

export const DrawLineLabel: React.FC<LineProps> = ({
  id,
  dir,
  lineParams,
  isSelected,
}) => {
  const text = useMainStore((state) => state.getLineTextById(id));
  const coverSizeWidth = useMainStore((state) => state.coverSizeWidth());
  const fontSize = useMainStore((state) => state.fontSize());
  const color = useMainStore((state) => state.getArrowColor());
  const resetLine = useMainStore((state) => state.resetLine);
  const updateLineDir = useMainStore((state) => state.updateLineDir);
  const updateLineText = useMainStore((state) => state.updateLineText);
  const removeLine = useMainStore((state) => state.removeLine);
  const editLines = useUtilsStore((state) => state.editLines);

  const [textEdit, setTextEdit] = useState(isSelected);

  const handleUpdateLabel = (text: string) => {
    updateLineText(id, text);
  };

  const handleUpdateDir = (dir: PosTypes) => {
    updateLineDir(id, dir);
  };

  const handleReset = () => {
    resetLine(id);
  };

  const handleOpen = () => {
    setTextEdit(true);
  };

  const getLabel = () => {
    if (text) {
      return text;
    } else if (editLines) {
      return '<add text>';
    }
    return '';
  };

  return (
    <>
      <DrawLineLabelDraggable
        dir={dir}
        lineParams={lineParams}
        setUpdate={handleUpdateDir}>
        <TextLabel
          color={color}
          open={textEdit}
          setOpen={setTextEdit}
          label={getLabel()}
          onReset={handleReset}
          setLabel={handleUpdateLabel}
          pos={{
            x: -coverSizeWidth,
            y: fontSize * 1.5,
            width: coverSizeWidth * 2,
            align: getAlign(dir),
          }}
          wrap="word"
        />
      </DrawLineLabelDraggable>
      <DrawLineCircle
        id={id}
        dir={dir}
        text={text}
        handleOpen={handleOpen}
        isSelected={isSelected}
      />
    </>
  );
};
