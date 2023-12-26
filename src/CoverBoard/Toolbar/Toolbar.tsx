import {
  ToolbarSearch,
  ToolbarShare,
  ToolbarConfig,
  ToolbarIcon,
  ToolbarTooltip,
} from '.';
import { colorMap, Colors, PosTypes, ToolConfig, ToolConfigIDs } from 'types';
import { haxPrefix } from 'utils';
import { useUtilsStore, useMainStore, useToolbarStore } from 'store';
import React, { useMemo } from 'react';
import { shallow } from 'zustand/shallow';
import { v4 as uuidv4 } from 'uuid';

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

  return <ToolbarIcon config={actionConfig} index={5} />;
};

export const ToolbarMemo: React.FC<ToolbarProps> = ({
  takeScreenshot,
  showTooltips,
}) => {
  const editLines = useUtilsStore((state) => state.points);
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
  const groupsLength = useMainStore((state) => state.groups.length);
  const linesLength = useMainStore((state) => state.lines.length);
  const coverSizeWidth = useMainStore((state) => state.coverSizeWidth());
  const addGroups = useMainStore((state) => state.addGroups);
  const groupDir = useMainStore((state) => state.configs.groupDir);

  const createGroup = () => {
    addGroups([
      {
        id: uuidv4(),
        x: 0,
        y: 0,
        title: { text: 'Group', dir: groupDir ?? PosTypes.TOP },
        subtitle: { text: '', dir: groupDir ?? PosTypes.TOP },
        scaleX: 3,
        scaleY: 3,
      },
    ]);
  };

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
      id: ToolConfigIDs.GROUP,
      tooltip: `Create Group`,
      color: colorMap[Colors.YELLOW],
      emoji: '📁',
      value: false,
      valueModifier: createGroup,
      badge: groupsLength,
      enabled: true,
    },
    {
      id: ToolConfigIDs.SCREENSHOT,
      tooltip: `Take screenshot (elems: ${
        groupsLength + coversLength + linesLength
      })`,
      color: colorMap[Colors.ORANGE],
      emoji: '📷',
      value: !!editLines || !showTooltips,
      valueModifier: takeScreenshot,
      badge: groupsLength + coversLength + linesLength,
      enabled: showTooltips && !editLines,
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
