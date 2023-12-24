import React, { useState } from 'react';
import {
  TextField,
  Button,
  Link,
  Grid,
  Slider,
  Typography,
} from '@mui/material';
import { LabelType, CoverValues, Covers, Media } from 'types';
import { CommonDialog } from 'components';
import { useMainStore } from 'store';

interface PopupProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (
    values: CoverValues,
    rating?: number,
    scale?: { scaleX: number; scaleY: number },
  ) => void;
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
  } else if (media === Media.BOOK && currentCover.link) {
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
  const starCount = useMainStore((state) => state.getStarCount(id));
  const scale = useMainStore((state) => state.getScale(id));
  const link = useMainStore((state) => state.getLink(id));
  const [text, setText] = useState<CoverValues>(values);
  const [rating, setRating] = useState(starCount);
  const [currentScale, setCurrentScale] = useState(scale);
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

  const handleNumberChange = (_: Event, value: number | number[]) => {
    if (Array.isArray(value)) return;
    setRating(value);
  };

  const handleScaleChange = (
    _: Event,
    value: number | number[],
    scaleParam: 'scaleX' | 'scaleY',
  ) => {
    if (Array.isArray(value)) return;
    setCurrentScale((prevScale) => ({
      ...prevScale,
      [scaleParam]: value,
    }));
  };

  const handleSubmit = (evt: React.SyntheticEvent<HTMLFormElement>) => {
    evt.preventDefault();
    if (link) {
      onSubmit(text, rating);
    } else {
      onSubmit(text, undefined, currentScale);
    }

    onClose();
  };

  return (
    <CommonDialog open={open} onClose={onClose} title="Edit labels">
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label={link ? titleLabel : 'title'}
              fullWidth
              value={text[LabelType.TITLE]}
              onChange={(evt) => handTextChange(evt, LabelType.TITLE)}
              style={{ marginBottom: '20px' }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label={link ? subTitleLabel : 'subtitle'}
              fullWidth
              value={text[LabelType.SUBTITLE]}
              onChange={(evt) => handTextChange(evt, LabelType.SUBTITLE)}
              style={{ marginBottom: '20px' }}
            />
          </Grid>
          {link && (
            <Grid item xs={12}>
              <Typography gutterBottom>Rating:</Typography>
              <Slider
                min={0}
                max={5}
                step={0.5}
                valueLabelDisplay="on"
                defaultValue={rating}
                value={rating}
                onChange={(evt, value) => handleNumberChange(evt, value)}
              />
            </Grid>
          )}
          {!link && (
            <>
              <Grid item xs={12}>
                <Typography gutterBottom>ScaleX:</Typography>
                <Slider
                  min={1}
                  max={10}
                  step={0.5}
                  valueLabelDisplay="on"
                  defaultValue={currentScale.scaleX}
                  value={currentScale.scaleX}
                  onChange={(evt, value) =>
                    handleScaleChange(evt, value, 'scaleX')
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <Typography gutterBottom>ScaleY:</Typography>
                <Slider
                  min={1}
                  max={10}
                  step={0.5}
                  valueLabelDisplay="on"
                  defaultValue={currentScale.scaleY}
                  value={currentScale.scaleY}
                  onChange={(evt, value) =>
                    handleScaleChange(evt, value, 'scaleY')
                  }
                />
              </Grid>
            </>
          )}
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
