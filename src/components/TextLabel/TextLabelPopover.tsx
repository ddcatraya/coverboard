import React, { useState } from 'react';
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

export const TextLabelPopover: React.FC<PopupProps> = ({
  open,
  onClose,
  onSubmit,
  onReset,
  defaultText,
  title = 'label',
  hasReset = false,
  fontSize,
  fill,
  fillBack,
  pos,
}) => {
  const [text, setText] = useState(defaultText);

  const handTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setText(event.target.value);
  };

  const submitText = () => {
    onSubmit(text.trim());
    setText('');
    onClose();
  };

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

/* 
<Dialog open={open} onClose={onClose}>
      <form
        onSubmit={handleSubmit}
        style={{
          padding: '20px',
          borderRadius: '5px',
        }}>
        <TextField
          label={`Edit ${title}`}
          value={text}
          onChange={handTextChange}
          fullWidth
          style={{ marginBottom: '20px' }}
        />
        <Button
          variant="contained"
          color="primary"
          type="submit"
          style={{ marginRight: '20px', marginBottom: '20px' }}>
          Submit
        </Button>
        {hasReset && (
          <Button
            variant="contained"
            color="primary"
            type="button"
            onClick={onReset}
            style={{ marginBottom: '20px' }}>
            Reset
          </Button>
        )}
      </form>
    </Dialog>
    */
