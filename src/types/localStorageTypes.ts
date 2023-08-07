import { ToolbarConfigParams } from './configTypes';
import { CoverImage } from './coverTypes';
import { LinePoint } from './lineTypes';

export enum LocalStorageKeys {
  COVER = 'cover',
  LINES = 'lines',
  CONFIG = 'configs',
}

export interface LocalStorageData {
  [LocalStorageKeys.CONFIG]: ToolbarConfigParams;
  [LocalStorageKeys.COVER]: Array<CoverImage>;
  [LocalStorageKeys.LINES]: Array<LinePoint>;
}
