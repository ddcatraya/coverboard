import { PosTypes } from './generalTypes';

interface CoverImageParamsText {
  originalText: string;
  text: string;
}

export enum LabelType {
  ARTIST = 'artistLabel',
  ALBUM = 'albumLabel',
}

export interface AlbumCoverValues {
  [LabelType.ARTIST]: CoverImageParamsText;
  [LabelType.ALBUM]: CoverImageParamsText;
}

export interface CoverImage {
  id: string;
  link: string;
  x: number;
  y: number;
  [LabelType.ARTIST]: CoverImageParamsText;
  [LabelType.ALBUM]: CoverImageParamsText;
  dir: PosTypes;
}
