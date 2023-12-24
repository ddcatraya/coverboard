import React, { useState } from 'react';

import { Covers, LabelType } from 'types';
import { TextLabel } from 'components';
import { getAlign } from 'utils';
import { useMainStore, useUtilsStore } from 'store';

interface CoverLabelProps {
  id: Covers['id'];
  coverLabel: LabelType;
  text: string;
  offset?: number;
  fontStyle?: 'bold';
}

export const CoverLabel: React.FC<CoverLabelProps> = ({
  id,
  coverLabel,
  text,
  offset = 0,
  fontStyle,
}) => {
  const dir = useMainStore((state) => state.getDirById(id));
  const updateCoverLabel = useMainStore((state) => state.updateCoverLabel);
  const resetCoverLabel = useMainStore((state) => state.resetCoverLabel);
  const erase = useUtilsStore((state) => state.erase);
  const editLines = useUtilsStore((state) => state.editLines);

  const fontSize = useMainStore((state) => state.fontSize());
  const coverSizeWidth = useMainStore((state) => state.coverSizeWidth());
  const coverSizeHeight = useMainStore((state) => state.coverSizeHeight());
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
