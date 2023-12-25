import React, { useState } from 'react';

import { Covers, CoverValues, LabelType, PosTypes } from 'types';
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
  dir: Covers['dir'];
  starDir: Covers['starDir'];
  link: Covers['link'];
  renderTime: number;
}

const getStarOffset = (
  dir: Covers['dir'],
  starDir: Covers['starDir'],
  offSet: number,
  offSetTop: number,
  circleRadius: number,
) => {
  if (dir !== starDir) {
    return 0;
  } else if (dir === PosTypes.TOP && starDir === PosTypes.TOP) {
    return -offSet - circleRadius * 3.5;
  } else if (starDir === PosTypes.LEFT || starDir === PosTypes.RIGHT) {
    return offSet + offSetTop + circleRadius * 2.5;
  }
  return offSet + circleRadius * 3;
};

const CoverMemo: React.FC<CoverImageProps> = ({
  id,
  title,
  subtitle,
  x,
  y,
  dir,
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
  const editLines = useUtilsStore((state) => state.editLines);
  const erase = useUtilsStore((state) => state.erase);
  const starRadius = useMainStore((state) => state.starRadius());
  const showStars = useMainStore((state) => state.getShowStars());
  const updateStarCount = useMainStore((state) => state.updateStarCount);
  const updateCoverPosition = useMainStore(
    (state) => state.updateCoverPosition,
  );
  const updateCoverDir = useMainStore((state) => state.updateCoverDir);

  const handleSubmit = (values: CoverValues, rating: number) => {
    updateCoversText(
      id,
      values[LabelType.TITLE].trim(),
      values[LabelType.SUBTITLE].trim(),
    );
    updateStarCount(id, rating);
  };

  const offSet =
    showTitle && title && showSubtitle && subtitle ? 1.5 * fontSize : 0;

  const offSetTop = !(showTitle && title && showSubtitle && subtitle)
    ? 1.5 * fontSize
    : 0;

  const canOpenPopover = !editLines && !erase;

  const starOffset = getStarOffset(dir, starDir, offSet, offSetTop, starRadius);
  return (
    <>
      <CommonDraggable
        updatePosition={updateCoverPosition}
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

        <Group
          onDblclick={canOpenPopover ? () => setOpen(true) : undefined}
          onDblTap={canOpenPopover ? () => setOpen(true) : undefined}>
          <CoverLoadImage id={id} link={link} renderTime={renderTime} />

          <CommonLabelDraggable
            updateDir={updateCoverDir}
            id={id}
            x={x}
            y={y}
            dir={dir}
            offset={offSet}
            offSetTop={offSetTop}>
            {showTitle && title && (
              <CommonLabel
                dir={dir}
                coverLabel={LabelType.TITLE}
                text={title}
                id={id}
                fontStyle="bold"
                color={color}
              />
            )}
            {showSubtitle && subtitle && (
              <CommonLabel
                dir={dir}
                coverLabel={LabelType.SUBTITLE}
                text={subtitle}
                id={id}
                offset={offSet}
                color={color}
              />
            )}
          </CommonLabelDraggable>
          {showStars && (
            <CoverStarDraggable id={id} x={x} y={y} offset={0} offSetTop={0}>
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
              resetCoverLabel(id, LabelType.TITLE);
              resetCoverLabel(id, LabelType.SUBTITLE);
            }}
            values={{
              [LabelType.TITLE]: title,
              [LabelType.SUBTITLE]: subtitle,
            }}
          />
        </Html>
      )}
    </>
  );
};

export const Cover = React.memo(CoverMemo);
