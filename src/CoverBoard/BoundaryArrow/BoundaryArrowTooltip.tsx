import Konva from 'konva';
import { RefObject, useRef, useState, useEffect } from 'react';
import { Group, Rect, Text } from 'react-konva';
import { useMainStore } from 'store';
import { Covers } from 'types';

interface BoundaryArrowTooltipProps {
  album: Covers['album']['text'];
  points: [number, number, number, number];
}

export const BoundaryArrowTooltip: React.FC<BoundaryArrowTooltipProps> = ({
  album,
  points,
}) => {
  const coverSize = useMainStore((state) => state.configs.size);
  const fontSize = useMainStore((state) => state.fontSize());
  const backColor = useMainStore((state) => state.getBackColor());
  const textRef: RefObject<Konva.Text> = useRef(null);
  const [textWidth, setTextWidth] = useState(0);

  useEffect(() => {
    if (textRef.current) {
      setTextWidth(textRef.current.getTextWidth());
    }
  }, [textRef, album]);

  return (
    <Group x={points[0] - 2 * coverSize - fontSize} y={points[1] - fontSize}>
      <Rect
        x={coverSize * 2 - textWidth}
        width={textWidth}
        height={fontSize}
        fill={backColor}
        listening={false}
      />
      <Text
        ref={textRef}
        width={coverSize * 2}
        align="right"
        text={album}
        fontSize={fontSize}
        fill="white"
        listening={false}
      />
    </Group>
  );
};
