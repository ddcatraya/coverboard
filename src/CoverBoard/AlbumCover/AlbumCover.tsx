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
  dir: Covers['dir'];
}

const AlbumCoverMemo: React.FC<CoverImageProps> = ({
  id,
  artist,
  album,
  x,
  y,
  link,
  dir,
}) => {
  const configs = useMainStore((state) => state.configs);
  console.log('album render', id);

  const dragLimits = useMainStore((state) => state.dragLimits(), shallow);
  const fontSize = useMainStore((state) => state.fontSize());
  const toobarIconSize = useMainStore((state) => state.toobarIconSize());
  const coverSize = useMainStore((state) => state.coverSize());
  const windowSize = useMainStore((state) => state.windowSize, shallow);

  const offSet =
    configs.showArtist && artist && configs.showAlbum && album
      ? 1.5 * fontSize
      : 0;

  const offSetTop = !(
    configs.showArtist &&
    artist &&
    configs.showAlbum &&
    album
  )
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
        x: windowSize.width - coverSize - toobarIconSize / 2,
        y: windowSize.height - coverSize - toobarIconSize / 2,
      }}>
      <AlbumCoverDrawLine id={id} />
      <AlbumCoverImage id={id} artist={artist} album={album} link={link} />

      <AlbumCoverLabelDraggable
        id={dir}
        x={x}
        y={y}
        dir={dir}
        offset={offSet}
        offSetTop={offSetTop}>
        {configs.showArtist && artist && (
          <AlbumCoverLabel
            coverLabel={LabelType.ARTIST}
            text={artist}
            id={id}
            dir={dir}
          />
        )}
        {configs.showAlbum && album && (
          <AlbumCoverLabel
            coverLabel={LabelType.ALBUM}
            text={album}
            id={id}
            dir={dir}
            offset={offSet}
          />
        )}
      </AlbumCoverLabelDraggable>
    </AlbumCoverDraggable>
  );
};

export const AlbumCover = React.memo(AlbumCoverMemo);
