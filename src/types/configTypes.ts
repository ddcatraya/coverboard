import { PosTypes } from './generalTypes';

export enum Colors {
  YELLOW = 'yellow',
  RED = '#DC143C',
  GREEN = '#32CD32',
  PINK = '#FF69B4',
  GOLD = '#FFD700',
  BLUE = '#1E90FF',
  PURPLE = '#9370DB',
  ORANGE = '#FF6347',
}

export enum BackColors {
  DARK = '#282c34',
}

export enum ToolbarConfigValues {
  TITLE = 'title',
  SIZE = 'size',
  COLOR = 'color',
  BACK_COLOR = 'backColor',
  SHOW_TITLE = 'showTitle',
  SHOW_ARTIST = 'showArtist',
  SHOW_ALBUM = 'showAlbum',
  LABEL_DIR = 'labelDir',
}

export interface ToolbarConfigParams {
  [ToolbarConfigValues.TITLE]: string;
  [ToolbarConfigValues.SIZE]: number;
  [ToolbarConfigValues.COLOR]: Colors;
  [ToolbarConfigValues.BACK_COLOR]: BackColors;
  [ToolbarConfigValues.SHOW_TITLE]: boolean;
  [ToolbarConfigValues.SHOW_ARTIST]: boolean;
  [ToolbarConfigValues.SHOW_ALBUM]: boolean;
  [ToolbarConfigValues.LABEL_DIR]: PosTypes;
}

export interface ApiKey {
  LastFMKey: string;
}
