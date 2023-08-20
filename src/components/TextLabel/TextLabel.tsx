import { useCoverContext, useSizesContext } from 'contexts';
import { Text } from 'react-konva';
import { Html } from 'react-konva-utils';
import { TextLabelPopover } from '.';
import { KonvaEventObject } from 'konva/lib/Node';
import { backColorMap, buildTitle, colorMap } from 'types';

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
  const { fontSize } = useSizesContext();
  const { configs, saveId } = useCoverContext();

  const handleSubmit = (text: string) => {
    setOpen(false);
    setLabel(text);
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
          onClick={() => setOpen(true)}
          onDblTap={() => setOpen(true)}
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
            defaultText={label === buildTitle(saveId) ? '' : label}
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
