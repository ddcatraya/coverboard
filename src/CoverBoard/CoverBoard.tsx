import React from 'react';
import { Stage, Layer, Group, Rect } from 'react-konva';

import { AlbumCover, DrawLine, Toolbar, TitleLabel } from './';
import { useCoverContext, useSizesContext, ToolbarProvider } from 'contexts';
import { Logo } from './AlbumCover';
import { backColorMap, colorMap } from 'types';

export const CoverBoard: React.FC = () => {
  const { cover, lines, configs } = useCoverContext();
  const { toolBarLimits, dragLimits, windowSize } = useSizesContext();

  return (
    <Stage width={windowSize.width} height={windowSize.height}>
      <Layer>
        <Group>
          <Logo />
          <Rect
            x={toolBarLimits.x}
            y={toolBarLimits.y}
            width={toolBarLimits.width}
            height={toolBarLimits.height}
            stroke={colorMap[configs.color]}
            fill={backColorMap[configs.backColor]}
          />
          <ToolbarProvider>
            <Toolbar />
          </ToolbarProvider>
        </Group>
        <Group
          x={dragLimits.x + configs.size / 2}
          y={dragLimits.y + configs.size / 2}>
          <Rect
            x={-configs.size / 2}
            y={-configs.size / 2}
            width={dragLimits.width}
            height={dragLimits.height}
            stroke={colorMap[configs.color]}
          />
          <TitleLabel />
          {lines.map((line) => (
            <DrawLine line={line} key={line.id} />
          ))}
          {cover.map((star) => (
            <AlbumCover albumCover={star} key={star.id} />
          ))}
        </Group>
      </Layer>
    </Stage>
  );
};
