import {
  ToolbarSearch,
  ToolbarShare,
  ToolbarConfig,
  ToolbarIcon,
  ToolbarTooltip,
} from '.';
import { colorMap, Colors, ToolConfig, ToolConfigIDs } from 'types';
import { haxPrefix } from 'utils';
import { useUtilsStore, useMainStore, useToolbarStore } from 'store';

interface ToolbarProps {
  takeScreenshot: () => void;
  showTooltips: boolean;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  takeScreenshot,
  showTooltips,
}) => {
  const erase = useUtilsStore((state) => state.erase);
  const setErase = useUtilsStore((state) => state.setErase);
  const editLines = useUtilsStore((state) => state.editLines);
  const setEditLines = useUtilsStore((state) => state.setEditLines);
  const undoAction = useMainStore((state) => state.undoAction);
  const actions = useMainStore((state) => state.actions);
  const covers = useMainStore((state) => state.covers);
  const lines = useMainStore((state) => state.lines);
  const configs = useMainStore((state) => state.configs);

  const openConfig = useToolbarStore((state) => state.openConfig);
  const setOpenConfig = useToolbarStore((state) => state.setOpenConfig);
  const openSearch = useToolbarStore((state) => state.openSearch);
  const setOpenSearch = useToolbarStore((state) => state.setOpenSearch);
  const openShare = useToolbarStore((state) => state.openShare);
  const setOpenShare = useToolbarStore((state) => state.setOpenShare);

  const savesNumber = Object.keys(window.localStorage).filter((key) =>
    haxPrefix(key),
  ).length;
  const configSize = configs.size / 100;

  const configTools: Array<ToolConfig> = [
    {
      id: ToolConfigIDs.SEARCH,
      tooltip: `Add albums (covers: ${covers.length})`,
      color: colorMap[Colors.GREEN],
      emoji: '🔍',
      value: openSearch,
      valueModifier: setOpenSearch,
      badge: covers.length,
      enabled: true,
    },
    {
      id: ToolConfigIDs.CONFIG,
      tooltip: `Settings (scale: ${configSize})`,
      color: colorMap[Colors.PURPLE],
      emoji: '⚙️',
      value: openConfig,
      valueModifier: setOpenConfig,
      badge: configSize === 1 ? 0 : configSize,
      enabled: true,
    },
    {
      id: ToolConfigIDs.SHARE,
      tooltip: `Share options (saves: ${savesNumber})`,
      color: colorMap[Colors.BLUE],
      emoji: '🔗',
      value: openShare,
      valueModifier: setOpenShare,
      badge: savesNumber === 1 ? 0 : savesNumber,
      enabled: true,
    },
    {
      id: ToolConfigIDs.ARROW,
      tooltip: `Create arrow mode (arrows: ${lines.length})`,
      color: colorMap[Colors.GOLD],
      emoji: '➜',
      value: editLines,
      valueModifier: setEditLines,
      badge: lines.length,
      enabled: true,
    },
    {
      id: ToolConfigIDs.ERASE,
      tooltip: `Erase mode (elements: ${lines.length + covers.length})`,
      color: colorMap[Colors.ORANGE],
      emoji: '🗑️',
      value: erase,
      valueModifier: setErase,
      badge: lines.length + covers.length,
      enabled: true,
    },
    {
      id: ToolConfigIDs.UNDO,
      tooltip: `Undo (moves: ${actions.length}/10)`,
      color: colorMap[Colors.PINK],
      emoji: '↩️',
      value: actions.length < 1,
      valueModifier: undoAction,
      badge: actions.length,
      enabled: true,
    },
    {
      id: ToolConfigIDs.SCREENSHOT,
      tooltip: `Take screenshot`,
      color: colorMap[Colors.RED],
      emoji: '📷',
      value: editLines || erase || !showTooltips,
      valueModifier: takeScreenshot,
      badge: 0,
      enabled: showTooltips && !editLines && !erase,
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
      {showTooltips && <ToolbarTooltip />}
    </>
  );
};
