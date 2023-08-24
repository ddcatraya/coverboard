import { Lines, Point, PosTypes } from 'types';
import { v4 as uuidv4 } from 'uuid';
import { StateCreator } from 'zustand';

export interface UseLinesParams {
  lines: Array<Lines>;
  resetLine: (linedId: string) => void;
  updateLineDir: (linedId: string, dir: PosTypes) => void;
  updateLineText: (linedId: string, text: string) => void;
  removeLine: (linedId: string) => void;
  resetAllLines: () => void;
  createLine: (id: string, points: Point, pos: PosTypes) => void;
  removeLinesWithCover: (coverId: string) => void;
  getLineTextById: (id: string) => Lines['text'];
}

export const createLinesSlice: StateCreator<
  UseLinesParams,
  [],
  [],
  UseLinesParams
> = (set, get) => ({
  lines: [],
  getLineTextById: (id: string) =>
    get().lines.find((line) => line.id === id)?.text ?? '',
  createLine(id, points, dir) {
    set(({ lines }) => {
      const lineCopy = [...lines];

      if (
        lineCopy.find(
          (currentLine) => currentLine.target.id === id && points.id === id,
        )
      ) {
        return { lines: lineCopy };
      }

      const foundLine = lineCopy.find(
        (currentLine) =>
          currentLine.target.id === id && points.id === currentLine.origin.id,
      );
      if (foundLine) {
        foundLine.origin = points;
        foundLine.target = { id, dir };
        return { lines: lineCopy };
      }

      const foundLineReverse = lineCopy.find(
        (currentLine) =>
          currentLine.origin.id === id && points.id === currentLine.target.id,
      );
      if (foundLineReverse) {
        foundLineReverse.origin = points;
        foundLineReverse.target = { id, dir };
        return { lines: lineCopy };
      }

      return {
        lines: [
          ...lineCopy,
          {
            text: '',
            dir: PosTypes.BOTTOM,

            origin: { ...points },
            target: { id, dir },
            id: uuidv4(),
          },
        ],
      };
    });
  },
  resetAllLines() {
    set(({ lines }) => ({
      lines: lines.map((currentLine) => ({
        ...currentLine,
        dir: PosTypes.BOTTOM,
      })),
    }));
  },
  resetLine(linedId) {
    set(({ lines }) => ({
      lines: lines.map((currentLine) => {
        if (currentLine.id === linedId) {
          return {
            ...currentLine,
            dir: PosTypes.BOTTOM,
          };
        }
        return currentLine;
      }),
    }));
  },
  updateLineDir(linedId, dir) {
    set(({ lines }) => ({
      lines: lines.map((currentLine) => {
        if (currentLine.id === linedId) {
          return {
            ...currentLine,
            dir,
          };
        }
        return currentLine;
      }),
    }));
  },
  updateLineText(linedId, text) {
    set(({ lines }) => ({
      lines: lines.map((currentLine) => {
        if (currentLine.id === linedId) {
          return {
            ...currentLine,
            text,
          };
        }
        return currentLine;
      }),
    }));
  },
  removeLine(linedId) {
    set(({ lines }) => ({
      lines: lines.filter((currentLine) => !(currentLine.id === linedId)),
    }));
  },
  removeLinesWithCover(coverId: string) {
    set(({ lines }) => ({
      lines: lines.filter(
        (l) => l.origin.id !== coverId || l.target.id !== coverId,
      ),
    }));
  },
});
