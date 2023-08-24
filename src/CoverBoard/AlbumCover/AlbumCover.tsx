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
import { shallow } from 'zustand/shallow';

interface CoverImageProps {
  id: Covers['id'];
  artist: Covers['artist']['text'];
  album: Covers['album']['text'];
  x: Covers['x'];
  y: Covers['y'];
  link: Covers['link'];
}

const AlbumCoverMemo: React.FC<CoverImageProps> = ({
  id,
  artist,
  album,
  x,
  y,
  link,
}) => {
  const showArtist = useMainStore((state) => state.configs.showArtist);
  const showAlbum = useMainStore((state) => state.configs.showAlbum);
  const dragLimits = useMainStore((state) => state.dragLimits(), shallow);
  const fontSize = useMainStore((state) => state.fontSize());
  const toobarIconSize = useMainStore((state) => state.toobarIconSize());
  const windowSize = useMainStore((state) => state.windowSize);

  const offSet =
    showArtist && artist && showAlbum && album ? 1.5 * fontSize : 0;

  const offSetTop = !(showArtist && artist && showAlbum && album)
    ? 1.5 * fontSize
    : 0;

  return (
    <AlbumCoverDraggable
      id={id}
      x={x}
      y={y}
      min={{
        x: dragLimits.x,
        y: dragLimits.y,
      }}
      max={{
        x: windowSize.width - 3.5 * toobarIconSize,
        y: windowSize.height - 3.5 * toobarIconSize,
      }}>
      <AlbumCoverDrawLine id={id} />
      <AlbumCoverImage id={id} artist={artist} album={album} link={link} />

      <AlbumCoverLabelDraggable
        id={id}
        x={x}
        y={y}
        offset={offSet}
        offSetTop={offSetTop}>
        {showArtist && artist && (
          <AlbumCoverLabel
            coverLabel={LabelType.ARTIST}
            text={artist}
            id={id}
          />
        )}
        {showAlbum && album && (
          <AlbumCoverLabel
            coverLabel={LabelType.ALBUM}
            text={album}
            id={id}
            offset={offSet}
          />
        )}
      </AlbumCoverLabelDraggable>
    </AlbumCoverDraggable>
  );
};

export const AlbumCover = React.memo(AlbumCoverMemo);
