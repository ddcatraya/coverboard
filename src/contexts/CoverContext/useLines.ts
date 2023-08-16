import { LinePoint, Point, PosTypes } from 'types';
import { v4 as uuidv4 } from 'uuid';
export interface UseLinesParams {
  resetLine: (linedId: string) => void;
  updateLineDir: (linedId: string, dir: PosTypes) => void;
  updateLineText: (linedId: string, text: string) => void;
  removeLine: (linedId: string) => void;
  resetAllLines: () => void;
  createLine: (id: string, points: Point, pos: PosTypes) => void;
  clearAllLines: () => void;
}

export const useLines = (
  setLines: (currentLines: (curr: LinePoint[]) => LinePoint[]) => void,
): UseLinesParams => {
  return {
    clearAllLines() {
      setLines(() => []);
    },
    createLine(id, points, pos) {
      setLines((currentLines) => {
        const lineCopy = [...currentLines];

        if (
          lineCopy.find(
            (currentLine) => currentLine.target.id === id && points.id === id,
          )
        ) {
          return lineCopy;
        }

        const foundLine = lineCopy.find(
          (currentLine) =>
            currentLine.target.id === id && points.id === currentLine.origin.id,
        );
        if (foundLine) {
          foundLine.origin = points;
          foundLine.target = { id, pos };
          return lineCopy;
        }

        const foundLineReverse = lineCopy.find(
          (currentLine) =>
            currentLine.origin.id === id && points.id === currentLine.target.id,
        );
        if (foundLineReverse) {
          foundLineReverse.origin = points;
          foundLineReverse.target = { id, pos };
          return lineCopy;
        }

        return [
          ...lineCopy,
          {
            label: {
              text: '',
              dir: PosTypes.BOTTOM,
            },
            origin: { ...points },
            target: { id, pos },
            id: uuidv4(),
          },
        ];
      });
    },
    resetAllLines() {
      setLines((currentLines) =>
        currentLines.map((currentLine) => ({
          ...currentLine,
          label: {
            ...currentLine.label,
            dir: PosTypes.BOTTOM,
          },
        })),
      );
    },
    resetLine(linedId) {
      setLines((currentLines) =>
        currentLines.map((currentLine) => {
          if (currentLine.id === linedId) {
            return {
              ...currentLine,
              label: {
                ...currentLine.label,
                dir: PosTypes.BOTTOM,
              },
            };
          }
          return currentLine;
        }),
      );
    },
    updateLineDir(linedId, dir) {
      setLines((currentLines) =>
        currentLines.map((currentLine) => {
          if (currentLine.id === linedId) {
            return {
              ...currentLine,
              label: {
                ...currentLine.label,
                dir,
              },
            };
          }
          return currentLine;
        }),
      );
    },
    updateLineText(linedId, text) {
      setLines((currentLines) =>
        currentLines.map((currentLine) => {
          if (currentLine.id === linedId) {
            return {
              ...currentLine,
              label: {
                ...currentLine.label,
                text,
              },
            };
          }
          return currentLine;
        }),
      );
    },
    removeLine(linedId) {
      setLines((currentLines) =>
        currentLines.filter((currentLine) => !(currentLine.id === linedId)),
      );
    },
  };
};
