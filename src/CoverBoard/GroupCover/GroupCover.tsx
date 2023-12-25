import React, { useState } from 'react';

import { GroupCovers, PosTypes } from 'types';

import { useMainStore, useUtilsStore } from 'store';
import { shallow } from 'zustand/shallow';
import { Group } from 'react-konva';
import {
  CommonDraggable,
  CommonDrawLine,
  CommonLabelDraggable,
  CommonLabel,
} from 'CoverBoard/Common';
import { GroupSquare } from './GroupSquare';
import { GroupCoverPopover } from '.';
import { Html } from 'react-konva-utils';

interface CoverImageProps {
  id: GroupCovers['id'];
  title: string;
  subtitle: string;
  x: GroupCovers['x'];
  y: GroupCovers['y'];
  dir: PosTypes;
  subDir: PosTypes;
  scaleX: GroupCovers['scaleX'];
  scaleY: GroupCovers['scaleY'];
  isSelected: boolean;
}

const GroupCoverMemo: React.FC<CoverImageProps> = ({
  id,
  title,
  subtitle,
  x,
  y,
  dir,
  subDir,
  scaleX,
  scaleY,
  isSelected,
}) => {
  const color = useMainStore((state) => state.getGroupColor());
  const dragLimits = useMainStore((state) => state.dragLimits(), shallow);
  const fontSize = useMainStore((state) => state.fontSize());
  const toobarIconSize = useMainStore((state) => state.toobarIconSize());
  const windowSize = useMainStore((state) => state.windowSize);
  const [open, setOpen] = useState(false);
  const updateGroupsText = useMainStore((state) => state.updateGroupsText);
  const editLines = useUtilsStore((state) => state.editLines);
  const erase = useUtilsStore((state) => state.erase);
  const updateGroupScale = useMainStore((state) => state.updateGroupScale);
  const updateGroupPosition = useMainStore(
    (state) => state.updateGroupPosition,
  );
  const updateGroupDir = useMainStore((state) => state.updateGroupDir);
  const updateGroupSubDir = useMainStore((state) => state.updateGroupSubDir);

  const handleSubmit = (
    title: string,
    subtitle: string,
    scale: { scaleX: number; scaleY: number },
  ) => {
    updateGroupsText(id, title, subtitle);
    updateGroupScale(id, scale);
  };

  const canOpenPopover = !editLines && !erase;

  const offset1 = dir === subDir && dir === PosTypes.TOP ? -fontSize * 1.5 : 0;
  const offset2 = dir === subDir && title ? offset1 + fontSize * 1.5 : 0;

  return (
    <>
      <CommonDraggable
        updatePosition={updateGroupPosition}
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
        <CommonDrawLine id={id} scaleX={scaleX} scaleY={scaleY} />

        <Group
          onDblclick={canOpenPopover ? () => setOpen(true) : undefined}
          onDblTap={canOpenPopover ? () => setOpen(true) : undefined}>
          <GroupSquare id={id} isSelected={isSelected} />
          <CommonLabelDraggable
            updateDir={updateGroupDir}
            id={id}
            x={x}
            y={y}
            dir={dir}
            scaleX={scaleX}
            scaleY={scaleY}>
            <CommonLabel
              color={color}
              dir={dir}
              coverLabel="title"
              text={title}
              id={id}
              fontStyle="bold"
              scaleX={scaleX}
              scaleY={scaleY}
              offset={offset1}
            />
          </CommonLabelDraggable>

          <CommonLabelDraggable
            updateDir={updateGroupSubDir}
            id={id}
            x={x}
            y={y}
            dir={subDir}
            scaleX={scaleX}
            scaleY={scaleY}>
            <CommonLabel
              color={color}
              dir={subDir}
              coverLabel="subtitle"
              text={subtitle}
              id={id}
              fontStyle="bold"
              scaleX={scaleX}
              scaleY={scaleY}
              offset={offset2}
            />
          </CommonLabelDraggable>
        </Group>
      </CommonDraggable>
      {open && (
        <Html>
          <GroupCoverPopover
            id={id}
            open={open}
            onClose={() => setOpen(false)}
            onSubmit={handleSubmit}
            title={title}
            subtitle={subtitle}
          />
        </Html>
      )}
    </>
  );
};

export const GroupCover = React.memo(GroupCoverMemo);
