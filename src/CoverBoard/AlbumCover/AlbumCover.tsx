import React from 'react';

import { Covers, LabelType } from 'types';
import {
  AlbumCoverDrawLine,
  AlbumCoverImage,
  AlbumCoverLabel,
  AlbumCoverLabelDraggable,
  AlbumCoverDraggable,
} from '.';
import { useMainStore } from 'store';

interface CoverImageProps {
  albumCover: Covers;
}

export const AlbumCover: React.FC<CoverImageProps> = ({ albumCover }) => {
  const configs = useMainStore((state) => state.configs);

  const dragLimits = useMainStore((state) => state.dragLimits());
  const fontSize = useMainStore((state) => state.fontSize());
  const toobarIconSize = useMainStore((state) => state.toobarIconSize());
  const coverSize = useMainStore((state) => state.coverSize());
  const windowSize = useMainStore((state) => state.windowSize);

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
      <AlbumCoverImage albumCover={albumCover} />

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
