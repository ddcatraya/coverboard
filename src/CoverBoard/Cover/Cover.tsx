import React from 'react';

import { Covers, LabelType } from 'types';
import {
  CoverDrawLine,
  CoverImage,
  CoverLabel,
  CoverLabelDraggable,
  CoverDraggable,
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

const CoverMemo: React.FC<CoverImageProps> = ({
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
    <CoverDraggable
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
      <CoverDrawLine id={id} />
      <CoverImage id={id} title={title} subtitle={subtitle} link={link} />

      <CoverLabelDraggable
        id={id}
        x={x}
        y={y}
        offset={offSet}
        offSetTop={offSetTop}>
        {showTitle && title && (
          <CoverLabel coverLabel={LabelType.TITLE} text={title} id={id} />
        )}
        {showSubtitle && subtitle && (
          <CoverLabel
            coverLabel={LabelType.SUBTITLE}
            text={subtitle}
            id={id}
            offset={offSet}
          />
        )}
      </CoverLabelDraggable>
    </CoverDraggable>
  );
};

export const Cover = React.memo(CoverMemo);
