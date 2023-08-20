import React from 'react';

import { useCoverContext, useSizesContext } from 'contexts';
import { Covers, LabelType, PosTypes } from 'types';
import {
  AlbumCoverDrawLine,
  AlbumCoverImage,
  AlbumCoverLabel,
  AlbumCoverLabelDraggable,
  AlbumCoverDraggable,
} from '.';
import useImage from 'use-image';

interface CoverImageProps {
  albumCover: Covers;
}

export const AlbumCover: React.FC<CoverImageProps> = ({ albumCover }) => {
  const [image, status] = useImage(albumCover.link, 'anonymous');
  const { configs } = useCoverContext();
  const { fontSize, dragLimits, toobarIconSize, coverSize, windowSize } =
    useSizesContext();

  const offSet =
    configs.showArtist &&
    albumCover[LabelType.ARTIST].text &&
    configs.showAlbum &&
    albumCover[LabelType.ALBUM].text
      ? 1.5 * fontSize
      : 0;

  const offSetTop = !(
    configs.showArtist &&
    albumCover[LabelType.ARTIST].text &&
    configs.showAlbum &&
    albumCover[LabelType.ALBUM].text
  )
    ? 1.5 * fontSize
    : 0;

  if (status === 'loading') return null;

  return (
    <AlbumCoverDraggable
      albumCover={albumCover}
      min={{
        x: dragLimits.x,
        y: dragLimits.y,
      }}
      max={{
        x: windowSize.width - coverSize - toobarIconSize / 2,
        y: windowSize.height - coverSize - toobarIconSize / 2,
      }}>
      <AlbumCoverDrawLine id={albumCover.id} />
      <AlbumCoverImage albumCover={albumCover} image={image} status={status} />

      <AlbumCoverLabelDraggable
        albumCover={albumCover}
        offset={offSet}
        offSetTop={offSetTop}>
        {configs.showArtist && albumCover[LabelType.ARTIST].text && (
          <AlbumCoverLabel
            coverLabel={LabelType.ARTIST}
            albumCover={albumCover}
          />
        )}
        {configs.showAlbum && albumCover[LabelType.ALBUM].text && (
          <AlbumCoverLabel
            coverLabel={LabelType.ALBUM}
            albumCover={albumCover}
            offset={offSet}
          />
        )}
      </AlbumCoverLabelDraggable>
    </AlbumCoverDraggable>
  );
};
