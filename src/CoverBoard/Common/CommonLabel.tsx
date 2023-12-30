import React, { useState } from 'react';

import { Covers, GroupCovers, PosTypes } from 'types';
import { useMainStore, useUtilsStore } from 'store';
import { CommonTextLabel } from '.';

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
  updateLabel: (
    coverId: string,
    coverLabel: 'title' | 'subtitle',
    label: string,
  ) => void;
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
  updateLabel,
}) => {
  const editLines = useUtilsStore((state) => state.points);
  const selected = useUtilsStore((state) => state.selected);
  const isSelected = !!selected && selected.id === id;

  const coverSizeWidth = useMainStore((state) => state.coverSizeWidth());
  const coverSizeHeight = useMainStore((state) => state.coverSizeHeight());
  const [open, setOpen] = useState(false);

  if (editLines || isSelected) return null;

  return (
    <CommonTextLabel
      title={coverLabel}
      color={color}
      fontStyle={fontStyle}
      hasReset
      open={open}
      setOpen={setOpen}
      editable={false}
      label={text}
      onReset={() => void 0}
      setLabel={(label) => {
        updateLabel(id, coverLabel, label);
      }}
      x={-coverSizeWidth * scaleX}
      y={coverSizeHeight * scaleY + offset}
      width={coverSizeWidth * scaleX * 3}
      dir={dir}
    />
  );
};
