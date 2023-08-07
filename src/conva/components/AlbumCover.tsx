import { useCoverContext, useSizesContext } from 'contexts';
import { PosTypes } from 'contexts/CoverContext';
import { useDragAndDrop } from 'conva';
import { Vector2d } from 'konva/lib/types';
import React, { useState } from 'react';
import { Group, Image, Rect, Text } from 'react-konva';
import { Html } from 'react-konva-utils';
import useImage from 'use-image';
import { RenderDir } from './DrawLines';
import { BandDir } from 'uicomponents/bandDir';

interface CoverImageProps {
  id: string;
  link: string;
  x: number;
  y: number;
  isDragging: boolean;
  artist: string;
  album: string;
  dir: RenderDir;
}

export const AlbumCover: React.FC<CoverImageProps> = (props) => {
  const { id, link, x, y, isDragging, artist, album, dir } = props;
  const [image] = useImage(link);
  const [textDirOpen, setTextDirOpen] = useState(false);
  const { erase, setCover, points, setPoints, showTitles, editLines } =
    useCoverContext();
  const { dragLimits, coverSize, fontSize } = useSizesContext();
  const { handleDragStart, handleDragEnd } = useDragAndDrop();

  console.log('rerender');

  const handleEraseImage = (id: string) => {
    if (erase) {
      setCover((currentCover) => currentCover.filter((c) => c.id !== id));
      return;
    }
  };

  const handleDrawLine = (id: string, pos: PosTypes) => {
    if (!points) {
      setPoints({ origin: { id, pos } });
    } else if (points.origin.id !== id) {
      setCover((currentCover) =>
        currentCover.map((star) => {
          // logic to replace
          if (star.id === points.origin.id) {
            const targetLine = star.lines.find(
              (line) => line.target?.id === id,
            );

            if (targetLine) {
              targetLine.origin.pos = points.origin.pos;
              targetLine.target = { id, pos };

              return star;
            }

            return {
              ...star,
              lines: [...star.lines, { ...points, target: { id, pos } }],
            };
          }

          return star;
        }),
      );
      setPoints(null);
    }
  };

  const handleDragBound = (pos: Vector2d) => {
    const newX = Math.max(
      dragLimits.x,
      Math.min(pos.x, dragLimits.width - coverSize / 2),
    );
    const newY = Math.max(
      dragLimits.y,
      Math.min(pos.y, dragLimits.height - coverSize / 2),
    );

    return {
      x: newX,
      y: newY,
    };
  };

  const handleChangeDir = (dir: RenderDir) => {
    setCover((currentCover) =>
      currentCover.map((star) => {
        return {
          ...star,
          dir: star.id === id ? dir : star.dir,
        };
      }),
    );
  };

  return (
    <Group
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      dragBoundFunc={handleDragBound}
      draggable
      x={x}
      y={y}
      id={id}
      scaleX={isDragging ? 1.1 : 1}
      scaleY={isDragging ? 1.1 : 1}>
      <Group>
        {showTitles && (
          <Group onClick={() => setTextDirOpen(true)}>
            <Text
              fontSize={fontSize}
              text={artist + '\n\n' + album}
              x={-coverSize / 2}
              y={
                dir === RenderDir.DOWN
                  ? coverSize + fontSize
                  : -coverSize - fontSize
              }
              align="center"
              verticalAlign={dir === RenderDir.DOWN ? 'top' : 'bottom'}
              fill="yellow"
              width={coverSize * 2}
              height={coverSize}
            />
            <Html>
              <BandDir
                open={!!textDirOpen}
                onClose={() => setTextDirOpen(false)}
                onSubmit={handleChangeDir}
                defaultDir={dir ?? RenderDir.DOWN}
              />
            </Html>
          </Group>
        )}
        {editLines && (
          <>
            <Rect
              x={0 + coverSize / 2}
              y={0 - coverSize / 4 - coverSize / 8}
              width={coverSize / 2}
              height={coverSize / 2}
              fill="white"
              rotation={45}
              opacity={0.05}
              onClick={() => handleDrawLine(id, PosTypes.TOP)}
            />
            <Rect
              x={0 + coverSize}
              y={0 + coverSize / 8}
              width={coverSize / 2}
              height={coverSize / 2}
              fill="white"
              rotation={45}
              opacity={0.05}
              onClick={() => handleDrawLine(id, PosTypes.RIGHT)}
            />
            <Rect
              x={0}
              y={0 + coverSize / 8}
              width={coverSize / 2}
              height={coverSize / 2}
              fill="white"
              rotation={45}
              opacity={0.05}
              onClick={() => handleDrawLine(id, PosTypes.LEFT)}
            />
            <Rect
              x={0 + coverSize / 2}
              y={0 + coverSize - coverSize / 4 - coverSize / 8}
              width={coverSize / 2}
              height={coverSize / 2}
              fill="white"
              rotation={45}
              opacity={0.05}
              onClick={() => handleDrawLine(id, PosTypes.BOTTOM)}
            />
          </>
        )}
      </Group>
      <Image
        image={image}
        width={coverSize}
        height={coverSize}
        onClick={() => handleEraseImage(id)}
      />
    </Group>
  );
};
