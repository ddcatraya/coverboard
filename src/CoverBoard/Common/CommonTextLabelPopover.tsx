import React, { useCallback, useEffect, useState } from 'react';
import { TextField } from '@mui/material';

interface PopupProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (text: string) => void;
  onReset: () => void;
  defaultText: string;
  title?: string;
  hasReset?: boolean;
  pos: {
    x: number;
    y: number;
    width: number;
    align: 'center' | 'left' | 'right';
  };
  fontSize: number;
  fill: string;
  fillBack: string;
}

export const CommonTextLabelPopover: React.FC<PopupProps> = ({
  onClose,
  onSubmit,
  defaultText,
  fontSize,
  fill,
  fillBack,
  pos,
}) => {
  const [text, setText] = useState(defaultText);

  const handTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setText(event.target.value);
  };

  const submitText = useCallback(() => {
    onSubmit(text.trim());
    setText('');
    onClose();
  }, [onClose, onSubmit, text]);

  useEffect(() => {
    const keyFn = (e) => {
      if (e.key === 'Enter') {
        submitText();
        e.preventDefault();
      } else if (e.key === 'Escape') {
        onClose();
        e.preventDefault();
      }
    };
    document.addEventListener('keydown', keyFn);

    return () => document.removeEventListener('keydown', keyFn);
  }, [onClose, submitText]);

  return (
    <div
      style={{
        position: 'absolute',
        left: pos.x + 'px',
        top: pos.y + 'px',
        width: pos.width + 'px',
      }}>
      <form
        onSubmit={(evt) => {
          evt.preventDefault();
          submitText();
        }}>
        <TextField
          autoFocus
          value={text}
          onChange={handTextChange}
          onBlur={submitText}
          fullWidth
          style={{
            backgroundColor: fillBack,
          }}
          inputProps={{
            style: {
              textAlign: pos.align,
              color: fill,
              fontSize: fontSize + 'px',
              height: fontSize + 'px',
              padding: fontSize / 8 + 'px',
            },
          }}
        />
      </form>
    </div>
  );
};
