import React, { useState } from 'react';
import { Dialog, TextField, Button } from '@mui/material';

interface PopupProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (text: string) => void;
  onReset: () => void;
  defaultText: string;
  title?: string;
  hasReset?: boolean;
}

export const TextLabelPopover: React.FC<PopupProps> = ({
  open,
  onClose,
  onSubmit,
  onReset,
  defaultText,
  title = 'label',
  hasReset = false,
}) => {
  const [text, setText] = useState(defaultText);

  const handTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setText(event.target.value);
  };

  const handleSubmit = (evt: React.SyntheticEvent<HTMLFormElement>) => {
    evt.preventDefault();
    onSubmit(text);
    setText('');
    onClose();
  };

  return (
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
  );
};
