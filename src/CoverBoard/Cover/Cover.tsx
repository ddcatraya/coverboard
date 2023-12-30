import React from 'react';

import { Covers, Elem, PosTypes } from 'types';
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
  const updateCoverLabel = useMainStore((state) => state.updateCoverLabel);
  const showStars = useMainStore((state) => state.getShowStars());
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

  const removeCoverAndRelatedLines = useMainStore(
    (state) => state.removeCoverAndRelatedLines,
  );
  const coverSizeWidth = useMainStore((state) => state.coverSizeWidth());
  const coverSizeHeight = useMainStore((state) => state.coverSizeHeight());

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

  const isSelectedModalOpen = useUtilsStore((state) =>
    state.isSelectedModalOpen({ id, elem: Elem.COVER }),
  );

  const refreshCovers = useMainStore((state) => state.refreshCovers);
  const handleSelect = () => {
    setSelected({ id, elem: Elem.COVER, open: false });
    refreshCovers(id);
  };

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
        <CommonDrawLine id={id} type={Elem.COVER} />

        <Group>
          <Group
            onClick={handleSelect}
            onTap={handleSelect}
            onDblclick={() => setSelected({ id, elem: Elem.COVER, open: true })}
            onDblTap={() => setSelected({ id, elem: Elem.COVER, open: true })}>
            <CoverLoadImage link={link} renderTime={renderTime} />
          </Group>

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
                color={color}
                x={-coverSizeWidth}
                y={coverSizeHeight + titleOffset}
                width={coverSizeWidth * 3}
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
                color={color}
                x={-coverSizeWidth}
                y={coverSizeHeight + subtitleOffset}
                width={coverSizeWidth * 3}
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
      {isSelectedModalOpen && (
        <Html>
          <CoverPopover
            id={id}
            open={isSelectedModalOpen}
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
