import { PosTypes } from './generalTypes';

export interface Point {
  id: string;
  dir: PosTypes;
}

export interface Lines {
  id: string;
  origin: Point;
  target: Point;
  text: string;
  dir: PosTypes;
}

export interface LineParams {
  midX: number;
  midY: number;
  points: number[];
}
