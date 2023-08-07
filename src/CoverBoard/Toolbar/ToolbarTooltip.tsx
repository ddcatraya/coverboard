import { Group, Rect, Text } from 'react-konva';

import { useSizesContext, useToolbarContext } from 'contexts';

export const ToolbarTooltip: React.FC = () => {
  const { coverSize } = useSizesContext();
  const { fontSize } = useSizesContext();
  const { tooltip } = useToolbarContext();

  if (!tooltip) return null;

  return (
    <Group>
      <Rect
        x={tooltip.x + fontSize}
        y={tooltip.y}
        width={coverSize * 2}
        height={fontSize}
        fill="#282c34"
      />
      <Text
        x={tooltip.x + fontSize}
        y={tooltip.y}
        width={coverSize * 2}
        align="left"
        text={tooltip.text}
        fontSize={fontSize}
        fill="white"
      />
    </Group>
  );
};
