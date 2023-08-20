import React, { useState } from 'react';
import { Image, Rect, Text } from 'react-konva';
import useImage from 'use-image';

import { useCoverContext, useSizesContext } from 'contexts';

import {
  AlbumCoverValues,
  Covers,
  LabelType,
  backColorMap,
  colorMap,
} from 'types';
import { Html } from 'react-konva-utils';
import { AlbumCoverImagePopover } from '.';
import { KonvaEventObject } from 'konva/lib/Node';

interface CoverImageProps {
  albumCover: Covers;
  image: HTMLImageElement | undefined;
  status: 'loaded' | 'loading' | 'failed';
}

export const AlbumCoverImage: React.FC<CoverImageProps> = ({
  albumCover,
  image,
  status,
}) => {
  const { id } = albumCover;
  const {
    erase,
    resetCoverLabel,
    removeCover,
    updateCoversText,
    editLines,
    configs,
  } = useCoverContext();
  const { coverSize, fontSize } = useSizesContext();
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
      values[LabelType.ARTIST].text.trim(),
      values[LabelType.ALBUM].text.trim(),
    );
  };

  return (
    <>
      {status === 'loaded' && image ? (
        <Image
          image={image}
          width={coverSize}
          height={coverSize}
          onClick={!editLines ? () => handleEraseImage(id) : undefined}
          onDblTap={!editLines ? () => handleEraseImage(id) : undefined}
          onMouseMove={(evt: KonvaEventObject<MouseEvent>) => {
            if (!editLines) {
              evt.currentTarget.opacity(0.5);
            }
          }}
          onMouseLeave={(evt: KonvaEventObject<MouseEvent>) => {
            evt.currentTarget.opacity(1);
          }}
        />
      ) : (
        <>
          <Rect
            width={coverSize}
            height={coverSize}
            fill={colorMap[configs.color]}
            onClick={!editLines ? () => handleEraseImage(id) : undefined}
            onDblTap={!editLines ? () => handleEraseImage(id) : undefined}
            onMouseMove={(evt: KonvaEventObject<MouseEvent>) => {
              if (!editLines) {
                evt.currentTarget.opacity(0.5);
              }
            }}
            onMouseLeave={(evt: KonvaEventObject<MouseEvent>) => {
              evt.currentTarget.opacity(1);
            }}
          />
          <Text
            fontSize={fontSize * 1.2}
            x={coverSize / 4}
            y={coverSize / 2 - (fontSize * 1.2) / 2}
            width={coverSize / 2}
            align="center"
            fill={backColorMap[configs.backColor]}
            text="Error"
          />
        </>
      )}
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
