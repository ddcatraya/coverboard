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
        width={coverSize * 2}
        height={fontSize}
        fill={backColorMap[configs.backColor]}
        listening={false}
      />
      <Text
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
