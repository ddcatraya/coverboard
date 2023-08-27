import { KonvaEventObject } from 'konva/lib/Node';
import { Group, Image, Text } from 'react-konva';
import { useMainStore } from 'store';
import { Media } from 'types';
import useImage from 'use-image';
import { shallow } from 'zustand/shallow';

const getURL = (media: Media) => {
  if (media === Media.MUSIC) {
    return 'https://www.last.fm/static/images/footer_logo@2x.49ca51948b0a.png';
  } else if (media === Media.MOVIE) {
    return 'https://www.themoviedb.org/assets/2/v4/logos/v2/blue_square_2-d537fb228cf3ded904ef09b136fe3fec72548ebc1fea3fbbd1ad9e36364db38b.svg';
  } else if (media === Media.BOOK) {
    return 'https://blog.openlibrary.org/files/2016/02/Open-Library-Logo-1.jpg';
  }
  return '';
};

export const Logo: React.FC = () => {
  const media = useMainStore((state) => state.configs.media);
  const dragLimits = useMainStore((state) => state.dragLimits(), shallow);
  const toobarIconSize = useMainStore((state) => state.toobarIconSize());
  const fontSize = useMainStore((state) => state.fontSize());
  const [image] = useImage(getURL(media));

  if (media === Media.MUSIC) {
    return (
      <Group
        y={dragLimits.height - toobarIconSize}
        onClick={() => window.open('https://www.last.fm')}
        onTap={() => window.open('https://www.last.fm')}
        onMouseMove={(evt: KonvaEventObject<MouseEvent>) => {
          const container = evt.target.getStage()?.container();

          if (container) {
            container.style.cursor = 'pointer';
          }
        }}
        onMouseLeave={(evt: KonvaEventObject<MouseEvent>) => {
          const container = evt.target.getStage()?.container();

          if (container) {
            container.style.cursor = 'default';
          }
        }}>
        <Image
          image={image}
          scaleX={0.01 * toobarIconSize}
          scaleY={0.01 * toobarIconSize}
          x={toobarIconSize * 0.65}
          y={-toobarIconSize / 2}
        />
        <Text
          y={0}
          fontSize={fontSize * 0.8}
          width={toobarIconSize * 2}
          fill="white"
          align="center"
          text="powered"
          textDecoration="underline"
        />
        <Text
          y={fontSize}
          fontSize={fontSize * 0.8}
          width={toobarIconSize * 2}
          fill="white"
          align="center"
          text="by"
          textDecoration="underline"
        />
        <Text
          y={fontSize * 2}
          fontSize={fontSize * 0.8}
          width={toobarIconSize * 2}
          fill="white"
          align="center"
          text="AudioScrobbler"
          textDecoration="underline"
        />
      </Group>
    );
  } else if (media === Media.MOVIE) {
    return (
      <Image
        onMouseMove={(evt: KonvaEventObject<MouseEvent>) => {
          const container = evt.target.getStage()?.container();

          if (container) {
            container.style.cursor = 'pointer';
          }
        }}
        onMouseLeave={(evt: KonvaEventObject<MouseEvent>) => {
          const container = evt.target.getStage()?.container();

          if (container) {
            container.style.cursor = 'default';
          }
        }}
        onClick={() => window.open('https://www.themoviedb.org/')}
        image={image}
        scaleX={0.01 * toobarIconSize}
        scaleY={0.01 * toobarIconSize}
        x={0}
        y={dragLimits.height - 1.6 * toobarIconSize}
      />
    );
  } else if (media === Media.BOOK) {
    return (
      <Image
        onMouseMove={(evt: KonvaEventObject<MouseEvent>) => {
          const container = evt.target.getStage()?.container();

          if (container) {
            container.style.cursor = 'pointer';
          }
        }}
        onMouseLeave={(evt: KonvaEventObject<MouseEvent>) => {
          const container = evt.target.getStage()?.container();

          if (container) {
            container.style.cursor = 'default';
          }
        }}
        onClick={() => window.open('https://openlibrary.org/')}
        image={image}
        scaleX={0.008 * toobarIconSize}
        scaleY={0.008 * toobarIconSize}
        x={toobarIconSize / 8}
        y={dragLimits.height - 1.2 * toobarIconSize}
      />
    );
  }
  return null;
};
