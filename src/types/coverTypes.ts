import { PosTypes } from './generalTypes';

export enum Elem {
  COVER = 'cover',
  GROUP = 'group',
  ARROW = 'arrow',
}

export type SelectedText = {
  id: string;
  text: string;
} | null;

export type SelectedElement = {
  id: string;
  elem: Elem;
  open: boolean;
} | null;

interface CoverImageParamsText {
  search: string;
  text: string;
  dir: PosTypes;
}

interface GroupCoverParamsText {
  text: string;
  dir: PosTypes;
}

export interface CoverLabelValues {
  title: string;
  subtitle: string;
}

export interface CoverValues {
  title: string;
  subtitle: string;
  titleDir: PosTypes;
  subTitleDir: PosTypes;
}

export interface GroupCoverValues {
  title: string;
  subtitle: string;
  titleDir: PosTypes;
  subTitleDir: PosTypes;
}

export interface Covers {
  id: string;
  link: string;
  x: number;
  y: number;
  title: CoverImageParamsText;
  subtitle: CoverImageParamsText;
  star: {
    dir: PosTypes;
    count: number;
  };
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
