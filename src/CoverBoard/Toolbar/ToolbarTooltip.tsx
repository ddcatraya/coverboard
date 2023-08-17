import { Group, Rect, Text } from 'react-konva';

import { useCoverContext, useSizesContext, useToolbarContext } from 'contexts';
import { backColorMap } from 'types';

export const ToolbarTooltip: React.FC = () => {
  const { coverSize, fontSize } = useSizesContext();
  const { configs } = useCoverContext();
  const { tooltip } = useToolbarContext();

  if (!tooltip) return null;

  return (
    <Group x={tooltip.x - fontSize / 2} y={tooltip.y - fontSize / 2}>
      <Rect
        x={0}
        y={0}
        width={coverSize * 2}
        height={fontSize}
        fill={backColorMap[configs.backColor]}
      />
      <Text
        x={0}
        y={0}
        width={coverSize * 2}
        align="left"
        text={tooltip.text}
        fontSize={fontSize}
        fill="white"
      />
    </Group>
  );
};
