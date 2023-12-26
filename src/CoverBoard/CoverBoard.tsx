import React, {
  RefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Stage, Layer, Group, Rect, Text } from 'react-konva';

import { Cover, DrawLine, Toolbar, TitleLabel, BoundaryArrow, Logo } from './';
import { flushSync } from 'react-dom';
import { formatDate } from 'utils';
import { useMainStore, useUtilsStore } from 'store';
import { shallow } from 'zustand/shallow';
import Konva from 'konva';
import { GroupCover } from './GroupCover';

const Covers: React.FC = () => {
  const covers = useMainStore((state) => state.covers);
  const setSelected = useUtilsStore((state) => state.setSelected);

  const handleSelect = (evt, coverId: string) => {
    evt.cancelBubble = true;
    setSelected({ id: coverId, elem: 'cover' });
  };

  return (
    <>
      {covers.map((cover, index) => (
        <Group
          key={cover.id}
          onClick={(evt) => handleSelect(evt, cover.id)}
          onTouchStart={(evt) => handleSelect(evt, cover.id)}>
          <Cover
            id={cover.id}
            title={cover.title.text}
            subtitle={cover.subtitle.text}
            x={cover.x}
            y={cover.y}
            titleDir={cover.title.dir}
            subTitleDir={cover.subtitle.dir}
            starDir={cover.star.dir}
            link={cover.link}
            key={cover.id}
            renderTime={400 * index}
          />
        </Group>
      ))}
    </>
  );
};

const GroupCovers: React.FC = () => {
  const groups = useMainStore((state) => state.groups);
  const setSelected = useUtilsStore((state) => state.setSelected);

  const handlesSelect = (evt, coverId: string) => {
    evt.cancelBubble = true;
    setSelected({ id: coverId, elem: 'group' });
  };

  return (
    <>
      {groups.map((group) => (
        <Group
          key={group.id}
          onClick={(evt) => handlesSelect(evt, group.id)}
          onTouchStart={(evt) => handlesSelect(evt, group.id)}>
          <GroupCover
            id={group.id}
            title={group.title.text}
            subtitle={group.subtitle.text}
            x={group.x}
            y={group.y}
            dir={group.title.dir}
            subDir={group.subtitle.dir}
            scaleX={group.scaleX}
            scaleY={group.scaleY}
          />
        </Group>
      ))}
    </>
  );
};

const DrawLines: React.FC = () => {
  const lines = useMainStore((state) => state.lines);
  const setSelected = useUtilsStore((state) => state.setSelected);

  const handlesSelect = (evt, coverId: string) => {
    evt.cancelBubble = true;
    setSelected({ id: coverId, elem: 'arrow' });
  };

  return (
    <>
      {lines.map((line) => (
        <Group
          key={line.id}
          onClick={(evt) => handlesSelect(evt, line.id)}
          onTouchStart={(evt) => handlesSelect(evt, line.id)}>
          <DrawLine
            id={line.id}
            dir={line.dir}
            originId={line.origin.id}
            originDir={line.origin.dir}
            targetId={line.target.id}
            targetDir={line.target.dir}
            key={line.id}
          />
        </Group>
      ))}
    </>
  );
};

const BoundaryArrows: React.FC = () => {
  const offLimitCovers = useMainStore((state) => state.offLimitCovers());
  const updateCoverPosition = useMainStore(
    (state) => state.updateCoverPosition,
  );
  const removeCoverAndRelatedLines = useMainStore(
    (state) => state.removeCoverAndRelatedLines,
  );
  const coverColor = useMainStore((state) => state.getCoverColor());

  return (
    <>
      {offLimitCovers.map((cover) => (
        <BoundaryArrow
          color={coverColor}
          updatePosition={updateCoverPosition}
          removeCascade={removeCoverAndRelatedLines}
          id={cover.id}
          x={cover.x}
          y={cover.y}
          title={cover.subtitle.text}
          key={cover.id}
        />
      ))}
    </>
  );
};

const BoundaryGroupArrows: React.FC = () => {
  const offLimitGroups = useMainStore((state) => state.offLimitGroups());
  const updateGroupPosition = useMainStore(
    (state) => state.updateGroupPosition,
  );
  const removeGroupAndRelatedLines = useMainStore(
    (state) => state.removeGroupAndRelatedLines,
  );
  const groupColor = useMainStore((state) => state.getGroupColor());

  return (
    <>
      {offLimitGroups.map((group) => (
        <BoundaryArrow
          color={groupColor}
          updatePosition={updateGroupPosition}
          removeCascade={removeGroupAndRelatedLines}
          id={group.id}
          x={group.x}
          y={group.y}
          scaleX={group.scaleX}
          scaleY={group.scaleY}
          title={group.title.text}
          key={group.id}
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

const useDeleteListener = () => {
  const [selected, setSelected] = useUtilsStore((state) => [
    state.selected,
    state.setSelected,
  ]);

  const removeCoverAndRelatedLines = useMainStore(
    (state) => state.removeCoverAndRelatedLines,
  );
  const removeGroupAndRelatedLines = useMainStore(
    (state) => state.removeGroupAndRelatedLines,
  );
  const removeLine = useMainStore((state) => state.removeLine);

  const checkDeselect = useCallback(
    (e) => {
      const clickedOnEmpty = e.target === e.target.getStage();
      if (clickedOnEmpty) {
        setSelected(null);
      }
    },
    [setSelected],
  );

  useEffect(() => {
    if (!selected) return;

    const deleteFn = (e) => {
      if (e.key === 'Delete') {
        if (selected.elem === 'group') {
          removeGroupAndRelatedLines(selected.id);
        } else if (selected.elem === 'cover') {
          removeCoverAndRelatedLines(selected.id);
        } else if (selected.elem === 'arrow') {
          removeLine(selected.id);
        }
      }
    };
    document.addEventListener('keydown', deleteFn);

    return () => document.removeEventListener('keydown', deleteFn);
  }, [
    removeCoverAndRelatedLines,
    removeGroupAndRelatedLines,
    removeLine,
    selected,
  ]);

  return { checkDeselect };
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

  const { checkDeselect } = useDeleteListener();

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
            <TitleLabel />
            <GroupCovers />
            <Covers />
            <DrawLines />
            <BoundaryArrows />
            <BoundaryGroupArrows />
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
