import React, { useState } from 'react';

import { Covers, GroupCovers, PosTypes } from 'types';
import { useMainStore, useUtilsStore } from 'store';
import { CommonTextLabel } from 'CoverBoard/Common';

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

export const GroupLabel: React.FC<CommonLabelProps> = ({
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
  const coverSizeWidth = useMainStore((state) => state.coverSizeWidth());
  const coverSizeHeight = useMainStore((state) => state.coverSizeHeight());
  const isSelected = !!selected && selected.id === id;

  const [open, setOpen] = useState(false);

  if (editLines || isSelected) return null;

  const getPositon = () => {
    if (dir === PosTypes.TOP || dir === PosTypes.BOTTOM) {
      return 0;
    } else if (dir === PosTypes.RIGHT) {
      return -coverSizeWidth * scaleX;
    }
    return coverSizeWidth * scaleX;
  };

  return (
    <CommonTextLabel
      title={coverLabel}
      color={color}
      fontStyle={fontStyle}
      hasReset
      open={open}
      setOpen={setOpen}
      editable={true}
      label={text}
      onReset={() => void 0}
      setLabel={(label) => {
        updateLabel(id, coverLabel, label);
      }}
      x={getPositon()}
      y={coverSizeHeight * scaleY + offset}
      dir={dir}
      width={coverSizeWidth * 3}
    />
  );
};
