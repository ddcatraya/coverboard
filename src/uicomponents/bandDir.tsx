import {
  Modal,
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
  onSubmit: (dir: RenderDir) => void;
  defaultDir: RenderDir;
}

export const BandDir: React.FC<PopupProps> = ({
  open,
  onClose,
  onSubmit,
  defaultDir,
}) => {
  const [dir, setDir] = useState(defaultDir);

  const handDirChange = (event: SelectChangeEvent<string>) => {
    setDir(event.target.value as RenderDir);
  };

  const handleSubmit = (evt: any) => {
    evt.preventDefault();

    onSubmit(dir);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} onSubmit={handleSubmit}>
      <form
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'white',
          padding: '20px',
          borderRadius: '5px',
        }}>
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
        </RadioGroup>
        <Button variant="contained" color="primary" type="submit">
          Submit
        </Button>
      </form>
    </Modal>
  );
};
