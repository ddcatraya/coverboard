import React from 'react';

import { LineParams, Lines, PosTypes } from 'types';
import { DrawLineLabelDraggable } from '.';
import { TextLabel } from 'components';
import { getAlign } from 'utils';
import { useMainStore, useUtilsStore } from 'store';

interface LineProps {
  id: Lines['id'];
  text: Lines['text'];
  dir: Lines['dir'];
  open: boolean;
  setOpen: (open: boolean) => void;
  lineParams: LineParams;
}

export const DrawLineLabel: React.FC<LineProps> = ({
  id,
  text,
  dir,
  lineParams,
  open,
  setOpen,
}) => {
  const coverSize = useMainStore((state) => state.coverSize());
  const fontSize = useMainStore((state) => state.fontSize());

  const resetLine = useMainStore((state) => state.resetLine);
  const updateLineDir = useMainStore((state) => state.updateLineDir);
  const updateLineText = useMainStore((state) => state.updateLineText);
  const erase = useUtilsStore((state) => state.erase);
  const editLines = useUtilsStore((state) => state.editLines);

  const handleUpdateLabel = (text: string) => {
    updateLineText(id, text);
  };

  const handleUpdateDir = (dir: PosTypes) => {
    updateLineDir(id, dir);
  };

  const handleReset = () => {
    resetLine(id);
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
    <DrawLineLabelDraggable
      dir={dir}
      lineParams={lineParams}
      setUpdate={handleUpdateDir}>
      <TextLabel
        open={open}
        setOpen={setOpen}
        label={getLabel()}
        onReset={handleReset}
        setLabel={handleUpdateLabel}
        pos={{
          x: -coverSize,
          y: fontSize * 1.5,
          width: coverSize * 2,
          align: getAlign(dir),
        }}
      />
    </DrawLineLabelDraggable>
  );
};
