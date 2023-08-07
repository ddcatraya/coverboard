import { Modal, TextField, Button } from '@mui/material';
import React, { useState } from 'react';

interface ChangeSizeProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (text: string) => void;
  defaultSize: string;
}

export const ChangeSize: React.FC<ChangeSizeProps> = ({
  open,
  onClose,
  onSubmit,
  defaultSize,
}) => {
  const [text, setText] = useState(defaultSize);

  const handTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setText(event.target.value);
  };

  const handleSubmit = (evt: any) => {
    evt.preventDefault();

    onSubmit(text);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
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
          type="number"
          label="Edit size of cover"
          value={text}
          onChange={handTextChange}
          fullWidth
          style={{ marginBottom: '20px' }}
        />
        <Button variant="contained" color="primary" type="submit">
          Submit
        </Button>
      </form>
    </Modal>
  );
};
