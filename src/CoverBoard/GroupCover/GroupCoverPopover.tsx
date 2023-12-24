import React, { useState } from 'react';
import { TextField, Button, Grid, Slider, Typography } from '@mui/material';
import { GroupCovers } from 'types';
import { CommonDialog } from 'components';
import { useMainStore } from 'store';

interface PopupProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (
    title: string,
    currentScale: { scaleX: number; scaleY: number },
  ) => void;
  title: string;
  id: GroupCovers['id'];
}

export const GroupCoverPopover: React.FC<PopupProps> = ({
  open,
  onClose,
  onSubmit,
  title,
  id,
}) => {
  const scale = useMainStore((state) => state.getScale(id));
  const [text, setText] = useState(title);
  const [currentScale, setCurrentScale] = useState(scale);

  const handTextChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setText(event.target.value);
  };

  const handleNumberChange = (
    _: Event,
    value: number | number[],
    scaleType: 'scaleX' | 'scaleY',
  ) => {
    if (Array.isArray(value)) return;

    setCurrentScale((prevScale) => ({
      ...prevScale,
      [scaleType]: value,
    }));
  };

  const handleSubmit = (evt: React.SyntheticEvent<HTMLFormElement>) => {
    evt.preventDefault();
    onSubmit(text, currentScale);
    onClose();
  };

  return (
    <CommonDialog open={open} onClose={onClose} title="Edit group">
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="group title"
              fullWidth
              value={text}
              onChange={handTextChange}
              style={{ marginBottom: '20px' }}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography gutterBottom>ScaleX:</Typography>
            <Slider
              min={0}
              max={10}
              step={0.5}
              valueLabelDisplay="on"
              defaultValue={currentScale.scaleX}
              value={currentScale.scaleX}
              onChange={(evt, value) =>
                handleNumberChange(evt, value, 'scaleX')
              }
            />
          </Grid>
          <Grid item xs={12}>
            <Typography gutterBottom>ScaleY:</Typography>
            <Slider
              min={0}
              max={10}
              step={0.5}
              valueLabelDisplay="on"
              defaultValue={currentScale.scaleY}
              value={currentScale.scaleY}
              onChange={(evt, value) =>
                handleNumberChange(evt, value, 'scaleY')
              }
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              style={{ marginRight: '20px', marginBottom: '20px' }}>
              Submit
            </Button>
          </Grid>
        </Grid>
      </form>
    </CommonDialog>
  );
};
