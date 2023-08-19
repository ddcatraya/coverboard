import React, { useState } from 'react';
import { TextField, Button, Grid } from '@mui/material';

import { SearchParams, PopupState, ToolConfigIDs } from 'types';
import { clearHash, setHash } from 'utils';
import { CommonDialog } from 'components';

interface PopupProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (inputArray: Array<SearchParams>) => void;
}

const initialState = () => [
  { [PopupState.ARTIST]: '', [PopupState.ALBUM]: '' },
  { [PopupState.ARTIST]: '', [PopupState.ALBUM]: '' },
  { [PopupState.ARTIST]: '', [PopupState.ALBUM]: '' },
  { [PopupState.ARTIST]: '', [PopupState.ALBUM]: '' },
  { [PopupState.ARTIST]: '', [PopupState.ALBUM]: '' },
];

export const ToolbarSearchPopover: React.FC<PopupProps> = ({
  open,
  onClose,
  onSubmit,
}) => {
  const [inputs, setInputs] = useState<Array<SearchParams>>(initialState());
  const [loading, setLoading] = useState(false);

  setHash(ToolConfigIDs.SEARCH);

  const handleInputChange = (
    index: number,
    field: PopupState,
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

    setLoading(true);
    try {
      const filterInputs = inputs.filter(
        (input) => input.artist !== '' && input.album !== '',
      );
      await onSubmit(filterInputs);
      setInputs(initialState());
      onClose();
    } finally {
      setLoading(false);
      clearHash();
    }
  };

  const isInputDisabled =
    !!inputs.find(
      (input) =>
        (input.artist !== '' && input.album === '') ||
        (input.artist === '' && input.album !== ''),
    ) || !inputs.some((input) => input.artist !== '' && input.album !== '');

  return (
    <CommonDialog open={open} title="Search albums" onClose={onClose}>
      <form onSubmit={handleSubmit}>
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
                label="Artist Name"
                value={input.artist}
                onChange={(e) =>
                  handleInputChange(index, PopupState.ARTIST, e.target.value)
                }
              />
            </Grid>
            <Grid item sm={6} xs={12}>
              <TextField
                fullWidth
                label="Album Name"
                value={input.album}
                onChange={(e) =>
                  handleInputChange(index, PopupState.ALBUM, e.target.value)
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
