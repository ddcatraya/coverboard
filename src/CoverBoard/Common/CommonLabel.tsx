import React, { useState } from 'react';

import { Covers, GroupCovers, PosTypes } from 'types';
import { TextLabel } from 'components';
import { getAlign } from 'utils';
import { useMainStore, useUtilsStore } from 'store';

interface CommonLabelProps {
  id: Covers['id'] | GroupCovers['id'];
  coverLabel: 'title' | 'subtitle';
  text: string;
  offset?: number;
  fontStyle?: 'bold';
  scaleX?: GroupCovers['scaleX'];
  scaleY?: GroupCovers['scaleY'];
  dir: PosTypes;
  color: string;
}

export const CommonLabel: React.FC<CommonLabelProps> = ({
  id,
  coverLabel,
  text,
  offset = 0,
  fontStyle,
  scaleX = 1,
  scaleY = 1,
  dir,
  color,
}) => {
  const updateCoverLabel = useMainStore((state) => state.updateCoverLabel);
  const resetCoverLabel = useMainStore((state) => state.resetCoverLabel);
  const editLines = useUtilsStore((state) => state.editLines);
  console.log(editLines);

  const coverSizeWidth =
    useMainStore((state) => state.coverSizeWidth()) * scaleX;
  const coverSizeHeight =
    useMainStore((state) => state.coverSizeHeight()) * scaleY;
  const [open, setOpen] = useState(false);

  const handleReset = () => {
    resetCoverLabel(id, coverLabel);
  };

  if (editLines) return null;

  return (
    <TextLabel
      title={coverLabel}
      color={color}
      fontStyle={fontStyle}
      hasReset
      open={open}
      setOpen={setOpen}
      editable={false}
      label={text}
      onReset={handleReset}
      setLabel={(label) => {
        updateCoverLabel(id, coverLabel, label);
      }}
      pos={{
        x: -coverSizeWidth,
        y: coverSizeHeight + offset,
        width: coverSizeWidth * 3,
        align: getAlign(dir),
      }}
    />
  );
};
