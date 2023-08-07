import React, { useState } from 'react';

import { useCoverContext, useSizesContext } from 'contexts';
import { CoverImage, LabelType } from 'types';
import { TextLabel } from 'components';
import { getAlign } from 'utils';

interface AlbumCoverLabelProps {
  albumCover: CoverImage;
  coverLabel: LabelType;
  offset?: number;
}

export const AlbumCoverLabel: React.FC<AlbumCoverLabelProps> = ({
  albumCover,
  coverLabel,
  offset = 0,
}) => {
  const { updateCoverLabel, erase, editLines, resetCoverLabel } =
    useCoverContext();
  const { coverSize, fontSize } = useSizesContext();
  const [open, setOpen] = useState(false);

  const handleReset = () => {
    resetCoverLabel(albumCover.id, coverLabel);
  };

  if (erase || editLines) return null;

  return (
    <TextLabel
      hasReset
      open={open}
      setOpen={setOpen}
      label={albumCover[coverLabel].text}
      onReset={handleReset}
      setLabel={(label) => {
        updateCoverLabel(albumCover.id, coverLabel, label);
      }}
      pos={{
        x: -coverSize / 2,
        y: coverSize + fontSize / 2 + offset,
        width: coverSize * 2,
        align: getAlign(albumCover.dir),
      }}
    />
  );
};
