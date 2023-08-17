import React from 'react';

import { useCoverContext, useSizesContext } from 'contexts';
import { CoverImage, LabelType, PosTypes } from 'types';
import {
  AlbumCoverDrawLine,
  AlbumCoverImage,
  AlbumCoverLabel,
  AlbumCoverLabelDraggable,
} from '.';
import { DraggableGroup } from 'components';
import { Vector2d } from 'konva/lib/types';

interface CoverImageProps {
  albumCover: CoverImage;
}

export const AlbumCover: React.FC<CoverImageProps> = ({ albumCover }) => {
  const { id } = albumCover;
  const { updateCoverPosition, configs, updateCoverDir } = useCoverContext();
  const { fontSize, dragLimits, toobarIconSize, coverSize, windowSize } =
    useSizesContext();

  const handleDragEnd = ({ x, y }: Vector2d) => {
    updateCoverPosition(albumCover.id, { x, y });
  };

  const handleUpdate = (dir: PosTypes) => {
    updateCoverDir(albumCover.id, dir);
  };

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
    <DraggableGroup
      update={albumCover}
      setUpdate={handleDragEnd}
      min={{
        x: dragLimits.x,
        y: dragLimits.y,
      }}
      max={{
        x: windowSize.width - coverSize - toobarIconSize / 2,
        y: windowSize.height - coverSize - toobarIconSize / 2,
      }}>
      <AlbumCoverDrawLine id={id} />
      <AlbumCoverImage albumCover={albumCover} />

      <AlbumCoverLabelDraggable
        albumCover={albumCover}
        setUpdate={handleUpdate}
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
    </DraggableGroup>
  );
};
