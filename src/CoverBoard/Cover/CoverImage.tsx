import React from 'react';
import { Image, Text } from 'react-konva';

import { Covers } from 'types';
import { useImage } from 'react-konva-utils';
import { KonvaEventObject } from 'konva/lib/Node';
import { useMainStore } from 'store';

interface CoverImageProps {
  link: Covers['link'];
  onRetry: (evt: KonvaEventObject<MouseEvent>) => void;
}

export const CoverImage: React.FC<CoverImageProps> = ({ link, onRetry }) => {
  const color = useMainStore((state) => state.getColor());

  const coverSizeWidth = useMainStore((state) => state.coverSizeWidth());
  const coverSizeHeight = useMainStore((state) => state.coverSizeHeight());
  const fontSize = useMainStore((state) => state.fontSize());

  const [image, status] = useImage(link, 'anonymous');

  return (
    <>
      {status === 'loaded' && image && (
        <Image
          listening={false}
          image={image}
          width={coverSizeWidth}
          height={coverSizeHeight}
        />
      )}
      {status === 'loading' && (
        <Text
          fontSize={fontSize * 1.2}
          x={0}
          y={coverSizeHeight / 2 - (fontSize * 1.2) / 2}
          width={coverSizeWidth}
          align="center"
          fill={color}
          text="Loading..."
        />
      )}
      {status === 'failed' && (
        <Text
          fontSize={fontSize * 1.2}
          x={coverSizeWidth / 4.3}
          y={coverSizeHeight / 2.5 - (fontSize * 1.2) / 2}
          width={coverSizeWidth / 1.8}
          align="center"
          fill={color}
          text="Error (Retry)"
          onClick={onRetry}
        />
      )}
    </>
  );
};
