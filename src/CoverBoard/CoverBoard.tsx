import React, { RefObject, useCallback, useRef, useState } from 'react';
import { Stage, Layer, Group, Rect, Text } from 'react-konva';

import { Cover, DrawLine, Toolbar, TitleLabel, BoundaryArrow, Logo } from './';
import { flushSync } from 'react-dom';
import { formatDate } from 'utils';
import { useMainStore } from 'store';
import { shallow } from 'zustand/shallow';
import Konva from 'konva';
import { LabelType } from 'types';
import { GroupCover } from './GroupCover';

const Covers: React.FC = () => {
  const covers = useMainStore((state) => state.covers);
  console.log(covers);

  return (
    <>
      {covers.map((star, index) => (
        <Cover
          id={star.id}
          title={star[LabelType.TITLE].text}
          subtitle={star[LabelType.SUBTITLE].text}
          x={star.x}
          y={star.y}
          dir={star.dir}
          starDir={star.starDir}
          link={star.link}
          key={star.id}
          renderTime={400 * index}
        />
      ))}
    </>
  );
};

interface GroupCoverProps {
  selectedId: string | null;
  setSelectedId: React.Dispatch<React.SetStateAction<string | null>>;
}

const GroupCovers: React.FC<GroupCoverProps> = ({
  selectedId,
  setSelectedId,
}) => {
  const groups = useMainStore((state) => state.groups);

  const handlesSelect = (evt, coverId: string) => {
    evt.cancelBubble = true;
    setSelectedId(coverId);
  };

  return (
    <>
      {groups.map((star) => (
        <Group key={star.id} onClick={(evt) => handlesSelect(evt, star.id)}>
          <GroupCover
            id={star.id}
            title={star.title}
            x={star.x}
            y={star.y}
            dir={star.dir}
            scaleX={star.scaleX}
            scaleY={star.scaleY}
            isSelected={star.id === selectedId}
          />
        </Group>
      ))}
    </>
  );
};

const DrawLines: React.FC = () => {
  const lines = useMainStore((state) => state.lines);

  return (
    <>
      {lines.map((line) => (
        <DrawLine
          id={line.id}
          dir={line.dir}
          originId={line.origin.id}
          originDir={line.origin.dir}
          targetId={line.target.id}
          targetDir={line.target.dir}
          key={line.id}
        />
      ))}
    </>
  );
};

const BoundaryArrows: React.FC = () => {
  const offLimitCovers = useMainStore((state) => state.offLimitCovers());
  const offLimitGroups = useMainStore((state) => state.offLimitGroups());
  const updateCoverPosition = useMainStore(
    (state) => state.updateCoverPosition,
  );
  const updateGroupPosition = useMainStore(
    (state) => state.updateGroupPosition,
  );
  const removeCoverAndRelatedLines = useMainStore(
    (state) => state.removeCoverAndRelatedLines,
  );
  const removeGroupAndRelatedLines = useMainStore(
    (state) => state.removeGroupAndRelatedLines,
  );

  return (
    <>
      {offLimitCovers.map((star) => (
        <BoundaryArrow
          updatePosition={updateCoverPosition}
          removeCascade={removeCoverAndRelatedLines}
          id={star.id}
          x={star.x}
          y={star.y}
          title={star[LabelType.SUBTITLE].text}
          key={star.id}
        />
      ))}
      {offLimitGroups.map((star) => (
        <BoundaryArrow
          updatePosition={updateGroupPosition}
          removeCascade={removeGroupAndRelatedLines}
          id={star.id}
          x={star.x}
          y={star.y}
          scaleX={star.scaleX}
          scaleY={star.scaleY}
          title={star.title}
          key={star.id}
        />
      ))}
    </>
  );
};

const CountLabel: React.FC = () => {
  const pos0 = useMainStore(
    (state) => state.covers.filter((cov) => cov.x === 0 && cov.y === 0).length,
  );
  const coverSizeWidth = useMainStore((state) => state.coverSizeWidth());
  const coverSizeHeight = useMainStore((state) => state.coverSizeHeight());
  const fontSize = useMainStore((state) => state.fontSize());

  return (
    <Text
      x={coverSizeWidth + fontSize / 2}
      y={coverSizeHeight - fontSize * 2}
      align="center"
      text={pos0 > 1 ? 'x' + String(pos0) : ''}
      fontSize={fontSize * 2}
      fill="white"
      listening={false}
    />
  );
};

