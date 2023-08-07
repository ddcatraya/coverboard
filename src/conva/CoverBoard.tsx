import React from 'react';
import { Stage, Layer, Group, Rect } from 'react-konva';
import { AlbumCover, DrawLines, Toolbar } from 'conva/components';
import { useCoverContext, useSizesContext } from 'contexts';

export const CoverBoard: React.FC = () => {
  const { cover } = useCoverContext();
  const { toolBarLimits, dragLimits, windowSize } = useSizesContext();

  /* useEffect(() => {
    const fetchData = async () => {
      const albums = await getAlbums() ?? [];

      setCover(albums)
    }

    fetchData().catch(console.error);
  }, []); */

  return (
    <>
      <Stage width={windowSize.width} height={windowSize.height}>
        <Layer>
          <Group>
            <Rect
              x={toolBarLimits.x}
              y={toolBarLimits.y}
              width={toolBarLimits.width}
              height={toolBarLimits.height}
              stroke="yellow"
            />
            <Toolbar />
          </Group>
          <Group>
            <Rect
              x={dragLimits.x}
              y={dragLimits.y}
              width={dragLimits.width}
              height={dragLimits.height}
              stroke="yellow"
            />
            <DrawLines />
            {cover.map((star) => (
              <AlbumCover
                isDragging={star.isDragging}
                link={star.link}
                key={star.id}
                id={star.id}
                x={star.x}
                y={star.y}
                artist={star.artist}
                album={star.album}
                dir={star.dir}
              />
            ))}
          </Group>
        </Layer>
      </Stage>
    </>
  );
};
