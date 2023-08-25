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
  title: string;
  subtitle: string;
  x: Covers['x'];
  y: Covers['y'];
  link: Covers['link'];
}

const AlbumCoverMemo: React.FC<CoverImageProps> = ({
  id,
  title,
  subtitle,
  x,
  y,
  link,
}) => {
  const showTitle = useMainStore((state) => state.configs.showTitle);
  const showSubtitle = useMainStore((state) => state.configs.showSubtitle);
  const dragLimits = useMainStore((state) => state.dragLimits(), shallow);
  const fontSize = useMainStore((state) => state.fontSize());
  const toobarIconSize = useMainStore((state) => state.toobarIconSize());
  const windowSize = useMainStore((state) => state.windowSize);

  const offSet =
    showTitle && title && showSubtitle && subtitle ? 1.5 * fontSize : 0;

  const offSetTop = !(showTitle && title && showSubtitle && subtitle)
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
      <AlbumCoverImage id={id} title={title} subtitle={subtitle} link={link} />

      <AlbumCoverLabelDraggable
        id={id}
        x={x}
        y={y}
        offset={offSet}
        offSetTop={offSetTop}>
        {showTitle && title && (
          <AlbumCoverLabel coverLabel={LabelType.TITLE} text={title} id={id} />
        )}
        {showSubtitle && subtitle && (
          <AlbumCoverLabel
            coverLabel={LabelType.SUBTITLE}
            text={subtitle}
            id={id}
            offset={offSet}
          />
        )}
      </AlbumCoverLabelDraggable>
    </AlbumCoverDraggable>
  );
};

export const AlbumCover = React.memo(AlbumCoverMemo);
