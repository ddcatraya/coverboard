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
  [BackColors.LIGHT]: '#5C6F7E',
  [BackColors.LIGHTER]: '#728496',
};

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
