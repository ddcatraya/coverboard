import React, { useState } from 'react';
import { Modal, TextField, Button, Link } from '@mui/material';
import { LabelType, AlbumCoverValues } from 'types';

interface PopupProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: AlbumCoverValues) => void;
  onReset: () => void;
  values: AlbumCoverValues;
  title?: string;
}

export const AlbumCoverImagePopover: React.FC<PopupProps> = ({
  open,
  onClose,
  onSubmit,
  onReset,
  values,
}) => {
  const [text, setText] = useState<AlbumCoverValues>(values);

  const handTextChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    label: LabelType,
  ) => {
    setText((currentText) => ({
      ...currentText,
      [label]: event.target.value,
    }));
  };

  const handleSubmit = (evt: React.SyntheticEvent<HTMLFormElement>) => {
    evt.preventDefault();
    onSubmit(text);
    onClose();
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
        <TextField
          label={`Artist`}
          value={text[LabelType.ARTIST].text}
          onChange={(evt: any) => handTextChange(evt, LabelType.ARTIST)}
          fullWidth
          style={{ marginBottom: '20px' }}
        />
        <TextField
          label={`Album`}
          value={text[LabelType.ALBUM].text}
          onChange={(evt: any) => handTextChange(evt, LabelType.ALBUM)}
          fullWidth
          style={{ marginBottom: '20px' }}
        />
        <Button
          variant="contained"
          color="primary"
          type="submit"
          style={{ marginRight: '10px' }}>
          Submit
        </Button>
        <Button
          variant="contained"
          color="primary"
          type="button"
          onClick={() => {
            onReset();
            onClose();
          }}
          style={{ marginRight: '10px' }}>
          Reset
        </Button>
        <Button
          variant="contained"
          color="primary"
          target="_blank"
          component={Link}
          href={`http://www.last.fm/music/${
            values[LabelType.ARTIST].originalText
          }/${values[LabelType.ALBUM].originalText}`}>
          Last FM
        </Button>
      </form>
    </Modal>
  );
};
