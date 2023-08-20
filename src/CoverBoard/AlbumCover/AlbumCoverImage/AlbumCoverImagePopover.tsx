import React, { useState } from 'react';
import { TextField, Button, Link, Grid } from '@mui/material';
import { LabelType, AlbumCoverValues } from 'types';
import { CommonDialog } from 'components';

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
      [label]: {
        ...currentText[label],
        text: event.target.value,
      },
    }));
  };

  const handleSubmit = (evt: React.SyntheticEvent<HTMLFormElement>) => {
    evt.preventDefault();
    onSubmit(text);
    onClose();
  };

  return (
    <CommonDialog open={open} onClose={onClose} title="Edit labels">
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Artist"
              fullWidth
              value={text[LabelType.ARTIST].text}
              onChange={(evt: any) => handTextChange(evt, LabelType.ARTIST)}
              style={{ marginBottom: '20px' }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Album"
              fullWidth
              value={text[LabelType.ALBUM].text}
              onChange={(evt: any) => handTextChange(evt, LabelType.ALBUM)}
              style={{ marginBottom: '20px' }}
            />
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
              variant="contained"
              color="primary"
              type="button"
              onClick={() => {
                onReset();
                onClose();
              }}
              style={{ marginRight: '20px', marginBottom: '20px' }}>
              Reset
            </Button>
            <Button
              variant="contained"
              color="primary"
              target="_blank"
              component={Link}
              href={`http://www.last.fm/music/${
                values[LabelType.ARTIST].search
              }/${values[LabelType.ALBUM].search}`}
              style={{ marginBottom: '20px' }}>
              Last FM
            </Button>
          </Grid>
        </Grid>
      </form>
    </CommonDialog>
  );
};
