import { getAlbums } from 'api/fetchAlbums';
import { useCoverContext, useSizesContext } from 'contexts';
import { useToastContext } from 'contexts/ToastContext';
import { KonvaEventObject } from 'konva/lib/Node';

import { useState } from 'react';
import { Group, Rect, Text } from 'react-konva';
import { Html } from 'react-konva-utils';
import { BandSearch, SearchParams } from 'uicomponents/bandSearch';
import { ChangeSize } from 'uicomponents/changeSize';

const MIN_OPACITY = 0.3;

interface TooltipValues {
  text: string;
  x: number;
  y: number;
}

export const Toolbar: React.FC = () => {
  const {
    cover,
    setCover,
    erase,
    setErase,
    showTitles,
    setShowTitles,
    editLines,
    setEditLines,
    showBalls,
    setBalls,
  } = useCoverContext();
  const {
    dragLimits,
    coverSize,
    initialX,
    getCurrentX,
    toobarIconSize,
    setCoverSize,
  } = useSizesContext();
  const [open, setOpen] = useState(false);
  const [openSize, setOpenSize] = useState(false);
  const [tooltip, setTooltip] = useState<TooltipValues | null>(null);
  const { showSuccessMessage, showErrorMessage } = useToastContext();
  const { fontSize } = useSizesContext();

  const handleSearch = async (inputArray: Array<SearchParams>) => {
    try {
      const albums = (await getAlbums(inputArray, dragLimits, coverSize)) ?? [];

      const filteredAlbums = albums.filter(
        (album) =>
          !cover.find(
            (star) =>
              star.artist === album.artist && star.album === album.album,
          ),
      );

      if (filteredAlbums.length) {
        setCover((currentAlbums) => [...currentAlbums, ...filteredAlbums]);
        showSuccessMessage('Artist and Album Found');
      } else {
        showErrorMessage('Artist and Album Already Exists');
      }
    } catch (err) {
      showErrorMessage('Artist and Album Not found');
      return Promise.reject();
    }
  };

  const handleMouseMove = (evt: KonvaEventObject<MouseEvent>, tip: string) => {
    setTooltip({
      text: tip,
      x: evt.evt.clientX,
      y: evt.evt.clientY,
    });
  };

  const configTools = [
    {
      tooltip: 'Add new album',
      color: 'green',
      emoji: '🔍',
      value: open,
      valueModifier: setOpen,
      reverse: true,
    },
    {
      tooltip: 'Resize elements',
      color: 'purple',
      emoji: '↕',
      value: openSize,
      valueModifier: setOpenSize,
      reverse: true,
    },
    {
      tooltip: 'Delete mode',
      color: 'red',
      emoji: '🗑️',
      value: erase,
      valueModifier: setErase,
      reverse: true,
    },
    {
      tooltip: 'Arrow creation mode',
      color: 'yellow',
      emoji: '➜',
      value: editLines,
      valueModifier: setEditLines,
      reverse: false,
    },
    {
      tooltip: 'Show artist and album name',
      color: 'blue',
      emoji: 'ℹ️',
      value: showTitles,
      valueModifier: setShowTitles,
      reverse: false,
    },
    {
      tooltip: 'Show middle arrow circles',
      color: 'pink',
      emoji: '🔴',
      value: showBalls,
      valueModifier: setBalls,
      reverse: false,
    },
  ];

  return (
    <>
      <Html>
        <BandSearch
          open={open}
          onClose={() => setOpen(false)}
          onSubmit={handleSearch}
        />
        <ChangeSize
          open={openSize}
          onClose={() => setOpenSize(false)}
          onSubmit={(size: string) => {
            setCoverSize(Number(size));
            setOpenSize(false);
          }}
          defaultSize={String(coverSize)}
        />
      </Html>
      {configTools.map((config, index) => (
        <Group
          key={config.tooltip}
          x={initialX}
          y={getCurrentX(index)}
          onClick={() =>
            config.value
              ? config.valueModifier(false)
              : config.valueModifier(true)
          }
          onMouseMove={(evt) => handleMouseMove(evt, config.tooltip)}
          onMouseLeave={() => setTooltip(null)}>
          <Rect
            width={toobarIconSize}
            height={toobarIconSize}
            fill={config.color}
          />
          <Text
            x={0}
            y={toobarIconSize / 4}
            width={toobarIconSize}
            height={toobarIconSize}
            align="center"
            text={config.emoji}
            fontSize={toobarIconSize / 2}
            fill="black"
            opacity={
              config.reverse
                ? config.value
                  ? MIN_OPACITY
                  : 1
                : config.value
                ? 1
                : MIN_OPACITY
            }
          />
        </Group>
      ))}
      {tooltip && (
        <Group>
          <Rect
            x={tooltip.x + fontSize}
            y={tooltip.y}
            width={coverSize * 2}
            height={fontSize}
            fill="#282c34"
          />
          <Text
            x={tooltip.x + fontSize}
            y={tooltip.y}
            width={coverSize * 2}
            align="left"
            text={tooltip.text}
            fontSize={fontSize}
            fill="white"
          />
        </Group>
      )}
    </>
  );
};
