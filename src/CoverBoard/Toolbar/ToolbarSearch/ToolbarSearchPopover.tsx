import React, { useState } from 'react';
import {
  TextField,
  Button,
  Grid,
  FormControlLabel,
  Radio,
  RadioGroup,
} from '@mui/material';

import {
  LabelType,
  ToolConfigIDs,
  CoverValues,
  Media,
  MediaValues,
} from 'types';
import { CommonDialog } from 'components';
import { flushSync } from 'react-dom';
import { useMainStore } from 'store';
import { shallow } from 'zustand/shallow';

interface PopupProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (inputArray: Array<CoverValues>) => void;
}

const initialState = () => [
  { [LabelType.TITLE]: '', [LabelType.SUBTITLE]: '' },
  { [LabelType.TITLE]: '', [LabelType.SUBTITLE]: '' },
  { [LabelType.TITLE]: '', [LabelType.SUBTITLE]: '' },
  { [LabelType.TITLE]: '', [LabelType.SUBTITLE]: '' },
  { [LabelType.TITLE]: '', [LabelType.SUBTITLE]: '' },
];

export const ToolbarSearchPopover: React.FC<PopupProps> = ({
  open,
  onClose,
  onSubmit,
}) => {
  const [inputs, setInputs] = useState<Array<CoverValues>>(initialState());
  const [loading, setLoading] = useState(false);
  const [media, setMedia] = useMainStore(
    (state) => [state.configs.media, state.setMedia],
    shallow,
  );
  const coversLength = useMainStore((state) => state.covers.length);
  const titleLabel = useMainStore((state) => state.titleLabel());
  const subTitleLabel = useMainStore((state) => state.subTitleLabel());

  const handleInputChange = (
    index: number,
    field: LabelType,
    value: string,
  ) => {
    setInputs((prevInputs) => {
      const updatedInputs = [...prevInputs];
      updatedInputs[index][field] = value;
      return updatedInputs;
    });
  };

  const handleSubmit = async (evt: React.SyntheticEvent<HTMLFormElement>) => {
    evt.preventDefault();

    flushSync(() => {
      setLoading(true);
    });

    try {
      const filterInputs = inputs.filter(
        (input) =>
          input[LabelType.TITLE] !== '' || input[LabelType.SUBTITLE] !== '',
      );
      await onSubmit(filterInputs);
      setInputs(initialState());
      onClose();
    } catch (err) {
      if (err === 'NOT_FOUND') {
        return;
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleMediaChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    setMedia(evt.target.value as Media);
    setInputs(initialState());
  };

  let isInputDisabled =
    !!inputs.find(
      (input) =>
        (input[LabelType.TITLE] !== '' &&
          input[LabelType.SUBTITLE] === '' &&
          subTitleLabel.required) ||
        (input[LabelType.TITLE] === '' &&
          titleLabel.required &&
          input[LabelType.SUBTITLE] !== ''),
    ) ||
    inputs.every(
      (input) =>
        input[LabelType.TITLE] === '' && input[LabelType.SUBTITLE] === '',
    );

  if (subTitleLabel.label === MediaValues.YEAR) {
    const hasIncompleteYear = !!inputs.find(
      (input) =>
        input[LabelType.SUBTITLE].length > 0 &&
        input[LabelType.SUBTITLE].length !== 4,
    );

    if (hasIncompleteYear) {
      isInputDisabled = true;
    }
  }

  return (
    <CommonDialog
      open={open}
      title="Search and add"
      onClose={onClose}
      hash={ToolConfigIDs.SEARCH}>
      <form onSubmit={handleSubmit}>
        <Grid item sm={6} xs={12}>
          <label>
            Pick the media <small>(only if empty screen)</small>:
          </label>
          <RadioGroup
            row
            aria-label="media"
            name="media"
            value={media}
            style={{ marginBottom: '20px' }}
            onChange={handleMediaChange}>
            <FormControlLabel
              disabled={!!coversLength}
              value={Media.MUSIC}
              control={<Radio />}
              label={Media.MUSIC}
            />
            <FormControlLabel
              disabled={!!coversLength}
              value={Media.MOVIE}
              control={<Radio />}
              label={Media.MOVIE}
            />
            <FormControlLabel
              disabled={!!coversLength}
              value={Media.TVSHOW}
              control={<Radio />}
              label={Media.TVSHOW}
            />
            <FormControlLabel
              disabled={!!coversLength}
              value={Media.BOOK}
              control={<Radio />}
              label={Media.BOOK}
            />
            <FormControlLabel
              disabled={!!coversLength}
              value={Media.GAME}
              control={<Radio />}
              label={Media.GAME}
            />
          </RadioGroup>
        </Grid>
        {inputs.map((input, index) => (
          <Grid
            container
            rowGap={0.5}
            key={`input-${index}`}
            style={{
              marginBottom: '20px',
              backgroundColor: '#F2F4F7',
            }}>
            <Grid item sm={6} xs={12}>
              <TextField
                fullWidth
                label={`${titleLabel.label}${titleLabel.required ? '*' : ''}`}
                value={input[LabelType.TITLE]}
                onChange={(e) =>
                  handleInputChange(index, LabelType.TITLE, e.target.value)
                }
              />
            </Grid>
            <Grid item sm={6} xs={12}>
              <TextField
                fullWidth
                disabled={subTitleLabel.hidden}
                label={`${subTitleLabel.label}${
                  subTitleLabel.required ? '*' : ''
                }`}
                value={input[LabelType.SUBTITLE]}
                onChange={(e) =>
                  handleInputChange(index, LabelType.SUBTITLE, e.target.value)
                }
              />
            </Grid>
          </Grid>
        ))}
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            disabled={isInputDisabled || loading}
            type="submit">
            Submit
          </Button>
        </Grid>
      </form>
    </CommonDialog>
  );
};
