import Konva from 'konva';
import { RefObject, useEffect, useRef, useState } from 'react';
import { Group, Rect, Text } from 'react-konva';

import { useMainStore, useToolbarStore } from 'store';

export const ToolbarTooltip: React.FC = () => {
  const fontSize = useMainStore((state) => state.fontSize());
  const coverSize = useMainStore((state) => state.configs.size);
  const backColor = useMainStore((state) => state.getBackColor());
  const tooltip = useToolbarStore((state) => state.tooltip);
  const textRef: RefObject<Konva.Text> = useRef(null);
  const [textWidth, setTextWidth] = useState(0);

  useEffect(() => {
    if (textRef.current) {
      setTextWidth(textRef.current.getTextWidth());
    }
  }, [textRef, tooltip]);

  if (!tooltip) return null;

  return (
    <Group x={tooltip.x - fontSize / 2} y={tooltip.y - fontSize / 2}>
      <Rect
        width={textWidth}
        height={fontSize}
        fill={backColor}
        listening={false}
      />
      <Text
        ref={textRef}
        width={coverSize * 2}
        align="left"
        text={tooltip.text}
        fontSize={fontSize}
        fill="white"
        listening={false}
      />
    </Group>
  );
};
