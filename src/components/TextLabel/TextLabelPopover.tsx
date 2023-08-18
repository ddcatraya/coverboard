import React, { useState } from 'react';
import { Modal, TextField, Button } from '@mui/material';

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
    <Modal open={open} onClose={onClose} style={{ overflow: 'scroll' }}>
      <form
        onSubmit={handleSubmit}
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'white',
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
          style={{ marginRight: '10px' }}>
          Submit
        </Button>
        {hasReset && (
          <Button
            variant="contained"
            color="primary"
            type="button"
            onClick={onReset}>
            Reset
          </Button>
        )}
      </form>
    </Modal>
  );
};
