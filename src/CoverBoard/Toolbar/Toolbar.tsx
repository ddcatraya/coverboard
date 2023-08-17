import { useCoverContext, useToolbarContext } from 'contexts';
import {
  ToolbarSearch,
  ToolbarShare,
  ToolbarConfig,
  ToolbarIcon,
  ToolbarTooltip,
} from '.';
import { colorMap, Colors, ToolConfig, ToolConfigIDs } from 'types';

export const Toolbar: React.FC = () => {
  const {
    erase,
    setErase,
    editLines,
    setEditLines,
    undo,
    action,
    cover,
    lines,
    configs,
  } = useCoverContext();
  const {
    openSearch,
    setOpenSearch,
    openConfig,
    setOpenConfig,
    openShare,
    setOpenShare,
  } = useToolbarContext();

  const savesNumber = Object.values(window.localStorage).length;
  const configSize = configs.size / 100;

  const configTools: Array<ToolConfig> = [
    {
      id: ToolConfigIDs.SEARCH,
      tooltip: `Add albums (covers: ${cover.length})`,
      color: colorMap[Colors.GREEN],
      emoji: '🔍',
      value: openSearch,
      valueModifier: setOpenSearch,
      badge: cover.length,
    },
    {
      id: ToolConfigIDs.CONFIG,
      tooltip: `Settings (scale: ${configSize})`,
      color: colorMap[Colors.PURPLE],
      emoji: '⚙️',
      value: openConfig,
      valueModifier: setOpenConfig,
      badge: configSize === 1 ? 0 : configSize,
    },
    {
      id: ToolConfigIDs.SHARE,
      tooltip: `Share options (saves: ${savesNumber})`,
      color: colorMap[Colors.BLUE],
      emoji: '🔗',
      value: openShare,
      valueModifier: setOpenShare,
      badge: savesNumber === 1 ? 0 : savesNumber,
    },
    {
      id: ToolConfigIDs.ARROW,
      tooltip: `Create arrow mode (arrows: ${lines.length})`,
      color: colorMap[Colors.GOLD],
      emoji: '➜',
      value: editLines,
      valueModifier: setEditLines,
      badge: lines.length,
    },
    {
      id: ToolConfigIDs.ERASE,
      tooltip: `Erase mode (elements: ${lines.length + cover.length})`,
      color: colorMap[Colors.ORANGE],
      emoji: '🗑️',
      value: erase,
      valueModifier: setErase,
      badge: lines.length + cover.length,
    },
    {
      id: ToolConfigIDs.UNDO,
      tooltip: `Undo (moves: ${action.length}/10)`,
      color: colorMap[Colors.PINK],
      emoji: '↩️',
      value: action.length < 1,
      valueModifier: undo,
      badge: action.length,
    },
  ];

  return (
    <>
      <ToolbarSearch />
      <ToolbarConfig />
      <ToolbarShare />
      {configTools.map((config, index) => (
        <ToolbarIcon config={config} key={config.id} index={index} />
      ))}
      <ToolbarTooltip />
    </>
  );
};
