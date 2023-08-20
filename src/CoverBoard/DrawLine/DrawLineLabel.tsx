import React from 'react';

import { useCoverContext, useSizesContext } from 'contexts';
import { LineParams, Lines, PosTypes } from 'types';
import { DrawLineLabelDraggable } from '.';
import { TextLabel } from 'components';
import { getAlign } from 'utils';

interface LineProps {
  line: Lines;
  open: boolean;
  setOpen: (open: boolean) => void;
  lineParams: LineParams;
}

export const DrawLineLabel: React.FC<LineProps> = ({
  line,
  lineParams,
  open,
  setOpen,
}) => {
  const { coverSize, fontSize } = useSizesContext();
  const { resetLine, updateLineDir, updateLineText, erase, editLines } =
    useCoverContext();

  const handleUpdateLabel = (text: string) => {
    updateLineText(line.id, text);
  };

  const handleUpdateDir = (dir: PosTypes) => {
    updateLineDir(line.id, dir);
  };

  const handleReset = () => {
    resetLine(line.id);
  };

  if (erase || editLines) return null;

  return (
    <DrawLineLabelDraggable
      line={line}
      lineParams={lineParams}
      setUpdate={handleUpdateDir}>
      <TextLabel
        open={open}
        setOpen={setOpen}
        label={line.text}
        onReset={handleReset}
        setLabel={handleUpdateLabel}
        pos={{
          x: -coverSize,
          y: fontSize * 1.5,
          width: coverSize * 2,
          align: getAlign(line.dir),
        }}
      />
    </DrawLineLabelDraggable>
  );
};
