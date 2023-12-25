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

export interface CoverValues {
  title: string;
  subtitle: string;
}

export interface Covers {
  id: string;
  link: string;
  x: number;
  y: number;
  title: CoverImageParamsText;
  subtitle: CoverImageParamsText;
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
