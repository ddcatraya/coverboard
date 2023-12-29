import React from 'react';

import { Elem, GroupCovers, PosTypes } from 'types';

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
}) => {
  const color = useMainStore((state) => state.getGroupColor());
  const dragLimits = useMainStore((state) => state.dragLimits(), shallow);
  const fontSize = useMainStore((state) => state.fontSize());
  const toobarIconSize = useMainStore((state) => state.toobarIconSize());
  const windowSize = useMainStore((state) => state.windowSize);
  const editLines = useUtilsStore((state) => state.points);
  const setSelected = useUtilsStore((state) => state.setSelected);
  const updateGroupLabel = useMainStore((state) => state.updateGroupLabel);
  const updateGroupPosition = useMainStore(
    (state) => state.updateGroupPosition,
  );
  const updateGroupDir = useMainStore((state) => state.updateGroupDir);
  const updateGroupSubDir = useMainStore((state) => state.updateGroupSubDir);

  const removeGroupAndRelatedLines = useMainStore(
    (state) => state.removeGroupAndRelatedLines,
  );

  const canOpenPopover = !editLines;

  const offset1 =
    dir === subDir && subtitle && dir === PosTypes.TOP
      ? -fontSize * 1.5
      : subtitle && dir === subDir && dir !== PosTypes.BOTTOM
      ? -fontSize
      : 0;
  const offset2 = dir === subDir && title ? offset1 + fontSize * 1.5 : 0;

  const isSelectedModalOpen = useUtilsStore((state) =>
    state.isSelectedModalOpen({ id, elem: Elem.GROUP }),
  );

  return (
    <>
      <CommonDraggable
        updatePosition={updateGroupPosition}
        onDelete={removeGroupAndRelatedLines}
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
        <CommonDrawLine
          id={id}
          scaleX={scaleX}
          scaleY={scaleY}
          type={Elem.GROUP}
        />

        <Group
          onDblclick={
            canOpenPopover
              ? () => setSelected({ id, elem: Elem.GROUP, open: true })
              : undefined
          }
          onDblTap={
            canOpenPopover
              ? () => setSelected({ id, elem: Elem.GROUP, open: true })
              : undefined
          }>
          <GroupSquare id={id} />
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
              updateLabel={updateGroupLabel}
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
              updateLabel={updateGroupLabel}
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
      {isSelectedModalOpen && (
        <Html>
          <GroupCoverPopover
            id={id}
            open={isSelectedModalOpen}
            values={{
              title,
              subtitle,
              titleDir: dir,
              subTitleDir: subDir,
            }}
          />
        </Html>
      )}
    </>
  );
};

export const GroupCover = React.memo(GroupCoverMemo);
