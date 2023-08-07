import React, { useState } from 'react';
import { Modal, TextField, Button, Grid } from '@mui/material';

import { SearchParams, PopupState } from 'types';

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
    }
  };

  const handleClose = () => {
    setInputs(initialState());
    onClose();
  };

  const isInputDisabled =
    !!inputs.find(
      (input) =>
        (input.artist !== '' && input.album === '') ||
        (input.artist === '' && input.album !== ''),
    ) || !inputs.some((input) => input.artist !== '' && input.album !== '');

  return (
    <Modal open={open} onClose={handleClose}>
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
        <br />
        <Button
          variant="contained"
          color="primary"
          disabled={isInputDisabled || loading}
          type="submit">
          Submit
        </Button>
      </form>
    </Modal>
  );
};
