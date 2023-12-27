import React, { useEffect, useState } from 'react';

import { Covers, CoverValues, PosTypes } from 'types';
import { CoverPopover, CoverLoadImage, CoverStar, CoverStarDraggable } from '.';
import {
  CommonDraggable,
  CommonDrawLine,
  CommonLabelDraggable,
  CommonLabel,
} from 'CoverBoard/Common';
import { useMainStore, useUtilsStore } from 'store';
import { shallow } from 'zustand/shallow';
import { Html } from 'react-konva-utils';
import { Group } from 'react-konva';

interface CoverImageProps {
  id: Covers['id'];
  title: string;
  subtitle: string;
  x: Covers['x'];
  y: Covers['y'];
  titleDir: PosTypes;
  subTitleDir: PosTypes;
  starDir: PosTypes;
  link: Covers['link'];
  renderTime: number;
}

const CoverMemo: React.FC<CoverImageProps> = ({
  id,
  title,
  subtitle,
  x,
  y,
  titleDir,
  subTitleDir,
  starDir,
  link,
  renderTime,
}) => {
  const color = useMainStore((state) => state.getCoverColor());
  const showTitle = useMainStore((state) => state.configs.showTitle);
  const showSubtitle = useMainStore((state) => state.configs.showSubtitle);
  const dragLimits = useMainStore((state) => state.dragLimits(), shallow);
  const fontSize = useMainStore((state) => state.fontSize());
  const toobarIconSize = useMainStore((state) => state.toobarIconSize());
  const windowSize = useMainStore((state) => state.windowSize);
  const [open, setOpen] = useState(false);
  const resetCoverLabel = useMainStore((state) => state.resetCoverLabel);
  const updateCoversText = useMainStore((state) => state.updateCoversText);
  const updateCoverLabel = useMainStore((state) => state.updateCoverLabel);
  const showStars = useMainStore((state) => state.getShowStars());
  const updateStarCount = useMainStore((state) => state.updateStarCount);
  const setSelected = useUtilsStore((state) => state.setSelected);
  const updateCoverPosition = useMainStore(
    (state) => state.updateCoverPosition,
  );
  const updateCoverTitleDir = useMainStore(
    (state) => state.updateCoverTitleDir,
  );
  const updateCoverSubtitleDir = useMainStore(
    (state) => state.updateCoverSubtitleDir,
  );
  const updateCoverStarDir = useMainStore((state) => state.updateCoverStarDir);
  const removeCoverAndRelatedLines = useMainStore(
    (state) => state.removeCoverAndRelatedLines,
  );

  const handleSubmit = (
    values: CoverValues,
    rating: number,
    currentStarDir: PosTypes,
  ) => {
    updateCoversText(id, values.title.trim(), values.subtitle.trim());
    updateCoverTitleDir(id, values.subTitleDir);
    updateCoverSubtitleDir(id, values.subTitleDir);
    updateCoverStarDir(id, currentStarDir);
    updateStarCount(id, rating);
    setSelected(null);
  };

  let titleOffset = 0;
  let subtitleOffset = 0;
  let starOffset = 0;

  if (
    title &&
    showTitle &&
    subtitle &&
    showSubtitle &&
    titleDir === subTitleDir &&
    showStars &&
    starDir === titleDir
  ) {
    titleOffset = titleDir === PosTypes.TOP ? -fontSize * 1.5 * 2 : -fontSize;
    titleOffset = titleDir === PosTypes.BOTTOM ? 0 : titleOffset;
    subtitleOffset = titleOffset + fontSize * 1.5;
    starOffset = subtitleOffset + fontSize * 1.5;
  } else if (
    title &&
    showTitle &&
    subtitle &&
    showSubtitle &&
    titleDir === subTitleDir &&
    (!showStars || starDir !== titleDir)
  ) {
    titleOffset = titleDir === PosTypes.TOP ? -fontSize * 1.5 : 0;
    subtitleOffset = titleOffset + fontSize * 1.5;
  } else if (
    title &&
    showTitle &&
    showStars &&
    starDir === titleDir &&
    (!subtitle || !showSubtitle || titleDir !== subTitleDir)
  ) {
    titleOffset = starDir === PosTypes.TOP ? -fontSize * 1.5 : 0;
    starOffset = titleOffset + fontSize * 1.5;
  } else if (
    subtitle &&
    showSubtitle &&
    showStars &&
    starDir === subTitleDir &&
    (!title || !showTitle || titleDir !== subTitleDir)
  ) {
    subtitleOffset = starDir === PosTypes.TOP ? -fontSize * 1.5 : 0;
    starOffset = subtitleOffset + fontSize * 1.5;
  }

  const selected = useUtilsStore((state) => state.selected);
  const isSelected = !!selected && selected.id === id;

  useEffect(() => {
    if (!isSelected) return;

    const keyFn = (e) => {
      if (e.key === 'Enter') {
        setOpen(true);
        e.preventDefault();
      }
    };
    document.addEventListener('keydown', keyFn);

    return () => document.removeEventListener('keydown', keyFn);
  }, [isSelected, setSelected]);

  return (
    <>
      <CommonDraggable
        updatePosition={updateCoverPosition}
        onDelete={removeCoverAndRelatedLines}
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
        <CommonDrawLine id={id} />

        <Group onDblclick={() => setOpen(true)} onDblTap={() => setOpen(true)}>
          <CoverLoadImage link={link} renderTime={renderTime} />

          {showTitle && title && (
            <CommonLabelDraggable
              updateDir={updateCoverTitleDir}
              id={id}
              x={x}
              y={y}
              dir={titleDir}>
              <CommonLabel
                updateLabel={updateCoverLabel}
                dir={titleDir}
                coverLabel="title"
                text={title}
                id={id}
                fontStyle="bold"
                offset={titleOffset}
                color={color}
              />
            </CommonLabelDraggable>
          )}

          {showSubtitle && subtitle && (
            <CommonLabelDraggable
              updateDir={updateCoverSubtitleDir}
              id={id}
              x={x}
              y={y}
              dir={subTitleDir}>
              <CommonLabel
                updateLabel={updateCoverLabel}
                dir={subTitleDir}
                coverLabel="subtitle"
                text={subtitle}
                id={id}
                offset={subtitleOffset}
                color={color}
              />
            </CommonLabelDraggable>
          )}

          {showStars && (
            <CoverStarDraggable id={id} x={x} y={y}>
              <CoverStar id={id} offset={starOffset} />
            </CoverStarDraggable>
          )}
        </Group>
      </CommonDraggable>
      {open && (
        <Html>
          <CoverPopover
            id={id}
            open={open}
            onClose={() => setOpen(false)}
            onSubmit={handleSubmit}
            onReset={() => {
              resetCoverLabel(id, 'title');
              resetCoverLabel(id, 'subtitle');
            }}
            values={{
              title,
              subtitle,
              titleDir,
              subTitleDir,
            }}
          />
        </Html>
      )}
    </>
  );
};

export const Cover = React.memo(CoverMemo);
