import React, { useState } from 'react';

import { Covers, GroupCovers, LabelType } from 'types';
import { TextLabel } from 'components';
import { getAlign } from 'utils';
import { useMainStore, useUtilsStore } from 'store';

interface CoverLabelProps {
  id: Covers['id'] | GroupCovers['id'];
  coverLabel: LabelType;
  text: string;
  offset?: number;
  fontStyle?: 'bold';
  scaleX?: GroupCovers['scaleX'];
  scaleY?: GroupCovers['scaleY'];
}

export const CoverLabel: React.FC<CoverLabelProps> = ({
  id,
  coverLabel,
  text,
  offset = 0,
  fontStyle,
  scaleX = 1,
  scaleY = 1,
}) => {
  const dir = useMainStore((state) => state.getDirById(id));
  const updateCoverLabel = useMainStore((state) => state.updateCoverLabel);
  const resetCoverLabel = useMainStore((state) => state.resetCoverLabel);
  const erase = useUtilsStore((state) => state.erase);
  const editLines = useUtilsStore((state) => state.editLines);

  const fontSize = useMainStore((state) => state.fontSize());
  const coverSizeWidth =
    useMainStore((state) => state.coverSizeWidth()) * scaleX;
  const coverSizeHeight =
    useMainStore((state) => state.coverSizeHeight()) * scaleY;
  const [open, setOpen] = useState(false);

  const handleReset = () => {
    resetCoverLabel(id, coverLabel);
  };

  if (erase || editLines) return null;

  return (
    <TextLabel
      title={coverLabel}
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
        y: coverSizeHeight + fontSize / 2 + offset,
        width: coverSizeWidth * 3,
        align: getAlign(dir),
      }}
    />
  );
};
