import { useCoverContext, useSizesContext } from 'contexts';
import { Text } from 'react-konva';
import { Html } from 'react-konva-utils';
import { TextLabelPopover } from '.';
import { KonvaEventObject } from 'konva/lib/Node';
import { colorMap } from 'types';

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

  const handleSubmit = (text: string) => {
    setOpen(false);
    setLabel(text);
  };

  return (
    <>
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

          if (container) {
            container.style.cursor = 'pointer';
          }
        }}
        onMouseLeave={(evt: KonvaEventObject<MouseEvent>) => {
          const container = evt.target.getStage()?.container();

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
            defaultText={label}
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
