import React, { useState } from 'react';
import { Image, Rect, Text } from 'react-konva';

import { AlbumCoverValues, Covers, LabelType } from 'types';
import { Html, useImage } from 'react-konva-utils';
import { AlbumCoverImagePopover } from '.';
import { KonvaEventObject } from 'konva/lib/Node';
import { useMainStore, useUtilsStore } from 'store';

interface CoverImageProps {
  id: Covers['id'];
  artist: Covers['artist']['text'];
  album: Covers['album']['text'];
  link: Covers['link'];
}

export const AlbumCoverImage: React.FC<CoverImageProps> = ({
  id,
  artist,
  album,
  link,
}) => {
  const resetCoverLabel = useMainStore((state) => state.resetCoverLabel);
  const removeCover = useMainStore((state) => state.removeCover);
  const removeLinesWithCover = useMainStore(
    (state) => state.removeLinesWithCover,
  );
  const updateCoversText = useMainStore((state) => state.updateCoversText);
  const color = useMainStore((state) => state.getColor());
  const backColor = useMainStore((state) => state.getBackColor());
  const editLines = useUtilsStore((state) => state.editLines);
  const erase = useUtilsStore((state) => state.erase);

  const coverSize = useMainStore((state) => state.configs.size);
  const fontSize = useMainStore((state) => state.fontSize());

  const [image, status] = useImage(link, 'anonymous');
  const [open, setOpen] = useState(false);

  const handleEraseImage = (id: string) => {
    if (erase) {
      removeCover(id);
      removeLinesWithCover(id);
      return;
    }

    setOpen(true);
  };

  const handleSubmit = (values: AlbumCoverValues) => {
    updateCoversText(
      id,
      values[LabelType.ARTIST].trim(),
      values[LabelType.ALBUM].trim(),
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
            fill={backColor}
            stroke={color}
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
            x={0}
            y={coverSize / 2 - (fontSize * 1.2) / 2}
            width={coverSize}
            align="center"
            fill={color}
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
              resetCoverLabel(id, LabelType.ARTIST);
              resetCoverLabel(id, LabelType.ALBUM);
            }}
            values={{
              artist,
              album,
            }}
          />
        </Html>
      )}
    </>
  );
};
