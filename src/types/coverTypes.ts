import { PosTypes } from './generalTypes';

interface CoverImageParamsText {
  search: string;
  text: string;
  dir: PosTypes;
}

interface GroupCoverParamsText {
  text: string;
  dir: PosTypes;
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
  starDir: PosTypes;
  starCount: number;
}

export interface GroupCovers {
  id: string;
  x: number;
  y: number;
  title: GroupCoverParamsText;
  subtitle: GroupCoverParamsText;
  scaleX: number;
  scaleY: number;
}
