import { KonvaEventObject } from 'konva/lib/Node';
import { Group, Rect, Text } from 'react-konva';

import { useCoverContext, useSizesContext, useToolbarContext } from 'contexts';
import { ToolConfig, ToolConfigIDs } from 'types';
import { clearHash, setHash } from 'utils';

const MIN_OPACITY = 0.3;

interface ToolbarIconProps {
  config: ToolConfig;
  index: number;
}

export const ToolbarIcon: React.FC<ToolbarIconProps> = ({ config, index }) => {
  const { setErase, setPoints, setEditLines } = useCoverContext();
  const { getCurrentY, toobarIconSize } = useSizesContext();
  const { setTooltip } = useToolbarContext();

  const handleMouseMove = (evt: KonvaEventObject<MouseEvent>, tip: string) => {
    setTooltip({
      text: tip,
      x: evt.evt.clientX,
      y: evt.evt.clientY,
    });
  };

  const handleClick = () => {
    setPoints(null);

    if (config.id !== ToolConfigIDs.ERASE) {
      setErase(false);
    } else if (config.id === ToolConfigIDs.ERASE) {
      setHash(ToolConfigIDs.ERASE);
    }

    if (config.id !== ToolConfigIDs.ARROW) {
      setEditLines(false);
    } else if (config.id === ToolConfigIDs.ARROW) {
      setHash(ToolConfigIDs.ARROW);
    }

    if (config.value) {
      clearHash();
    }

    return config.value
      ? config.valueModifier(false)
      : config.valueModifier(true);
  };

  return (
    <Group
      key={config.id}
      x={toobarIconSize / 2}
      y={getCurrentY(index) + toobarIconSize / 2}
      listening={config.enabled}
      onTap={handleClick}
      onClick={handleClick}
      onMouseMove={(evt: KonvaEventObject<MouseEvent>) => {
        handleMouseMove(evt, config.tooltip);
        evt.currentTarget.opacity(0.5);
        const container = evt.target.getStage()?.container();

        if (container) {
          container.style.cursor = 'pointer';
        }
      }}
      onMouseLeave={(evt: KonvaEventObject<MouseEvent>) => {
        setTooltip(null);
        evt.currentTarget.opacity(1);
        const container = evt.target.getStage()?.container();

        if (container) {
          container.style.cursor = 'default';
        }
      }}>
      <Rect
        width={toobarIconSize}
        height={toobarIconSize}
        fill={config.color}
        opacity={config.value ? MIN_OPACITY : 1}
      />
      <Text
        y={toobarIconSize / 4}
        width={toobarIconSize}
        height={toobarIconSize}
        align="center"
        text={config.emoji}
        fontSize={toobarIconSize / 2}
        fill="black"
        opacity={config.value ? MIN_OPACITY : 1}
      />
      <Text
        x={toobarIconSize - toobarIconSize / 2 - 1}
        y={toobarIconSize - toobarIconSize / 4 - 1}
        width={toobarIconSize / 2}
        height={toobarIconSize / 2}
        align="right"
        fill="white"
        text={!!config.badge ? String(config.badge) : ''}
        fontSize={toobarIconSize / 3}
      />
    </Group>
  );
};