const GroupCountLabel: React.FC = () => {
  const pos0 = useMainStore(
    (state) => state.groups.filter((cov) => cov.x === 0 && cov.y === 0).length,
  );
  const coverSizeWidth = useMainStore((state) => state.coverSizeWidth()) * 4;
  const coverSizeHeight = useMainStore((state) => state.coverSizeHeight()) * 4;
  const fontSize = useMainStore((state) => state.fontSize());

  return (
    <Text
      x={coverSizeWidth + fontSize / 2}
      y={coverSizeHeight - fontSize * 2}
      align="center"
      text={pos0 > 1 ? 'x' + String(pos0) : ''}
      fontSize={fontSize * 2}
      fill="white"
      listening={false}
    />
  );
};

export const CoverBoard: React.FC = () => {
  const color = useMainStore((state) => state.getColor());
  const backColor = useMainStore((state) => state.getBackColor());
  const saveId = useMainStore((state) => state.saveId);

  const toolBarLimits = useMainStore((state) => state.toolBarLimits(), shallow);
  const toobarIconSize = useMainStore((state) => state.toobarIconSize());
  const windowSize = useMainStore((state) => state.windowSize);
  const dragLimits = useMainStore((state) => state.dragLimits(), shallow);

  const stageRef: RefObject<Konva.Stage> = useRef(null);
  const [screenshotUrl, setScreenshotUrl] = useState('');
  const [showLogo, setShowLogo] = useState(true);

  const [selectedId, setSelectedId] = useState<string | null>(null);

  const takeScreenshot = useCallback(() => {
    const stage = stageRef.current;

    flushSync(() => {
      setShowLogo(false);
    });

    if (stage) {
      const uri = stage.toDataURL({ ...dragLimits, mimeType: 'image/png' });

      flushSync(() => {
        setScreenshotUrl(uri);
      });

      const downloadLink = document.createElement('a');
      downloadLink.href = uri;
      downloadLink.download = `${saveId} ${formatDate(new Date())}.png`;
      downloadLink.click();

      flushSync(() => {
        setScreenshotUrl('');
        setShowLogo(true);
      });
    }
  }, [dragLimits, saveId]);

  const checkDeselect = (e) => {
    // deselect when clicked on empty area
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      setSelectedId(null);
    }
  };

  return (
    <>
      <Stage
        width={windowSize.width - toobarIconSize}
        height={windowSize.height - toobarIconSize}
        ref={stageRef}
        onMouseDown={checkDeselect}
        onTouchStart={checkDeselect}>
        <Layer>
          {!showLogo && (
            <Rect
              name="screenshotBackground"
              width={windowSize.width}
              height={windowSize.height}
              fill={backColor}
              listening={false}
            />
          )}
          <Group name="board" x={dragLimits.x} y={dragLimits.y}>
            <GroupCovers
              selectedId={selectedId}
              setSelectedId={setSelectedId}
            />
            <Covers />
            <DrawLines />
            <BoundaryArrows />
            <TitleLabel />
            <CountLabel />
            <GroupCountLabel />

            <Rect
              name="arenaBorder"
              x={1}
              y={1}
              width={dragLimits.width - 2}
              height={dragLimits.height - 2}
              stroke={color}
              listening={false}
            />
          </Group>
          <Rect
            name="leftBackground"
            width={2.5 * toobarIconSize}
            height={windowSize.height - toobarIconSize}
            fill={backColor}
            listening={false}
          />
          <Group name="toolbar" x={toolBarLimits.x} y={toolBarLimits.y}>
            {showLogo && <Logo />}
            <Rect
              name="toolbarBorder"
              x={1}
              y={1}
              width={toolBarLimits.width - 2}
              height={toolBarLimits.height - 2}
              stroke={color}
            />
            <Toolbar takeScreenshot={takeScreenshot} showTooltips={showLogo} />
          </Group>
        </Layer>
      </Stage>
      {screenshotUrl && <img src={screenshotUrl} alt="Screenshot" />}
    </>
  );
};
