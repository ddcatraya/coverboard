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
}

export const DrawLineLabel: React.FC<LineProps> = ({ id, dir, lineParams }) => {
  const text = useMainStore((state) => state.getLineTextById(id));
  const coverSizeWidth = useMainStore((state) => state.coverSizeWidth());
  const fontSize = useMainStore((state) => state.fontSize());

  const resetLine = useMainStore((state) => state.resetLine);
  const updateLineDir = useMainStore((state) => state.updateLineDir);
  const updateLineText = useMainStore((state) => state.updateLineText);
  const removeLine = useMainStore((state) => state.removeLine);
  const erase = useUtilsStore((state) => state.erase);
  const editLines = useUtilsStore((state) => state.editLines);

  const [textEdit, setTextEdit] = useState(false);

  const handleUpdateLabel = (text: string) => {
    updateLineText(id, text);
  };

  const handleUpdateDir = (dir: PosTypes) => {
    updateLineDir(id, dir);
  };

  const handleReset = () => {
    resetLine(id);
  };

  const handleOpen = (id: Lines['id']) => {
    if (erase) {
      removeLine(id);
      return;
    }

    setTextEdit(true);
  };

  if (erase) return null;

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
        />
      </DrawLineLabelDraggable>
      <DrawLineCircle id={id} handleOpen={handleOpen} />
    </>
  );
};
