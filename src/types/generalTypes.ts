export enum PosTypes {
  LEFT = 'left',
  RIGHT = 'right',
  TOP = 'top',
  BOTTOM = 'bottom',
}

export interface DragLimits {
  x: number;
  y: number;
  width: number;
  height: number;
}

export const NAME_SPACE = 'coverboard';

export const DEFAULT_KEY = 'default';

export enum Modes {
  TITLE = '<Edit title>',
  ERASE = '<Erase mode>',
  ARROW = '<Create arrow mode>',
}
