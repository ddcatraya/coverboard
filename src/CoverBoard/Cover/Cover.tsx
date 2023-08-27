import React, { useState } from 'react';

import { Covers, CoverValues, LabelType } from 'types';
import {
  CoverDrawLine,
  CoverImage,
  CoverLabel,
  CoverLabelDraggable,
  CoverDraggable,
  CoverPopover,
} from '.';
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
  const [open, setOpen] = useState(false);
  const resetCoverLabel = useMainStore((state) => state.resetCoverLabel);
  const updateCoversText = useMainStore((state) => state.updateCoversText);
  const editLines = useUtilsStore((state) => state.editLines);
  const erase = useUtilsStore((state) => state.erase);

  const handleSubmit = (values: CoverValues) => {
    updateCoversText(
      id,
      values[LabelType.TITLE].trim(),
      values[LabelType.SUBTITLE].trim(),
    );
  };

  const offSet =
    showTitle && title && showSubtitle && subtitle ? 1.5 * fontSize : 0;

  const offSetTop = !(showTitle && title && showSubtitle && subtitle)
    ? 1.5 * fontSize
    : 0;

  const canOpenPopover = !editLines && !erase;

  return (
    <>
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

        <Group
          onClick={canOpenPopover ? () => setOpen(true) : undefined}
          onDblTap={canOpenPopover ? () => setOpen(true) : undefined}>
          <CoverImage id={id} link={link} />

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
        </Group>
      </CoverDraggable>
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
