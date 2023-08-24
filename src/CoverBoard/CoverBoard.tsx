import React, { useCallback, useRef, useState } from 'react';
import { Stage, Layer, Group, Rect, Text } from 'react-konva';

import {
  AlbumCover,
  DrawLine,
  Toolbar,
  TitleLabel,
  BoundaryArrow,
  Logo,
} from './';
import { flushSync } from 'react-dom';
import { formatDate } from 'utils';
import { useMainStore } from 'store';

const AlbumCovers: React.FC = () => {
  const covers = useMainStore((state) => state.covers);

  return (
    <>
      {covers.map((star) => (
        <AlbumCover
          id={star.id}
          artist={star.artist.text}
          album={star.album.text}
          x={star.x}
          y={star.y}
          link={star.link}
          dir={star.dir}
          key={star.id}
        />
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
          text={line.text}
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

  return (
    <>
      {offLimitCovers.map((star) => (
        <BoundaryArrow
          id={star.id}
          x={star.x}
          y={star.y}
          album={star.album.text}
          key={star.id}
        />
      ))}
    </>
  );
};

export const CoverBoard: React.FC = () => {
  const pos0 = useMainStore(
    (state) => state.covers.filter((cov) => cov.x === 0 && cov.y === 0).length,
  );
  const color = useMainStore((state) => state.getColor());
  const backColor = useMainStore((state) => state.getBackColor());
  const saveId = useMainStore((state) => state.saveId);

  const toolBarLimits = useMainStore((state) => state.toolBarLimits());
  const toobarIconSize = useMainStore((state) => state.toobarIconSize());
  const windowSize = useMainStore((state) => state.windowSize);
  const coverSize = useMainStore((state) => state.configs.size);
  const fontSize = useMainStore((state) => state.fontSize());
  const dragLimits = useMainStore((state) => state.dragLimits());

  const stageRef = useRef<any>(null);
  const [screenshotUrl, setScreenshotUrl] = useState('');
  const [showLogo, setShowLogo] = useState(true);

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
      <Stage width={windowSize.width} height={windowSize.height} ref={stageRef}>
        <Layer>
          <Rect
            width={windowSize.width}
            height={windowSize.height}
            fill={backColor}
            listening={false}
          />
          <Group name="board" x={dragLimits.x} y={dragLimits.y}>
            <AlbumCovers />
            <DrawLines />
            <BoundaryArrows />
            <TitleLabel />
            <Text
              x={coverSize + fontSize / 2}
              y={coverSize - fontSize * 2}
              align="center"
              text={pos0 > 1 ? 'x' + String(pos0) : ''}
              fontSize={fontSize * 2}
              fill="white"
              listening={false}
            />
            <Rect
              name="arenaBorder"
              width={dragLimits.width}
              height={dragLimits.height}
              stroke={color}
              listening={false}
            />
          </Group>
          <Rect
            name="leftBackground"
            width={3 * toobarIconSize}
            height={windowSize.height}
            fill={backColor}
            listening={false}
          />
          <Group name="toolbar" x={toolBarLimits.x} y={toolBarLimits.y}>
            {showLogo && <Logo />}
            <Rect
              name="toolbarBackground"
              width={toolBarLimits.width}
              height={toolBarLimits.height}
              stroke={color}
              fill={backColor}
            />
            <Toolbar takeScreenshot={takeScreenshot} showTooltips={showLogo} />
          </Group>
          <Rect
            name="arenaHiddenBorder"
            width={windowSize.width}
            height={windowSize.height}
            stroke={backColor}
            strokeWidth={toobarIconSize - 2}
            listening={false}
          />
        </Layer>
      </Stage>
      {screenshotUrl && <img src={screenshotUrl} alt="Screenshot" />}
    </>
  );
};
