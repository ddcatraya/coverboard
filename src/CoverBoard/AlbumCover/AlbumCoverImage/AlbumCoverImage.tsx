import React, { useState } from 'react';
import { Image } from 'react-konva';
import useImage from 'use-image';

import { useCoverContext, useSizesContext } from 'contexts';

import { AlbumCoverValues, CoverImage, LabelType } from 'types';
import { Html } from 'react-konva-utils';
import { AlbumCoverImagePopover } from '.';

interface CoverImageProps {
  albumCover: CoverImage;
}

export const AlbumCoverImage: React.FC<CoverImageProps> = ({ albumCover }) => {
  const { id, link } = albumCover;
  const [image] = useImage(link, 'anonymous');
  const { erase, resetCoverLabel, removeCover, updateCoversText } =
    useCoverContext();
  const { coverSize } = useSizesContext();
  const [open, setOpen] = useState(false);

  const handleEraseImage = (id: string) => {
    if (erase) {
      removeCover(id);
      return;
    }

    setOpen(true);
  };

  const handleSubmit = (values: AlbumCoverValues) => {
    updateCoversText(
      values[LabelType.ARTIST].text,
      values[LabelType.ALBUM].text,
    );
  };

  return (
    <>
      <Image
        image={image}
        width={coverSize}
        height={coverSize}
        onClick={() => handleEraseImage(id)}
        onDblTap={() => handleEraseImage(id)}
      />
      {open && (
        <Html>
          <AlbumCoverImagePopover
            open={open}
            onClose={() => setOpen(false)}
            onSubmit={handleSubmit}
            onReset={() => {
              resetCoverLabel(id, LabelType.ARTIST);
              resetCoverLabel(id, LabelType.ALBUM);
            }}
            values={{
              [LabelType.ARTIST]: albumCover[LabelType.ARTIST],
              [LabelType.ALBUM]: albumCover[LabelType.ALBUM],
            }}
          />
        </Html>
      )}
    </>
  );
};
