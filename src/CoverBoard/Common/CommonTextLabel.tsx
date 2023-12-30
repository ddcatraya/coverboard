import { Rect, Text } from 'react-konva';
import { Html } from 'react-konva-utils';
import { CommonTextLabelPopover } from './';
import { KonvaEventObject } from 'konva/lib/Node';
import { PosTypes, buildTitle } from 'types';
import { useMainStore } from 'store';
import { RefObject, useEffect, useRef, useState } from 'react';
import Konva from 'konva';
import { getAlign } from 'utils';

/* align: 'center' | 'left' | 'right'; */

interface TitleTexProps {
  label: string;
  setLabel: (title: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  x: number;
  y: number;
  width: number;
  dir: PosTypes;
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

export const CommonTextLabel: React.FC<TitleTexProps> = ({
  label,
  setLabel,
  x,
  y,
  dir,
  width,
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
  const align = getAlign(dir);

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
    if (align === 'left') {
      return x;
    } else if (align === 'right') {
      return x + width - textWidth;
    }
    return x + width / 2 - textWidth / 2;
  };

  return (
    <>
      {!open && (
        <>
          <Rect
            listening={false}
            x={getXTextPos()}
            y={y}
            fill={backColor}
            width={textWidth}
            height={fontSize * labelSize}
          />
          <Text
            ref={textRef}
            listening={listening}
            align={align}
            text={label}
            fontStyle={fontStyle}
            x={x}
            y={y}
            wrap={wrap}
            ellipsis={true}
            width={width}
            fontSize={fontSize * labelSize}
            fill={color}
            onClick={editable ? () => setOpen(true) : undefined}
            onDblTap={editable ? () => setOpen(true) : undefined}
            onMouseMove={(evt: KonvaEventObject<MouseEvent>) => {
              const container = evt.target.getStage()?.container();
              if (editable && listening) {
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
          <CommonTextLabelPopover
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
            x={x}
            y={y}
            width={width}
            align={align}
            fontSize={fontSize * labelSize}
            fill={color}
            fillBack={backColor}
          />
        </Html>
      )}
    </>
  );
};
