import { KonvaEventObject } from 'konva/lib/Node';
import { Group, Rect, Text } from 'react-konva';

import { useCoverContext, useSizesContext, useToolbarContext } from 'contexts';
import { ToolConfig, ToolConfigIDs } from 'types';

const MIN_OPACITY = 0.3;

interface ToolbarIconProps {
  config: ToolConfig;
  index: number;
}

export const ToolbarIcon: React.FC<ToolbarIconProps> = ({ config, index }) => {
  const { setErase, setPoints, setEditLines } = useCoverContext();
  const { initialX, getCurrentX, toobarIconSize } = useSizesContext();
  const { setTooltip } = useToolbarContext();

  const handleMouseMove = (evt: KonvaEventObject<MouseEvent>, tip: string) => {
    setTooltip({
      text: tip,
      x: evt.evt.clientX,
      y: evt.evt.clientY,
    });
  };

  return (
    <Group
      key={config.id}
      x={initialX}
      y={getCurrentX(index)}
      onClick={() => {
        setPoints(null);

        if (config.id !== ToolConfigIDs.ERASE) {
          setErase(false);
        }
        if (config.id !== ToolConfigIDs.ARROW) {
          setEditLines(false);
        }

        return config.value
          ? config.valueModifier(false)
          : config.valueModifier(true);
      }}
      onMouseMove={(evt: KonvaEventObject<MouseEvent>) => {
        handleMouseMove(evt, config.tooltip);
        const container = evt.target.getStage()?.container();

        if (container) {
          container.style.cursor = 'pointer';
        }
      }}
      onMouseLeave={(evt: KonvaEventObject<MouseEvent>) => {
        setTooltip(null);
        const container = evt.target.getStage()?.container();

        if (container) {
          container.style.cursor = 'default';
        }
      }}>
      <Rect
        width={toobarIconSize}
        height={toobarIconSize}
        fill={config.color}
        opacity={
          config.reverse
            ? config.value
              ? MIN_OPACITY
              : 1
            : config.value
            ? 1
            : MIN_OPACITY
        }
      />
      <Text
        x={0}
        y={toobarIconSize / 4}
        width={toobarIconSize}
        height={toobarIconSize}
        align="center"
        text={config.emoji}
        fontSize={toobarIconSize / 2}
        fill="black"
        opacity={
          config.reverse
            ? config.value
              ? MIN_OPACITY
              : 1
            : config.value
            ? 1
            : MIN_OPACITY
        }
      />
    </Group>
  );
};
