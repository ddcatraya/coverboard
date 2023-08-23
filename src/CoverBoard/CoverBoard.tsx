import React, { useCallback, useRef, useState } from 'react';
import { Stage, Layer, Group, Rect, Text } from 'react-konva';

import { AlbumCover, DrawLine, Toolbar, TitleLabel, BoundaryArrow } from './';
import { Logo } from './AlbumCover';
import { backColorMap, colorMap } from 'types';
import { flushSync } from 'react-dom';
import { formatDate } from 'utils';
import { useMainStore } from 'store';

export const CoverBoard: React.FC = () => {
  const lines = useMainStore((state) => state.lines);
  const covers = useMainStore((state) => state.covers);
  const configs = useMainStore((state) => state.configs);
  const saveId = useMainStore((state) => state.saveId);

  const {
    offLimitCovers,
    toolBarLimits,
    toobarIconSize,
    windowSize,
    coverSize,
    fontSize,
    dragLimits,
  } = useMainStore((state) => ({
    offLimitCovers: state.offLimitCovers(),
    toolBarLimits: state.toolBarLimits(),
    toobarIconSize: state.toobarIconSize(),
    windowSize: state.windowSize,
    coverSize: state.configs.size,
    fontSize: state.fontSize(),
    dragLimits: state.dragLimits(),
  }));
  const stageRef = useRef<any>(null);
  const [screenshotUrl, setScreenshotUrl] = useState('');
  const [showLogo, setShowLogo] = useState(true);

  const pos0 = covers.filter((cov) => cov.x === 0 && cov.y === 0).length;

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
            fill={backColorMap[configs.backColor]}
            listening={false}
          />
          <Group name="board" x={dragLimits.x} y={dragLimits.y}>
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
            {offLimitCovers.map((star) => (
              <BoundaryArrow
                id={star.id}
                x={star.x}
                y={star.y}
                album={star.album.text}
                key={star.id}
              />
            ))}
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
              stroke={colorMap[configs.color]}
              listening={false}
            />
          </Group>
          <Rect
            name="leftBackground"
            width={3 * toobarIconSize}
            height={windowSize.height}
            fill={backColorMap[configs.backColor]}
            listening={false}
          />
          <Group name="toolbar" x={toolBarLimits.x} y={toolBarLimits.y}>
            {showLogo && <Logo />}
            <Rect
              name="toolbarBackground"
              width={toolBarLimits.width}
              height={toolBarLimits.height}
              stroke={colorMap[configs.color]}
              fill={backColorMap[configs.backColor]}
            />
            <Toolbar takeScreenshot={takeScreenshot} showTooltips={showLogo} />
          </Group>
          <Rect
            name="arenaHiddenBorder"
            width={windowSize.width}
            height={windowSize.height}
            stroke={backColorMap[configs.backColor]}
            strokeWidth={toobarIconSize - 2}
            listening={false}
          />
        </Layer>
      </Stage>
      {screenshotUrl && <img src={screenshotUrl} alt="Screenshot" />}
    </>
  );
};
