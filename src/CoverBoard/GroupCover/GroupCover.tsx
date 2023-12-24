import React, { useState } from 'react';

import { CoverValues, GroupCovers, LabelType } from 'types';

import { useMainStore, useUtilsStore } from 'store';
import { shallow } from 'zustand/shallow';
import { Group } from 'react-konva';
import {
  CoverDraggable,
  CoverDrawLine,
  CoverLabelDraggable,
  CoverLabel,
} from 'CoverBoard/Cover';
import { GroupSquare } from './GroupSquare';
import { GroupCoverPopover } from '.';
import { Html } from 'react-konva-utils';

interface CoverImageProps {
  id: GroupCovers['id'];
  title: GroupCovers['title'];
  x: GroupCovers['x'];
  y: GroupCovers['y'];
  dir: GroupCovers['dir'];
  scaleX: GroupCovers['scaleX'];
  scaleY: GroupCovers['scaleY'];
}

const GroupCoverMemo: React.FC<CoverImageProps> = ({
  id,
  title,
  x,
  y,
  dir,
  scaleX,
  scaleY,
}) => {
  const showTitle = useMainStore((state) => state.configs.showTitle);
  const dragLimits = useMainStore((state) => state.dragLimits(), shallow);
  const fontSize = useMainStore((state) => state.fontSize());
  const toobarIconSize = useMainStore((state) => state.toobarIconSize());
  const windowSize = useMainStore((state) => state.windowSize);
  const [open, setOpen] = useState(false);
  const updateGroupsText = useMainStore((state) => state.updateGroupsText);
  const editLines = useUtilsStore((state) => state.editLines);
  const erase = useUtilsStore((state) => state.erase);
  const updateGroupScale = useMainStore((state) => state.updateGroupScale);

  const handleSubmit = (
    title: string,
    scale: { scaleX: number; scaleY: number },
  ) => {
    updateGroupsText(id, title);
    updateGroupScale(id, scale);
  };

  const offSet = !(showTitle && title) ? 1.5 * fontSize : 0;

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
          onclick={canOpenPopover ? () => setOpen(true) : undefined}
          onDblTap={canOpenPopover ? () => setOpen(true) : undefined}>
          <GroupSquare id={id} />
          <CoverLabelDraggable
            id={id}
            x={x}
            y={y}
            scaleX={scaleX}
            scaleY={scaleY}
            offset={offSet}
            offSetTop={0}>
            {showTitle && title && (
              <CoverLabel
                coverLabel={LabelType.TITLE}
                text={title}
                id={id}
                fontStyle="bold"
                scaleX={scaleX}
                scaleY={scaleY}
              />
            )}
          </CoverLabelDraggable>
        </Group>
      </CoverDraggable>
      {open && (
        <Html>
          <GroupCoverPopover
            id={id}
            open={open}
            onClose={() => setOpen(false)}
            onSubmit={handleSubmit}
            title={title}
          />
        </Html>
      )}
    </>
  );
};

export const GroupCover = React.memo(GroupCoverMemo);