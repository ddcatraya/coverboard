import React, { useState } from 'react';
import {
  TextField,
  Button,
  Grid,
  Slider,
  Typography,
  FormControlLabel,
  Radio,
  RadioGroup,
} from '@mui/material';
import { GroupCoverValues, GroupCovers, PosTypes } from 'types';
import { CommonDialog } from 'components';
import { useMainStore } from 'store';

interface PopupProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (
    text: GroupCoverValues,
    currentScale: { scaleX: number; scaleY: number },
  ) => void;
  values: GroupCoverValues;
  id: GroupCovers['id'];
}

export const GroupCoverPopover: React.FC<PopupProps> = ({
  open,
  onClose,
  onSubmit,
  values,
  id,
}) => {
  const scale = useMainStore((state) => state.getScale(id));
  const [text, setText] = useState<PopupProps['values']>(values);
  const [currentScale, setCurrentScale] = useState(scale);

  const handTextChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    label: 'title' | 'subtitle' | 'titleDir' | 'subTitleDir',
  ) => {
    setText((currentText) => ({
      ...currentText,
      [label]: event.target.value,
    }));
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

  const removeCoverAndRelatedLines = useMainStore(
    (state) => state.removeGroupAndRelatedLines,
  );
  const handleDelete = () => {
    removeCoverAndRelatedLines(id);
    onClose();
  };

  return (
    <CommonDialog open={open} onClose={onClose} title="Edit group">
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              autoFocus
              label="group title"
              fullWidth
              value={text.title}
              onChange={(evt) => handTextChange(evt, 'title')}
            />
            <RadioGroup
              row
              aria-label="position"
              name="position"
              value={text.titleDir}
              onChange={(evt) => handTextChange(evt, 'titleDir')}>
              <FormControlLabel
                value={PosTypes.BOTTOM}
                control={<Radio />}
                label={PosTypes.BOTTOM}
              />
              <FormControlLabel
                value={PosTypes.TOP}
                control={<Radio />}
                label={PosTypes.TOP}
              />
              <FormControlLabel
                value={PosTypes.LEFT}
                control={<Radio />}
                label={PosTypes.LEFT}
              />
              <FormControlLabel
                value={PosTypes.RIGHT}
                control={<Radio />}
                label={PosTypes.RIGHT}
              />
            </RadioGroup>
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="group description"
              fullWidth
              value={text.subtitle}
              onChange={(evt) => handTextChange(evt, 'subtitle')}
            />
            <RadioGroup
              row
              aria-label="position"
              name="position"
              value={text.subTitleDir}
              onChange={(evt) => handTextChange(evt, 'subTitleDir')}>
              <FormControlLabel
                value={PosTypes.BOTTOM}
                control={<Radio />}
                label={PosTypes.BOTTOM}
              />
              <FormControlLabel
                value={PosTypes.TOP}
                control={<Radio />}
                label={PosTypes.TOP}
              />
              <FormControlLabel
                value={PosTypes.LEFT}
                control={<Radio />}
                label={PosTypes.LEFT}
              />
              <FormControlLabel
                value={PosTypes.RIGHT}
                control={<Radio />}
                label={PosTypes.RIGHT}
              />
            </RadioGroup>
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
            <Button
              variant="contained"
              color="error"
              type="button"
              onClick={handleDelete}
              style={{ marginRight: '20px', marginBottom: '20px' }}>
              Delete
            </Button>
          </Grid>
        </Grid>
      </form>
    </CommonDialog>
  );
};
