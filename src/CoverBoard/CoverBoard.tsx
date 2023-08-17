import React from 'react';
import { Stage, Layer, Group, Rect } from 'react-konva';

import { AlbumCover, DrawLine, Toolbar, TitleLabel } from './';
import { useCoverContext, useSizesContext, ToolbarProvider } from 'contexts';
import { Logo } from './AlbumCover';
import { backColorMap, colorMap } from 'types';

export const CoverBoard: React.FC = () => {
  const { cover, lines, configs } = useCoverContext();
  const { toolBarLimits, dragLimits, windowSize, toobarIconSize } =
    useSizesContext();

  return (
    <Stage width={windowSize.width} height={windowSize.height}>
      <Layer>
        <Group x={dragLimits.x} y={dragLimits.y}>
          {cover.map((star) => (
            <AlbumCover albumCover={star} key={star.id} />
          ))}
          {lines.map((line) => (
            <DrawLine line={line} key={line.id} />
          ))}
          <TitleLabel />
          <Rect
            width={dragLimits.width}
            height={dragLimits.height}
            stroke={colorMap[configs.color]}
            listening={false}
          />
        </Group>
        <Rect
          width={3 * toobarIconSize}
          height={windowSize.height}
          fill={backColorMap[configs.backColor]}
          listening={false}
        />
        <Group x={toolBarLimits.x} y={toolBarLimits.y}>
          <Logo />
          <Rect
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
