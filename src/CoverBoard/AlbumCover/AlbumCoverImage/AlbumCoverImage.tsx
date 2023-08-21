import React, { useState } from 'react';
import { Image, Rect, Text } from 'react-konva';

import { useCoverContext, useSizesContext } from 'contexts';

import {
  AlbumCoverValues,
  Covers,
  LabelType,
  colorMap,
  backColorMap,
} from 'types';
import { Html, useImage } from 'react-konva-utils';
import { AlbumCoverImagePopover } from '.';
import { KonvaEventObject } from 'konva/lib/Node';

interface CoverImageProps {
  albumCover: Covers;
}

export const AlbumCoverImage: React.FC<CoverImageProps> = ({ albumCover }) => {
  const {
    erase,
    resetCoverLabel,
    removeCover,
    updateCoversText,
    editLines,
    configs,
  } = useCoverContext();
  const [image, status] = useImage(albumCover.link, 'anonymous');
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
      albumCover.id,
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
          onClick={
            !editLines ? () => handleEraseImage(albumCover.id) : undefined
          }
          onDblTap={
            !editLines ? () => handleEraseImage(albumCover.id) : undefined
          }
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
            fill={backColorMap[configs.backColor]}
            stroke={colorMap[configs.color]}
            onClick={
              !editLines ? () => handleEraseImage(albumCover.id) : undefined
            }
            onDblTap={
              !editLines ? () => handleEraseImage(albumCover.id) : undefined
            }
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
            x={0}
            y={coverSize / 2 - (fontSize * 1.2) / 2}
            width={coverSize}
            align="center"
            fill={colorMap[configs.color]}
            text={status === 'failed' ? 'Error' : 'Loading...'}
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
              resetCoverLabel(albumCover.id, LabelType.ARTIST);
              resetCoverLabel(albumCover.id, LabelType.ALBUM);
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
