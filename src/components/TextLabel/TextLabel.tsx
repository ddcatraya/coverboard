import { useCoverContext, useSizesContext } from 'contexts';
import { Rect, Text } from 'react-konva';
import { Html } from 'react-konva-utils';
import { TextLabelPopover } from '.';
import { KonvaEventObject } from 'konva/lib/Node';
import { colorMap, Modes } from 'types';
import { useState } from 'react';

interface TitleTexProps {
  label: string;
  setLabel: (title: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  pos: {
    x: number;
    y: number;
    width: number;
    align: string;
  };
  labelSize?: number;
  onReset: () => void;
  listening?: boolean;
  hasReset?: boolean;
  title?: string;
}

export const TextLabel: React.FC<TitleTexProps> = ({
  label,
  setLabel,
  pos,
  open,
  setOpen,
  labelSize = 1,
  onReset,
  listening = true,
  hasReset = false,
  title,
}) => {
  const { fontSize } = useSizesContext();
  const { configs } = useCoverContext();
  const [isHovering, setHovering] = useState(false);

  const handleSubmit = (text: string) => {
    setOpen(false);
    setLabel(text);
  };

  return (
    <>
      {isHovering && (
        <Rect
          x={pos.x}
          y={pos.y}
          width={pos.width}
          height={fontSize * labelSize}
          stroke={colorMap[configs.color]}
          strokeWidth={0.3}
          listening={false}
        />
      )}
      <Text
        listening={listening}
        align={pos.align}
        text={label}
        x={pos.x}
        y={pos.y}
        width={pos.width}
        fontSize={fontSize * labelSize}
        fill={colorMap[configs.color]}
        onClick={() => setOpen(true)}
        onDblTap={() => setOpen(true)}
        onMouseMove={(evt: KonvaEventObject<MouseEvent>) => {
          const container = evt.target.getStage()?.container();
          setHovering(true);
          evt.currentTarget.opacity(0.5);
          if (container) {
            container.style.cursor = 'pointer';
          }
        }}
        onMouseLeave={(evt: KonvaEventObject<MouseEvent>) => {
          const container = evt.target.getStage()?.container();
          setHovering(false);
          evt.currentTarget.opacity(1);
          if (container) {
            container.style.cursor = 'default';
          }
        }}
      />
      {open && (
        <Html>
          <TextLabelPopover
            open={open}
            onClose={() => setOpen(false)}
            onSubmit={handleSubmit}
            defaultText={label === Modes.TITLE ? '' : label}
            onReset={() => {
              onReset();
              setOpen(false);
            }}
            hasReset={hasReset}
            title={title}
          />
        </Html>
      )}
    </>
  );
};
