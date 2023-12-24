import { PosTypes } from './generalTypes';

interface CoverImageParamsText {
  search: string;
  text: string;
}

export enum LabelType {
  TITLE = 'title',
  SUBTITLE = 'subtitle',
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
  starDir: PosTypes;
  starCount: number;
}

export interface GroupCovers {
  id: string;
  x: number;
  y: number;
  title: string;
  dir: PosTypes;
  scaleX: number;
  scaleY: number;
}
