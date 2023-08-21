import React, { useState } from 'react';

import { useSizesContext } from 'contexts';
import { Covers, LabelType } from 'types';
import { TextLabel } from 'components';
import { getAlign } from 'utils';
import { useMainStore, useUtilsStore } from 'store';

interface AlbumCoverLabelProps {
  albumCover: Covers;
  coverLabel: LabelType;
  offset?: number;
}

export const AlbumCoverLabel: React.FC<AlbumCoverLabelProps> = ({
  albumCover,
  coverLabel,
  offset = 0,
}) => {
  const updateCoverLabel = useMainStore((state) => state.updateCoverLabel);
  const resetCoverLabel = useMainStore((state) => state.resetCoverLabel);
  const erase = useUtilsStore((state) => state.erase);
  const editLines = useUtilsStore((state) => state.editLines);

  const { coverSize, fontSize } = useSizesContext();
  const [open, setOpen] = useState(false);

  const handleReset = () => {
    resetCoverLabel(albumCover.id, coverLabel);
  };

  if (erase || editLines) return null;

  return (
    <TextLabel
      title={coverLabel}
      hasReset
      open={open}
      setOpen={setOpen}
      editable={false}
      label={albumCover[coverLabel].text}
      onReset={handleReset}
      setLabel={(label) => {
        updateCoverLabel(albumCover.id, coverLabel, label);
      }}
      pos={{
        x: -coverSize,
        y: coverSize + fontSize / 2 + offset,
        width: coverSize * 3,
        align: getAlign(albumCover.dir),
      }}
    />
  );
};
