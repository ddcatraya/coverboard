import { useCoverContext, useSizesContext } from 'contexts';
import { PosTypes } from 'contexts/CoverContext';
import { useMemo, useState } from 'react';
import { Html } from 'react-konva-utils';
import { EditText } from 'uicomponents/editText';
import { DrawLine } from './DrawLine';

/*
const calculateStartingPoint = (origin: CoverImage, target: CoverImage) => {

    if (target.x >= origin.x && target.y >= origin.y) {
      return [
        origin.x + origin.width / 2, 
        origin.y + origin.height / 4, 
        target.x,
        target.y + target.height / 4,
      ]
    } else  if (target.x >= origin.x && target.y <= origin.y) {
      return [
        origin.x + origin.width / 2, 
        origin.y + origin.height / 4, 
        target.x,
        target.y + target.height / 4,
      ]
    } else  if (target.x <= origin.x && target.y >= origin.y) {
      return [
        origin.x, 
        origin.y + origin.height / 4, 
        target.x,
        target.y + target.height / 4,
      ]
    } else  if (target.x <= origin.x && target.y <= origin.y) {
      return [
        origin.x, 
        origin.y + origin.height / 4, 
        target.x,
        target.y + target.height / 4,
      ]
    }
  } */

const convertPosToXY = (coverSize: number, pos: PosTypes) => {
  if (pos === PosTypes.TOP) {
    return {
      x: coverSize / 2,
      y: -coverSize / 16,
    };
  } else if (pos === PosTypes.BOTTOM) {
    return {
      x: coverSize / 2,
      y: coverSize + coverSize / 16,
    };
  } else if (pos === PosTypes.LEFT) {
    return {
      x: -coverSize / 16,
      y: coverSize / 2,
    };
  } else {
    return {
      x: coverSize + coverSize / 16,
      y: coverSize / 2,
    };
  }
};

export enum RenderDir {
  UP = 'up',
  DOWN = 'down',
  LEFT = 'left',
  RIGHT = 'right',
}

interface TextEdit {
  defaultText: string;
  defaultDir: RenderDir;
  coverIdx: number;
  lineIdx: number;
}

export const DrawLines: React.FC = () => {
  const { cover, setCover, erase } = useCoverContext();
  const { coverSize } = useSizesContext();
  const [textEdit, setTextEdit] = useState<TextEdit | null>(null);

  const lines = useMemo(() => {
    const lines = [];
    for (let i = 0; i < cover.length; i++) {
      for (let j = 0; j < cover[i].lines.length; j++) {
        const { origin, target } = cover[i].lines[j];

        if (target) {
          const originSquare = cover.find(
            (cov) => cov.id === cover[i].lines[j].origin.id,
          );
          const targetSquare = cover.find(
            (cov) => cov.id === cover[i].lines[j].target?.id,
          );

          if (originSquare && targetSquare) {
            const originPos = convertPosToXY(coverSize, origin.pos);
            const targetPos = convertPosToXY(coverSize, target.pos);

            lines.push({
              key: `line-${origin.id}-${target.id}`,
              points: [
                originSquare.x + originPos.x,
                originSquare.y + originPos.y,
                targetSquare.x + targetPos.x,
                targetSquare.y + targetPos.y,
              ],
              coverIdx: i,
              lineIdx: j,
              text: cover[i].lines[j].text ?? '',
              dir: cover[i].lines[j].dir ?? RenderDir.DOWN,
            });
          }
        }
      }
    }
    return lines;
  }, [cover, coverSize]);

  const handleSubmit = (text: string, dir: RenderDir) => {
    setCover(
      cover.map((star, starIndex) => ({
        ...star,
        lines: star.lines.map((line, lineIndex) => {
          if (
            textEdit &&
            textEdit.coverIdx === starIndex &&
            textEdit.lineIdx === lineIndex
          ) {
            return {
              ...line,
              text,
              dir,
            };
          }
          return line;
        }),
      })),
    );
    setTextEdit(null);
  };

  const handleOpen = (
    coverIdx: number,
    lineIdx: number,
    text: string,
    dir: RenderDir,
  ) => {
    if (erase) {
      setCover(
        cover.map((star, starIndex) => ({
          ...star,
          lines: star.lines.filter((line, lineIndex) => {
            return !(coverIdx === starIndex && lineIdx === lineIndex);
          }),
        })),
      );
      return;
    }
    setTextEdit({
      coverIdx,
      lineIdx,
      defaultText: text,
      defaultDir: dir,
    });
  };

  return (
    <>
      <Html>
        <EditText
          open={!!textEdit}
          onClose={() => setTextEdit(null)}
          onSubmit={handleSubmit}
          defaultText={textEdit?.defaultText ?? ''}
          defaultDir={textEdit?.defaultDir ?? RenderDir.DOWN}
        />
      </Html>
      {lines.map((line) => (
        <DrawLine key={line.key} line={line} handleOpen={handleOpen} />
      ))}
    </>
  );
};
