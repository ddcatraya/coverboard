import { Text } from 'react-konva';
import { Html } from 'react-konva-utils';
import { TextLabelPopover } from '.';
import { KonvaEventObject } from 'konva/lib/Node';
import { backColorMap, buildTitle, colorMap } from 'types';
import { useMainStore } from 'store';

interface TitleTexProps {
  label: string;
  setLabel: (title: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  pos: {
    x: number;
    y: number;
    width: number;
    align: 'center' | 'left' | 'right';
  };
  labelSize?: number;
  onReset: () => void;
  listening?: boolean;
  hasReset?: boolean;
  title?: string;
  editable?: boolean;
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
  editable = true,
  title,
}) => {
  const fontSize = useMainStore((state) => state.fontSize());
  const configs = useMainStore((state) => state.configs);
  const saveId = useMainStore((state) => state.saveId);

  const handleSubmit = (text: string) => {
    setOpen(false);
    setLabel(text);
  };

  const getDefaultLabel = () => {
    if (label === buildTitle(saveId)) return '';

    if (label === '<add text>') return '';

    return label;
  };

  return (
    <>
      {!open && (
        <Text
          listening={listening}
          align={pos.align}
          text={label}
          x={pos.x}
          y={pos.y}
          width={pos.width}
          fontSize={fontSize * labelSize}
          fill={colorMap[configs.color]}
          onClick={editable ? () => setOpen(true) : undefined}
          onDblTap={editable ? () => setOpen(true) : undefined}
          onMouseMove={(evt: KonvaEventObject<MouseEvent>) => {
            const container = evt.target.getStage()?.container();
            evt.currentTarget.opacity(0.5);
            if (container) {
              container.style.cursor = 'pointer';
            }
          }}
          onMouseLeave={(evt: KonvaEventObject<MouseEvent>) => {
            const container = evt.target.getStage()?.container();
            evt.currentTarget.opacity(1);
            if (container) {
              container.style.cursor = 'default';
            }
          }}
        />
      )}
      {open && editable && (
        <Html>
          <TextLabelPopover
            open={open}
            onClose={() => setOpen(false)}
            onSubmit={handleSubmit}
            defaultText={getDefaultLabel()}
            onReset={() => {
              onReset();
              setOpen(false);
            }}
            hasReset={hasReset}
            title={title}
            pos={pos}
            fontSize={fontSize * labelSize}
            fill={colorMap[configs.color]}
            fillBack={backColorMap[configs.backColor]}
          />
        </Html>
      )}
    </>
  );
};
