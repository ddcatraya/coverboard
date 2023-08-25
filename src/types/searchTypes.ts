import { LabelType } from './coverTypes';

export interface SearchResults {
  link: string;
  [LabelType.TITLE]: string;
  [LabelType.SUBTITLE]: string;
}
