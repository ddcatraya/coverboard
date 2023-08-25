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
}

export const CoverLabel: React.FC<CoverLabelProps> = ({
  id,
  coverLabel,
  text,
  offset = 0,
}) => {
  const dir = useMainStore((state) => state.getDirById(id));
  const updateCoverLabel = useMainStore((state) => state.updateCoverLabel);
  const resetCoverLabel = useMainStore((state) => state.resetCoverLabel);
  const erase = useUtilsStore((state) => state.erase);
  const editLines = useUtilsStore((state) => state.editLines);

  const fontSize = useMainStore((state) => state.fontSize());
  const coverSize = useMainStore((state) => state.coverSize());
  const [open, setOpen] = useState(false);

  const handleReset = () => {
    resetCoverLabel(id, coverLabel);
  };

  if (erase || editLines) return null;

  return (
    <TextLabel
      title={coverLabel}
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
        x: -coverSize,
        y: coverSize + fontSize / 2 + offset,
        width: coverSize * 3,
        align: getAlign(dir),
      }}
    />
  );
};
