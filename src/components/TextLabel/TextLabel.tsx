import { Rect, Text } from 'react-konva';
import { Html } from 'react-konva-utils';
import { TextLabelPopover } from '.';
import { KonvaEventObject } from 'konva/lib/Node';
import { buildTitle } from 'types';
import { useMainStore } from 'store';
import { RefObject, useEffect, useRef, useState } from 'react';
import Konva from 'konva';

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
  wrap?: 'word' | 'char' | 'none';
  fontStyle?: 'bold';
  color: string;
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
  wrap = 'none',
  title,
  color,
  fontStyle,
}) => {
  const fontSize = useMainStore((state) => state.fontSize());
  const backColor = useMainStore((state) => state.getBackColor());
  const saveId = useMainStore((state) => state.saveId);
  const textRef: RefObject<Konva.Text> = useRef(null);
  const [textWidth, setTextWidth] = useState(0);

  const handleSubmit = (text: string) => {
    setOpen(false);
    setLabel(text);
  };

  const getDefaultLabel = () => {
    if (label === buildTitle(saveId)) return '';

    if (label === '<add text>') return '';

    return label;
  };

  useEffect(() => {
    if (textRef.current) {
      setTextWidth(textRef.current.getTextWidth());
    }
  }, [textRef, label, fontSize]);

  const getXTextPos = () => {
    if (pos.align === 'left') {
      return pos.x;
    } else if (pos.align === 'right') {
      return pos.x + pos.width - textWidth;
    }
    return pos.x + pos.width / 2 - textWidth / 2;
  };

  return (
    <>
      {!open && (
        <>
          <Rect
            listening={false}
            x={getXTextPos()}
            y={pos.y}
            fill={backColor}
            width={textWidth}
            height={fontSize * labelSize}
          />
          <Text
            ref={textRef}
            listening={listening}
            align={pos.align}
            text={label}
            fontStyle={fontStyle}
            x={pos.x}
            y={pos.y}
            wrap={wrap}
            ellipsis={true}
            width={pos.width}
            fontSize={fontSize * labelSize}
            fill={color}
            onClick={editable ? () => setOpen(true) : undefined}
            onDblTap={editable ? () => setOpen(true) : undefined}
            onMouseMove={(evt: KonvaEventObject<MouseEvent>) => {
              const container = evt.target.getStage()?.container();
              if (editable) {
                evt.currentTarget.opacity(0.5);
                if (container) {
                  container.style.cursor = 'pointer';
                }
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
        </>
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
            fill={color}
            fillBack={backColor}
          />
        </Html>
      )}
    </>
  );
};
