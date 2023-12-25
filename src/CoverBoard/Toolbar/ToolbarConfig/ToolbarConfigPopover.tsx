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
  Select,
  MenuItem,
  InputLabel,
} from '@mui/material';
import {
  backColorMap,
  BackColors,
  colorMap,
  Colors,
  ColorSettings,
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
}

export const ToolbarConfigPopover: React.FC<ToolbarConfigPopoverProps> = ({
  open,
  onClose,
  onSubmit,
}) => {
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
            {ColorSettings.map((colorSetting) => (
              <FormControl sx={{ m: 1, minWidth: 120 }} key={colorSetting.name}>
                <InputLabel variant="outlined" htmlFor={colorSetting.name}>
                  {colorSetting.label}
                </InputLabel>
                <Select
                  labelId={colorSetting.name}
                  id={colorSetting.name}
                  label={colorSetting.label}
                  value={param[colorSetting.name]}
                  onChange={(evt) =>
                    handleButtonChange(evt as any, colorSetting.name)
                  }>
                  {Object.values(Colors).map((clr) => (
                    <MenuItem value={clr} key={clr}>
                      <Button
                        style={{
                          backgroundColor: colorMap[clr],
                          color: 'white',
                          fontSize: '10px',
                          fontWeight: 'bold',
                          height: '30px',
                          width: '25x',
                          margin: '0px 10px',
                          border:
                            clr === param[colorSetting.name]
                              ? '1px solid black'
                              : undefined,
                        }}>
                        {clr}
                      </Button>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            ))}
            <FormControl sx={{ m: 1, minWidth: 120 }}>
              <InputLabel
                variant="outlined"
                htmlFor={ToolbarConfigValues.BACK_COLOR}>
                Back Color
              </InputLabel>
              <Select
                labelId={ToolbarConfigValues.BACK_COLOR}
                id={ToolbarConfigValues.BACK_COLOR}
                value={param[ToolbarConfigValues.BACK_COLOR]}
                label="Back Color"
                onChange={(evt) =>
                  handleButtonChange(evt as any, ToolbarConfigValues.BACK_COLOR)
                }>
                {Object.values(BackColors).map((clr) => (
                  <MenuItem value={clr} key={clr}>
                    <Button
                      style={{
                        backgroundColor: backColorMap[clr],
                        height: '30px',
                        width: '25x',
                        color: 'white',
                        fontSize: '10px',
                        fontWeight: 'bold',
                        margin: '0px 10px',
                        border:
                          clr === param[ToolbarConfigValues.BACK_COLOR]
                            ? '1px solid black'
                            : undefined,
                      }}>
                      {clr}
                    </Button>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
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
              <label>Cover labels default position:</label>
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
              <label>Rating stars default position:</label>
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
          </Grid>
        </Grid>
      </form>
    </CommonDialog>
  );
};
