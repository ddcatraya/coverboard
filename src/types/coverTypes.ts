import { PosTypes } from './generalTypes';

interface CoverImageParamsText {
  search: string;
  text: string;
}

export enum LabelType {
  ARTIST = 'artist',
  ALBUM = 'album',
}

export interface AlbumCoverValues {
  [LabelType.ARTIST]: string;
  [LabelType.ALBUM]: string;
}

export interface Covers {
  id: string;
  link: string;
  x: number;
  y: number;
  [LabelType.ARTIST]: CoverImageParamsText;
  [LabelType.ALBUM]: CoverImageParamsText;
  dir: PosTypes;
}
