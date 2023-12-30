import React, { useState } from 'react';

import { Covers, GroupCovers, PosTypes } from 'types';
import { useUtilsStore } from 'store';
import { CommonTextLabel } from '.';

interface CommonLabelProps {
  id: Covers['id'] | GroupCovers['id'];
  coverLabel: 'title' | 'subtitle';
  text: string;
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
  x: number;
  y: number;
  width: number;
}

export const CommonLabel: React.FC<CommonLabelProps> = ({
  id,
  coverLabel,
  text,
  fontStyle,
  dir,
  color,
  updateLabel,
  x,
  y,
  width,
}) => {
  const editLines = useUtilsStore((state) => state.points);
  const selected = useUtilsStore((state) => state.selected);
  const isSelected = !!selected && selected.id === id;

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
      x={x}
      y={y}
      width={width}
      dir={dir}
    />
  );
};
