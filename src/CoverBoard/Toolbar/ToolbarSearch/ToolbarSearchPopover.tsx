import React, { useState } from 'react';
import { Dialog, TextField, Button, Grid, Typography } from '@mui/material';

import { SearchParams, PopupState, ToolConfigIDs } from 'types';
import { clearHash, setHash } from 'utils';

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
    <Dialog
      open={open}
      onClose={() => {
        clearHash();
        onClose();
      }}>
      <form
        onSubmit={handleSubmit}
        style={{
          padding: '20px',
          borderRadius: '5px',
        }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h4" component="h4">
              Search albums
            </Typography>
          </Grid>
        </Grid>
        {inputs.map((input, index) => (
          <Grid container key={`input-${index}`} spacing="8">
            <Grid item xs={6}>
              <TextField
                label="Artist Name"
                value={input.artist}
                onChange={(e) =>
                  handleInputChange(index, PopupState.ARTIST, e.target.value)
                }
                style={{ marginBottom: '10px' }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Album Name"
                value={input.album}
                onChange={(e) =>
                  handleInputChange(index, PopupState.ALBUM, e.target.value)
                }
                style={{ marginBottom: '20px' }}
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
    </Dialog>
  );
};
