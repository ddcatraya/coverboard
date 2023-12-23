import React, { useState } from 'react';
import { TextField, Button, Link, Grid } from '@mui/material';
import { LabelType, CoverValues, Covers, Media } from 'types';
import { CommonDialog } from 'components';
import { useMainStore } from 'store';

interface PopupProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: CoverValues) => void;
  onReset: () => void;
  values: CoverValues;
  title?: string;
  id: Covers['id'];
}

const getButtons = (media: Media, currentCover: Covers) => {
  if (media === Media.MUSIC) {
    return [
      {
        name: 'LastFM',
        href: `http://www.last.fm/music/${
          currentCover[LabelType.TITLE].search
        }/${currentCover[LabelType.SUBTITLE].search}`,
      },
      {
        name: 'Spotify',
        href: `https://open.spotify.com/search/artist%3A${
          currentCover[LabelType.TITLE].search
        }%20AND%20album%3A${currentCover[LabelType.SUBTITLE].search}/`,
      },
    ];
  } else if (media === Media.MOVIE || media === Media.TVSHOW) {
    return [
      {
        name: 'TMDB',
        href: `https://www.themoviedb.org/search?query=${
          currentCover[LabelType.TITLE].search
        }${
          currentCover[LabelType.SUBTITLE]
            ? '&year=' + currentCover[LabelType.SUBTITLE].search
            : ''
        }`,
      },
      {
        name: 'IMDB',
        href: `https://www.imdb.com/search/title/?title=${
          currentCover[LabelType.TITLE].search
        }${
          currentCover[LabelType.SUBTITLE]
            ? `&release_date=${currentCover[LabelType.SUBTITLE].search}-01-01,${
                currentCover[LabelType.SUBTITLE].search
              }-12-31`
            : ''
        }`,
      },
    ];
  } else if (media === Media.BOOK) {
    const isbm = currentCover.link.match(/isbn\/(\d+)-/i);

    if (isbm?.length) {
      return [
        {
          name: 'Open library',
          href: `https://openlibrary.org/isbn/${isbm[1]}`,
        },
        {
          name: 'Google Books',
          href: `https://www.google.com/search?tbo=p&tbm=bks&q=intitle:${
            currentCover[LabelType.TITLE].search
          }${
            currentCover[LabelType.SUBTITLE]
              ? '+inauthor:' + currentCover[LabelType.SUBTITLE].search
              : ''
          }`,
        },
      ];
    }
  } else if (media === Media.GAME) {
    return [
      {
        name: 'RAWG',
        href: `https://rawg.io/search?query=${
          currentCover[LabelType.TITLE].search
        }`,
      },
      {
        name: 'Steam',
        href: `https://store.steampowered.com/search/?term=${
          currentCover[LabelType.TITLE].search
        }`,
      },
      {
        name: 'Nintendo',
        href: `https://www.nintendo.com/us/search/#q=${
          currentCover[LabelType.TITLE].search
        }`,
      },
    ];
  }
  return [];
};

export const CoverPopover: React.FC<PopupProps> = ({
  open,
  onClose,
  onSubmit,
  onReset,
  values,
  id,
}) => {
  const [text, setText] = useState<CoverValues>(values);
  const titleLabel = useMainStore((state) => state.titleLabel().label);
  const subTitleLabel = useMainStore((state) => state.subTitleLabel().label);
  const media = useMainStore((state) => state.configs.media);
  const currentCover = useMainStore((state) =>
    state.covers.find((cov) => cov.id === id),
  )!;

  const buttons = getButtons(media, currentCover);

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
              label={titleLabel}
              fullWidth
              value={text[LabelType.TITLE]}
              onChange={(evt) => handTextChange(evt, LabelType.TITLE)}
              style={{ marginBottom: '20px' }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label={subTitleLabel}
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
              variant="outlined"
              color="primary"
              type="button"
              onClick={() => {
                onReset();
                onClose();
              }}
              style={{ marginRight: '20px', marginBottom: '20px' }}>
              Reset
            </Button>
            {buttons.map((button) => (
              <Button
                key={button.name}
                variant="contained"
                color="secondary"
                target="_blank"
                component={Link}
                href={button.href}
                style={{ marginRight: '20px', marginBottom: '20px' }}>
                {button.name}
              </Button>
            ))}
          </Grid>
        </Grid>
      </form>
    </CommonDialog>
  );
};
