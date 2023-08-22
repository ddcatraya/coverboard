import React, { useRef, useState } from 'react';
import { Stage, Layer, Group, Rect, Text } from 'react-konva';

import { AlbumCover, DrawLine, Toolbar, TitleLabel, BoundaryArrow } from './';
import { ToolbarProvider } from 'contexts';
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
  const offLimitCovers = useMainStore((state) => state.offLimitCovers());
  const toolBarLimits = useMainStore((state) => state.toolBarLimits());
  const dragLimits = useMainStore((state) => state.dragLimits());
  const windowSize = useMainStore((state) => state.windowSize);
  const toobarIconSize = useMainStore((state) => state.toobarIconSize());
  const coverSize = useMainStore((state) => state.coverSize());
  const fontSize = useMainStore((state) => state.fontSize());
  const stageRef = useRef<any>(null);
  const [screenshotUrl, setScreenshotUrl] = useState('');
  const [showLogo, setShowLogo] = useState(true);

  const pos0 = covers.filter((cov) => cov.x === 0 && cov.y === 0).length;

  const takeScreenshot = () => {
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
  };

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
              <AlbumCover albumCover={star} key={star.id} />
            ))}
            {lines.map((line) => (
              <DrawLine line={line} key={line.id} />
            ))}
            {offLimitCovers.map((star) => (
              <BoundaryArrow albumCover={star} key={star.id} />
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
            <ToolbarProvider>
              <Toolbar
                takeScreenshot={takeScreenshot}
                showTooltips={showLogo}
              />
            </ToolbarProvider>
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
