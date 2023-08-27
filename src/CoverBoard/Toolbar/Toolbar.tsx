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
import React, { useMemo } from 'react';
import { shallow } from 'zustand/shallow';

interface ToolbarProps {
  takeScreenshot: () => void;
  showTooltips: boolean;
}

const ToolbarActionIcon: React.FC = () => {
  const actionsLength = useMainStore((state) => state.actions.length);
  const undoAction = useMainStore((state) => state.undoAction);

  const actionConfig = useMemo<ToolConfig>(
    () => ({
      id: ToolConfigIDs.UNDO,
      tooltip: `Undo (moves: ${actionsLength}/10)`,
      color: colorMap[Colors.PINK],
      emoji: '↩️',
      value: actionsLength < 1,
      valueModifier: undoAction,
      badge: actionsLength,
      enabled: true,
    }),
    [actionsLength, undoAction],
  );

  return <ToolbarIcon config={actionConfig} index={6} />;
};

export const ToolbarMemo: React.FC<ToolbarProps> = ({
  takeScreenshot,
  showTooltips,
}) => {
  const [erase, setErase] = useUtilsStore(
    (state) => [state.erase, state.setErase],
    shallow,
  );
  const [editLines, setEditLines] = useUtilsStore(
    (state) => [state.editLines, state.setEditLines],
    shallow,
  );
  const [openConfig, setOpenConfig] = useToolbarStore(
    (state) => [state.openConfig, state.setOpenConfig],
    shallow,
  );
  const [openSearch, setOpenSearch] = useToolbarStore(
    (state) => [state.openSearch, state.setOpenSearch],
    shallow,
  );
  const [openShare, setOpenShare] = useToolbarStore(
    (state) => [state.openShare, state.setOpenShare],
    shallow,
  );

  const coversLength = useMainStore((state) => state.covers.length);
  const linesLength = useMainStore((state) => state.lines.length);
  const coverSizeWidth = useMainStore((state) => state.coverSizeWidth());

  const savesNumber = Object.keys(window.localStorage).filter((key) =>
    haxPrefix(key),
  ).length;
  const configSize = coverSizeWidth / 100;

  const configTools: Array<ToolConfig> = [
    {
      id: ToolConfigIDs.SEARCH,
      tooltip: `Search and add (covers: ${coversLength})`,
      color: colorMap[Colors.GREEN],
      emoji: '🔍',
      value: openSearch,
      valueModifier: setOpenSearch,
      badge: coversLength,
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
      tooltip: `Create arrow mode (arrows: ${linesLength})`,
      color: colorMap[Colors.YELLOW],
      emoji: '➜',
      value: editLines,
      valueModifier: setEditLines,
      badge: linesLength,
      enabled: true,
    },
    {
      id: ToolConfigIDs.ERASE,
      tooltip: `Erase mode (elements: ${linesLength + coversLength})`,
      color: colorMap[Colors.ORANGE],
      emoji: '🗑️',
      value: erase,
      valueModifier: setErase,
      badge: linesLength + coversLength,
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
      {openSearch && <ToolbarSearch />}
      {openConfig && <ToolbarConfig />}
      {openShare && <ToolbarShare />}
      {configTools.map((config, index) => (
        <ToolbarIcon config={config} key={config.id} index={index} />
      ))}
      <ToolbarActionIcon />
      {showTooltips && <ToolbarTooltip />}
    </>
  );
};

export const Toolbar = React.memo(ToolbarMemo);
