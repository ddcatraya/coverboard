import React, { useState } from 'react';
import {
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
  backColorMap,
  BackColors,
  colorMap,
  Colors,
  Covers,
  PosTypes,
  ToolbarConfigParams,
  ToolbarConfigValues,
  ToolConfigIDs,
} from 'types';
import { setHash } from 'utils';
import { CommonDialog } from 'components';
interface ToolbarConfigPopoverProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (
    config: ToolbarConfigParams,
    updatedParam?: ToolbarConfigValues,
  ) => void;
  config: ToolbarConfigParams;
  handleResetElements: () => void;
  offLimitCovers: Array<Covers>;
}

export const ToolbarConfigPopover: React.FC<ToolbarConfigPopoverProps> = ({
  open,
  onClose,
  onSubmit,
  config,
  handleResetElements,
  offLimitCovers,
}) => {
  const [param, setParams] = useState(config);

  setHash(ToolConfigIDs.CONFIG);

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
    <CommonDialog open={open} onClose={onClose} title="Settings">
      <form onSubmit={handleSubmit}>
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
              max={1.5}
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
            <Typography gutterBottom>Pick a font color:</Typography>
            {Object.values(Colors).map((color) => (
              <Button
                title={color}
                key={color}
                value={color}
                onClick={(evt) => handleChange(evt, ToolbarConfigValues.COLOR)}
                style={{
                  backgroundColor: colorMap[color],
                  height: '30px',
                  width: '30px',
                  margin: '5px 5px',
                  border:
                    color === param[ToolbarConfigValues.COLOR]
                      ? '2px solid black'
                      : undefined,
                }}
              />
            ))}
          </Grid>
          <Grid item xs={12}>
            <Typography gutterBottom>Pick a background color:</Typography>
            {Object.values(BackColors).map((color) => (
              <Button
                title={color}
                key={color}
                value={color}
                onClick={(evt) =>
                  handleChange(evt, ToolbarConfigValues.BACK_COLOR)
                }
                style={{
                  backgroundColor: backColorMap[color],
                  height: '30px',
                  width: '30px',
                  margin: '5px 5px',
                  border:
                    color === param[ToolbarConfigValues.BACK_COLOR]
                      ? '2px solid red'
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
              style={{ marginRight: '20px', marginBottom: '20px' }}>
              Submit
            </Button>
            <Button
              variant="outlined"
              color="primary"
              type="button"
              disabled={offLimitCovers.length === 0}
              style={{ marginBottom: '20px' }}
              onClick={() => {
                handleResetElements();
                onClose();
              }}>
              Move {offLimitCovers.length} elem into view
            </Button>
          </Grid>
        </Grid>
      </form>
    </CommonDialog>
  );
};
