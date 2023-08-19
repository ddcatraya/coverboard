import React, { useState } from 'react';
import {
  Dialog,
  TextField,
  Button,
  Grid,
  DialogContent,
  DialogTitle,
  IconButton,
} from '@mui/material';

import { SearchParams, PopupState, ToolConfigIDs } from 'types';
import { clearHash, setHash } from 'utils';
import { Close as CloseIcon } from '@mui/icons-material';

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
      <DialogTitle>
        Search albums
        <IconButton
          aria-label="close"
          color="inherit"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
          }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <form
          onSubmit={handleSubmit}
          style={{
            padding: '20px',
            borderRadius: '5px',
          }}>
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
      </DialogContent>
    </Dialog>
  );
};
