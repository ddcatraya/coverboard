import React, { useState } from 'react';
import { TextField, Button, Link, Grid } from '@mui/material';
import { LabelType, CoverValues } from 'types';
import { CommonDialog } from 'components';
import { useMainStore } from 'store';

interface PopupProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: CoverValues) => void;
  onReset: () => void;
  values: CoverValues;
  title?: string;
}

export const CoverImagePopover: React.FC<PopupProps> = ({
  open,
  onClose,
  onSubmit,
  onReset,
  values,
}) => {
  const [text, setText] = useState<CoverValues>(values);
  const titleLabel = useMainStore((state) => state.titleLabel());
  const subTitleLabel = useMainStore((state) => state.subTitleLabel());

  const handTextChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
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
    <CommonDialog open={open} onClose={onClose} title="Edit labels">
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label={titleLabel.label}
              fullWidth
              value={text[LabelType.TITLE]}
              onChange={(evt) => handTextChange(evt, LabelType.TITLE)}
              style={{ marginBottom: '20px' }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label={subTitleLabel.label}
              fullWidth
              value={text[LabelType.SUBTITLE]}
              onChange={(evt) => handTextChange(evt, LabelType.SUBTITLE)}
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
                values[LabelType.TITLE].search
              }/${values[LabelType.SUBTITLE].search}`}
              style={{ marginRight: '20px', marginBottom: '20px' }}>
              Last FM
            </Button>
            <Button
              variant="contained"
              color="primary"
              target="_blank"
              component={Link}
              href={`https://open.spotify.com/search/artist%3A${
                values[LabelType.TITLE].search
              }%20AND%20album%3A${values[LabelType.SUBTITLE].search}/`}
              style={{ marginBottom: '20px' }}>
              Spotify
            </Button>
          </Grid>
        </Grid>
      </form>
    </CommonDialog>
  );
};
