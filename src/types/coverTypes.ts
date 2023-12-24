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
  x: number;
  y: number;
  [LabelType.TITLE]: CoverImageParamsText;
  [LabelType.SUBTITLE]: CoverImageParamsText;
  dir: PosTypes;
  link?: string;
  scaleX?: number;
  scaleY?: number;
  starDir: PosTypes;
  starCount: number;
}
