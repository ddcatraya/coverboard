import React from 'react';

import { useSizesContext } from 'contexts';
import { LineParams, Lines, PosTypes } from 'types';
import { DrawLineLabelDraggable } from '.';
import { TextLabel } from 'components';
import { getAlign } from 'utils';
import { useMainStore, useUtilsStore } from 'store';

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

  const resetLine = useMainStore((state) => state.resetLine);
  const updateLineDir = useMainStore((state) => state.updateLineDir);
  const updateLineText = useMainStore((state) => state.updateLineText);
  const erase = useUtilsStore((state) => state.erase);
  const editLines = useUtilsStore((state) => state.editLines);

  const handleUpdateLabel = (text: string) => {
    updateLineText(line.id, text);
  };

  const handleUpdateDir = (dir: PosTypes) => {
    updateLineDir(line.id, dir);
  };

  const handleReset = () => {
    resetLine(line.id);
  };

  if (erase) return null;

  const getLabel = () => {
    if (line.text) {
      return line.text;
    } else if (editLines) {
      return '<add text>';
    }
    return '';
  };

  return (
    <DrawLineLabelDraggable
      line={line}
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
          align: getAlign(line.dir),
        }}
      />
    </DrawLineLabelDraggable>
  );
};
