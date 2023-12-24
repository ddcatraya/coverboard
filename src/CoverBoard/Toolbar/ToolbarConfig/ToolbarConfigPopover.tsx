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
  PosTypes,
  ToolbarConfigParams,
  ToolbarConfigValues,
  ToolConfigIDs,
} from 'types';
import { CommonDialog } from 'components';
import { useMainStore } from 'store';
interface ToolbarConfigPopoverProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (
    config: ToolbarConfigParams,
    updatedParam?: ToolbarConfigValues,
  ) => void;
  handleResetElements: () => void;
}

export const ToolbarConfigPopover: React.FC<ToolbarConfigPopoverProps> = ({
  open,
  onClose,
  onSubmit,
  handleResetElements,
}) => {
  const offLimitCovers = useMainStore((state) => state.offLimitCovers());
  const configs = useMainStore((state) => state.configs);
  const [param, setParams] = useState(configs);
  const titleLabel = useMainStore((state) => state.titleLabel().label);
  const subTitleLabel = useMainStore((state) => state.subTitleLabel().label);

  const handleNumberChange = (
    _: Event,
    value: number | number[],
    updatedParam: ToolbarConfigValues,
  ) => {
    if (Array.isArray(value)) return;
    const obj = { ...param, [updatedParam]: Number(value * 100) };
    setParams(obj);
    onSubmit(obj, updatedParam);
  };

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    updatedParam: ToolbarConfigValues,
  ) => {
    const obj = { ...param, [updatedParam]: event.target.value };
    setParams(obj);
    onSubmit(obj, updatedParam);
  };

  const handleButtonChange = (
    event: React.MouseEvent<HTMLButtonElement>,
    updatedParam: ToolbarConfigValues,
  ) => {
    const obj = {
      ...param,
      [updatedParam]: (event.target as HTMLButtonElement).value,
    };
    setParams(obj);
    onSubmit(obj, updatedParam);
  };

  const handleSubmit = (evt: React.SyntheticEvent<HTMLFormElement>) => {
    evt.preventDefault();

    onClose();
  };

  const handleSwitchChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    updatedParam: ToolbarConfigValues,
  ) => {
    const obj = { ...param, [updatedParam]: event.target.checked };
    setParams(obj);
    onSubmit(obj, updatedParam);
  };

  return (
    <CommonDialog
      open={open}
      onClose={onClose}
      title="Settings"
      hash={ToolConfigIDs.CONFIG}>
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
              onChange={(evt, value) =>
                handleNumberChange(evt, value, ToolbarConfigValues.SIZE)
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
                onClick={(evt) =>
                  handleButtonChange(evt, ToolbarConfigValues.COLOR)
                }
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
            <Typography gutterBottom>Pick the arrows colors:</Typography>
            {Object.values(Colors).map((arrowColor) => (
              <Button
                title={arrowColor}
                key={arrowColor}
                value={arrowColor}
                onClick={(evt) =>
                  handleButtonChange(evt, ToolbarConfigValues.ARROW_COLOR)
                }
                style={{
                  backgroundColor: colorMap[arrowColor],
                  height: '30px',
                  width: '30px',
                  margin: '5px 5px',
                  border:
                    arrowColor === param[ToolbarConfigValues.ARROW_COLOR]
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
                  handleButtonChange(evt, ToolbarConfigValues.BACK_COLOR)
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
                  checked={param[ToolbarConfigValues.SHOW_MAIN_TITLE]}
                  onChange={(evt) =>
                    handleSwitchChange(evt, ToolbarConfigValues.SHOW_MAIN_TITLE)
                  }
                />
              }
              label="Show main title"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={param[ToolbarConfigValues.SHOW_TITLE]}
                  onChange={(evt) =>
                    handleSwitchChange(evt, ToolbarConfigValues.SHOW_TITLE)
                  }
                />
              }
              label={`Show ${titleLabel} name`}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={param[ToolbarConfigValues.SHOW_SUBTITLE]}
                  onChange={(evt) =>
                    handleSwitchChange(evt, ToolbarConfigValues.SHOW_SUBTITLE)
                  }
                />
              }
              label={`Show ${subTitleLabel} name`}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={param[ToolbarConfigValues.SHOW_STARS]}
                  onChange={(evt) =>
                    handleSwitchChange(evt, ToolbarConfigValues.SHOW_STARS)
                  }
                />
              }
              label={`Show rating stars`}
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
            <FormControl>
              <label>Rating stars position:</label>
              <RadioGroup
                row
                aria-label="stars position"
                name="starPosition"
                value={param[ToolbarConfigValues.STARS_DIR]}
                onChange={(evt) =>
                  handleChange(evt, ToolbarConfigValues.STARS_DIR)
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
              Close
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
