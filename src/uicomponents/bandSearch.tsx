import { Modal, TextField, Button, Grid } from '@mui/material';
import React, { useState } from 'react';

interface PopupProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (inputArray: Array<SearchParams>) => void;
}

enum PopupState {
  ARTIST = 'artist',
  ALBUM = 'album',
}

export interface SearchParams {
  [PopupState.ARTIST]: string;
  [PopupState.ALBUM]: string;
}

const bandArray = [
  {
    [PopupState.ARTIST]: 'Trees of Eternity',
    [PopupState.ALBUM]: 'Hour of the Nightingale',
  },
  {
    [PopupState.ARTIST]: 'Draconian',
    [PopupState.ALBUM]: 'Sovran',
  },
  {
    [PopupState.ARTIST]: 'Swallow the Sun',
    [PopupState.ALBUM]: 'Moonflowers',
  },
  {
    [PopupState.ARTIST]: 'Katatonia',
    [PopupState.ALBUM]: 'Discouraged Ones',
  },
  {
    [PopupState.ARTIST]: 'Theatre of Tragedy',
    [PopupState.ALBUM]: 'Aegis',
  },
];

const initialState = [
  { [PopupState.ARTIST]: '', [PopupState.ALBUM]: '' },
  { [PopupState.ARTIST]: '', [PopupState.ALBUM]: '' },
  { [PopupState.ARTIST]: '', [PopupState.ALBUM]: '' },
  { [PopupState.ARTIST]: '', [PopupState.ALBUM]: '' },
  { [PopupState.ARTIST]: '', [PopupState.ALBUM]: '' },
];

export const BandSearch: React.FC<PopupProps> = ({
  open,
  onClose,
  onSubmit,
}) => {
  const [inputs, setInputs] = useState<Array<SearchParams>>([...bandArray]);
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

  const handleSubmit = async (evt: any) => {
    evt.preventDefault();

    setLoading(true);
    try {
      const filterInputs = inputs.filter(
        (input) => input.artist !== '' && input.album !== '',
      );
      await onSubmit(filterInputs);
      setInputs([...initialState]);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const isInputDisabled =
    !!inputs.find(
      (input) =>
        (input.artist !== '' && input.album === '') ||
        (input.artist === '' && input.album !== ''),
    ) || !inputs.some((input) => input.artist !== '' && input.album !== '');

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
        {inputs.map((input, index) => (
          <Grid key={`input-${index}`}>
            <TextField
              label="Artist Name"
              value={input.artist}
              onChange={(e) =>
                handleInputChange(index, PopupState.ARTIST, e.target.value)
              }
              style={{ marginBottom: '10px' }}
            />
            <TextField
              label="Album Name"
              value={input.album}
              onChange={(e) =>
                handleInputChange(index, PopupState.ALBUM, e.target.value)
              }
              style={{ marginBottom: '20px' }}
            />
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
