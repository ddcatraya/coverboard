import { PosTypes } from './generalTypes';

interface CoverImageParamsText {
  search: string;
  text: string;
}

export enum LabelType {
  TITLE = 'artist',
  SUBTITLE = 'album',
}

export interface CoverValues {
  [LabelType.TITLE]: string;
  [LabelType.SUBTITLE]: string;
}

export interface Covers {
  id: string;
  link: string;
  x: number;
  y: number;
  [LabelType.TITLE]: CoverImageParamsText;
  [LabelType.SUBTITLE]: CoverImageParamsText;
  dir: PosTypes;
}
