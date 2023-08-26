import { LabelType } from './coverTypes';
import { PosTypes } from './generalTypes';

export enum Colors {
  YELLOW = 'yellow',
  RED = 'red',
  GREEN = 'green',
  PINK = 'pink',
  GOLD = 'gold',
  BLUE = 'blue',
  PURPLE = 'purple',
  ORANGE = 'orange',
}

export const colorMap = {
  [Colors.YELLOW]: 'yellow',
  [Colors.RED]: '#DC143C',
  [Colors.GREEN]: '#32CD32',
  [Colors.PINK]: '#FF69B4',
  [Colors.GOLD]: '#FFD700',
  [Colors.BLUE]: '#1E90FF',
  [Colors.PURPLE]: '#9370DB',
  [Colors.ORANGE]: '#FF6347',
};

export enum BackColors {
  DARKER = 'darker',
  DARK = 'dark',
  LIGHT = 'light',
  LIGHTER = 'lighter',
}

export const backColorMap = {
  [BackColors.DARKER]: '#1E2B38',
  [BackColors.DARK]: '#303952',
  [BackColors.LIGHT]: '#475B6B',
  [BackColors.LIGHTER]: '#5C6F7E',
};

export enum ToolbarConfigValues {
  MEDIA = 'media',
  TITLE = 'title',
  SIZE = 'size',
  COLOR = 'color',
  BACK_COLOR = 'backColor',
  SHOW_MAIN_TITLE = 'showMainTitle',
  SHOW_TITLE = 'showTitle',
  SHOW_SUBTITLE = 'showSubtitle',
  LABEL_DIR = 'labelDir',
}

export enum Media {
  MUSIC = 'music',
  MOVIE = 'movie',
  BOOK = 'book',
}

export enum MediaValues {
  ARTIST = 'artist',
  ALBUM = 'album',
  MOVIE = 'movie',
  YEAR = 'year',
  BOOK = 'book',
  AUTHOR = 'author',
}

export interface MediaDesc {
  label: MediaValues;
  required: boolean;
}

export const MediaMap = {
  [Media.MUSIC]: {
    [LabelType.TITLE]: { label: MediaValues.ARTIST, required: true },
    [LabelType.SUBTITLE]: { label: MediaValues.ALBUM, required: true },
    heightRatio: 1,
  },
  [Media.MOVIE]: {
    [LabelType.TITLE]: { label: MediaValues.MOVIE, required: true },
    [LabelType.SUBTITLE]: { label: MediaValues.YEAR, required: false },
    heightRatio: 1.5,
  },
  [Media.BOOK]: {
    [LabelType.TITLE]: { label: MediaValues.BOOK, required: true },
    [LabelType.SUBTITLE]: { label: MediaValues.AUTHOR, required: false },
    heightRatio: 1.5,
  },
};

export interface ToolbarConfigParams {
  [ToolbarConfigValues.MEDIA]: Media;
  [ToolbarConfigValues.TITLE]: string;
  [ToolbarConfigValues.SIZE]: number;
  [ToolbarConfigValues.COLOR]: Colors;
  [ToolbarConfigValues.BACK_COLOR]: BackColors;
  [ToolbarConfigValues.SHOW_MAIN_TITLE]: boolean;
  [ToolbarConfigValues.SHOW_TITLE]: boolean;
  [ToolbarConfigValues.SHOW_SUBTITLE]: boolean;
  [ToolbarConfigValues.LABEL_DIR]: PosTypes;
}
