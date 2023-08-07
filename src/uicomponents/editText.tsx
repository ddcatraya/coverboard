import {
  Modal,
  TextField,
  Button,
  SelectChangeEvent,
  Radio,
  FormControlLabel,
  RadioGroup,
} from '@mui/material';
import { RenderDir } from 'conva/components/DrawLines';
import React, { useState } from 'react';

interface PopupProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (text: string, dir: RenderDir) => void;
  defaultText: string;
  defaultDir: RenderDir;
}

export const EditText: React.FC<PopupProps> = ({
  open,
  onClose,
  onSubmit,
  defaultText,
  defaultDir,
}) => {
  const [text, setText] = useState(defaultText);
  const [dir, setDir] = useState(defaultDir);

  const handTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setText(event.target.value);
  };

  const handDirChange = (event: SelectChangeEvent<string>) => {
    setDir(event.target.value as RenderDir);
  };

  const handleSubmit = (evt: any) => {
    evt.preventDefault();
    onSubmit(text, dir);
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
          label="Edit text"
          value={text}
          onChange={handTextChange}
          fullWidth
          style={{ marginBottom: '20px' }}
        />
        <RadioGroup
          name="controlled-radio-buttons-group"
          value={dir}
          onChange={handDirChange}
          style={{ marginBottom: '20px' }}>
          <FormControlLabel
            value={RenderDir.DOWN}
            control={<Radio />}
            label="Down"
          />
          <FormControlLabel
            value={RenderDir.UP}
            control={<Radio />}
            label="Up"
          />
          <FormControlLabel
            value={RenderDir.LEFT}
            control={<Radio />}
            label="Left"
          />
          <FormControlLabel
            value={RenderDir.RIGHT}
            control={<Radio />}
            label="Right"
          />
        </RadioGroup>
        <Button variant="contained" color="primary" type="submit">
          Submit
        </Button>
      </form>
    </Modal>
  );
};
