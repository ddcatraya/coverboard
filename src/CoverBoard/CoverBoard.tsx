import React from 'react';
import { Stage, Layer, Group, Rect, Text } from 'react-konva';

import { AlbumCover, DrawLine, Toolbar, TitleLabel, BoundaryArrow } from './';
import { useCoverContext, useSizesContext, ToolbarProvider } from 'contexts';
import { Logo } from './AlbumCover';
import { backColorMap, colorMap } from 'types';

export const CoverBoard: React.FC = () => {
  const { cover, lines, configs } = useCoverContext();
  const {
    toolBarLimits,
    dragLimits,
    windowSize,
    toobarIconSize,
    coverSize,
    fontSize,
  } = useSizesContext();

  const pos0 = cover.filter((cov) => cov.x === 0 && cov.y === 0).length;

  const offLimitCovers = cover.flatMap((cover) => {
    if (cover.x > dragLimits.width || cover.y > dragLimits.height) {
      return cover;
    }

    return [];
  });

  return (
    <Stage width={windowSize.width} height={windowSize.height}>
      <Layer>
        <Group name="board" x={dragLimits.x} y={dragLimits.y}>
          {cover.map((star) => (
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
          <Logo />
          <Rect
            name="toolbarBackground"
            width={toolBarLimits.width}
            height={toolBarLimits.height}
            stroke={colorMap[configs.color]}
            fill={backColorMap[configs.backColor]}
          />
          <ToolbarProvider>
            <Toolbar />
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
  );
};
