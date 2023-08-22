import { KonvaEventObject } from 'konva/lib/Node';
import { Group, Image, Text } from 'react-konva';
import { useMainStore } from 'store';
import useImage from 'use-image';

export const Logo: React.FC = () => {
  const dragLimits = useMainStore((state) => state.dragLimits());
  const toobarIconSize = useMainStore((state) => state.toobarIconSize());
  const fontSize = useMainStore((state) => state.fontSize());

  const [image] = useImage(
    'https://www.last.fm/static/images/footer_logo@2x.49ca51948b0a.png',
  );

  return (
    <Group
      y={dragLimits.height - toobarIconSize / 2}
      onClick={() => window.open('https://www.last.fm')}
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
        width={toobarIconSize * 0.7}
        height={toobarIconSize * 0.4}
        x={(toobarIconSize / 2) * 1.2}
        y={(-toobarIconSize / 2) * 1.1}
      />
      <Text
        fonSize={fontSize}
        width={toobarIconSize * 2}
        fill="white"
        align="center"
        text="powered by AudioScrobbler"
        textDecoration="underline"
      />
    </Group>
  );
};
