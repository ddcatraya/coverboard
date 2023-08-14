import React, { useState } from 'react';
import {
  Modal,
  Button,
  Grid,
  FormControlLabel,
  Switch,
  Slider,
  Typography,
  FormControl,
  Radio,
  RadioGroup,
  TextField,
} from '@mui/material';
import {
  Colors,
  PosTypes,
  ToolbarConfigParams,
  ToolbarConfigValues,
} from 'types';

interface ToolbarConfigPopoverProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (
    config: ToolbarConfigParams,
    updatedParam?: ToolbarConfigValues,
  ) => void;
  config: ToolbarConfigParams;
  handleResetSettings: () => void;
  handleResetElements: () => void;
}

export const ToolbarConfigPopover: React.FC<ToolbarConfigPopoverProps> = ({
  open,
  onClose,
  onSubmit,
  config,
  handleResetSettings,
  handleResetElements,
}) => {
  const [param, setParams] = useState(config);

  const handleNumberChange = (
    event: any,
    updatedParam: ToolbarConfigValues,
  ) => {
    const obj = { ...param, [updatedParam]: Number(event.target.value * 100) };
    setParams(obj);
    onSubmit(obj, updatedParam);
  };

  const handleChange = (event: any, updatedParam: ToolbarConfigValues) => {
    const obj = { ...param, [updatedParam]: event.target.value };
    setParams(obj);
    onSubmit(obj, updatedParam);
  };

  const handleSubmit = (evt: React.SyntheticEvent<HTMLFormElement>) => {
    evt.preventDefault();

    onSubmit(param);
    onClose();
  };

  const handleSwitchChange = (
    event: any,
    updatedParam: ToolbarConfigValues,
  ) => {
    const obj = { ...param, [updatedParam]: event.target.checked };
    setParams(obj);
    onSubmit(obj, updatedParam);
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
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Title"
              value={param[ToolbarConfigValues.TITLE]}
              onChange={(e) => handleChange(e, ToolbarConfigValues.TITLE)}
              style={{ marginBottom: '10px' }}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography gutterBottom>Elements size:</Typography>
            <Slider
              min={0.5}
              max={2}
              step={0.1}
              valueLabelDisplay="on"
              defaultValue={param[ToolbarConfigValues.SIZE] / 100}
              value={param[ToolbarConfigValues.SIZE] / 100}
              onChange={(evt) =>
                handleNumberChange(evt, ToolbarConfigValues.SIZE)
              }
            />
          </Grid>
          <Grid item xs={12}>
            <label>Pick a font color: </label>
            {Object.values(Colors).map((color) => (
              <Button
                key={color}
                value={color}
                onClick={(evt) => handleChange(evt, ToolbarConfigValues.COLOR)}
                style={{
                  backgroundColor: color,
                  height: '30px',
                  width: '30px',
                  margin: '0px 5px',
                  border:
                    color === param[ToolbarConfigValues.COLOR]
                      ? '2px solid black'
                      : undefined,
                }}
              />
            ))}
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={param[ToolbarConfigValues.SHOW_TITLE]}
                  onChange={(evt) =>
                    handleSwitchChange(evt, ToolbarConfigValues.SHOW_TITLE)
                  }
                />
              }
              label="Show main title"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={param[ToolbarConfigValues.SHOW_ARTIST]}
                  onChange={(evt) =>
                    handleSwitchChange(evt, ToolbarConfigValues.SHOW_ARTIST)
                  }
                />
              }
              label="Show artist name"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={param[ToolbarConfigValues.SHOW_ALBUM]}
                  onChange={(evt) =>
                    handleSwitchChange(evt, ToolbarConfigValues.SHOW_ALBUM)
                  }
                />
              }
              label="Show album name"
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl>
              <label>Cover labels position:</label>
              <RadioGroup
                row
                aria-label="position"
                name="position"
                value={param[ToolbarConfigValues.LABEL_DIR]}
                onChange={(evt) =>
                  handleChange(evt, ToolbarConfigValues.LABEL_DIR)
                }>
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
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              style={{ marginRight: '20px' }}>
              Submit
            </Button>
            <Button
              variant="contained"
              color="primary"
              type="button"
              style={{ marginRight: '20px' }}
              onClick={() => {
                handleResetSettings();
                onClose();
              }}>
              Reset Settings
            </Button>
            <Button
              variant="contained"
              color="primary"
              type="button"
              onClick={() => {
                handleResetElements();
                onClose();
              }}>
              Reset Elements
            </Button>
          </Grid>
        </Grid>
      </form>
    </Modal>
  );
};
