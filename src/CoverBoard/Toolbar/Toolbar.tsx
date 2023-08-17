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
  const { erase, setErase, editLines, setEditLines, undo, action } =
    useCoverContext();
  const {
    openSearch,
    setOpenSearch,
    openConfig,
    setOpenConfig,
    openShare,
    setOpenShare,
  } = useToolbarContext();

  const configTools: Array<ToolConfig> = [
    {
      id: ToolConfigIDs.SEARCH,
      tooltip: 'Add albums',
      color: colorMap[Colors.GREEN],
      emoji: '🔍',
      value: openSearch,
      valueModifier: setOpenSearch,
    },
    {
      id: ToolConfigIDs.CONFIG,
      tooltip: 'Settings',
      color: colorMap[Colors.PURPLE],
      emoji: '⚙️',
      value: openConfig,
      valueModifier: setOpenConfig,
    },
    {
      id: ToolConfigIDs.SHARE,
      tooltip: 'Share options',
      color: colorMap[Colors.BLUE],
      emoji: '🔗',
      value: openShare,
      valueModifier: setOpenShare,
    },
    {
      id: ToolConfigIDs.ARROW,
      tooltip: 'Create arrow mode',
      color: colorMap[Colors.GOLD],
      emoji: '➜',
      value: editLines,
      valueModifier: setEditLines,
    },
    {
      id: ToolConfigIDs.ERASE,
      tooltip: 'Erase mode',
      color: colorMap[Colors.ORANGE],
      emoji: '🗑️',
      value: erase,
      valueModifier: setErase,
    },
    {
      id: ToolConfigIDs.UNDO,
      tooltip: 'Undo up to 10 moves',
      color: colorMap[Colors.PINK],
      emoji: '↩️',
      value: action.length < 1,
      valueModifier: undo,
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
