import { useCoverContext, useSizesContext } from 'contexts';
import { Arrow, Circle, Group, Rect, Text } from 'react-konva';
import { RenderDir } from './DrawLines';

interface LineProps {
  line: {
    key: string;
    points: number[];
    text: string;
    coverIdx: number;
    lineIdx: number;
    dir: RenderDir;
  };
  handleOpen: (
    coverIdx: number,
    lineIdx: number,
    text: string,
    dir: RenderDir,
  ) => void;
}

export const DrawLine: React.FC<LineProps> = (props) => {
  const { line, handleOpen } = props;
  const { fontSize, coverSize } = useSizesContext();
  const { showBalls } = useCoverContext();

  const midX = (line.points[0] + line.points[2]) / 2;
  const midY = (line.points[1] + line.points[3]) / 2;

  const textPost = {
    x: midX,
    y: midY,
    align: 'center',
  };

  if (line.dir === RenderDir.DOWN) {
    textPost.y = midY + fontSize * 1.5;
    textPost.x = midX - coverSize;
    textPost.align = 'center';
  } else if (line.dir === RenderDir.UP) {
    textPost.y = midY - fontSize * 3;
    textPost.x = midX - coverSize;
    textPost.align = 'center';
  } else if (line.dir === RenderDir.LEFT) {
    textPost.x = midX - fontSize * 1.5 - coverSize * 2;
    textPost.y = midY - fontSize / 2;
    textPost.align = 'right';
  } else if (line.dir === RenderDir.RIGHT) {
    textPost.x = midX + fontSize * 1.5;
    textPost.y = midY - fontSize / 2;
    textPost.align = 'left';
  }

  return (
    <>
      <Arrow
        points={line.points}
        stroke="yellow"
        strokeWidth={fontSize / 4}
        pointerLength={fontSize}
      />
      {showBalls && (
        <Circle
          x={midX}
          y={midY}
          radius={fontSize / 1.5}
          fill="yellow"
          onClick={() =>
            handleOpen(line.coverIdx, line.lineIdx, line.text, line.dir)
          }
        />
      )}
      {line.text && (
        <Group>
          <Rect
            x={textPost.x}
            y={textPost.y}
            width={coverSize * 2}
            height={fontSize}
            fill="#282c34"
          />
          <Text
            x={textPost.x}
            y={textPost.y}
            width={coverSize * 2}
            align={textPost.align}
            text={line.text}
            fontSize={fontSize}
            fill="yellow"
            onClick={() =>
              handleOpen(line.coverIdx, line.lineIdx, line.text, line.dir)
            }
          />
        </Group>
      )}
    </>
  );
};
