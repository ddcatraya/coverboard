import { useSizesContext } from 'contexts';
import { KonvaEventObject } from 'konva/lib/Node';
import { Group, Image, Text } from 'react-konva';
import useImage from 'use-image';

export const Logo: React.FC = () => {
  const { toolBarLimits, dragLimits, toobarIconSize } = useSizesContext();
  const [image] = useImage(
    'https://www.last.fm/static/images/footer_logo@2x.49ca51948b0a.png',
  );

  return (
    <Group
      onClick={() => window.open('https://www.last.fm')}
      x={toolBarLimits.x}
      y={dragLimits.height}
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
        width={toobarIconSize * 0.8}
        height={toobarIconSize * 0.5}
        x={(toobarIconSize / 2) * 1.2}
        y={(-toobarIconSize / 2) * 1.3}
      />
      <Text
        x={0}
        y={0}
        width={toobarIconSize * 2}
        fill="white"
        align="center"
        text="powered by AudioScrobbler"
        textDecoration="underline"
      />
    </Group>
  );
};
