import { useCoverContext, useToolbarContext } from 'contexts';
import {
  ToolbarSearch,
  ToolbarShare,
  ToolbarConfig,
  ToolbarIcon,
  ToolbarTooltip,
} from '.';
import { Colors, ToolConfig, ToolConfigIDs } from 'types';

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
      color: Colors.GREEN,
      emoji: '🔍',
      value: openSearch,
      valueModifier: setOpenSearch,
    },
    {
      id: ToolConfigIDs.CONFIG,
      tooltip: 'Settings',
      color: Colors.PURPLE,
      emoji: '⚙️',
      value: openConfig,
      valueModifier: setOpenConfig,
    },
    {
      id: ToolConfigIDs.SHARE,
      tooltip: 'Share options',
      color: Colors.BLUE,
      emoji: '🔗',
      value: openShare,
      valueModifier: setOpenShare,
    },
    {
      id: ToolConfigIDs.ARROW,
      tooltip: 'Create arrow mode',
      color: Colors.GOLD,
      emoji: '➜',
      value: editLines,
      valueModifier: setEditLines,
    },
    {
      id: ToolConfigIDs.ERASE,
      tooltip: 'Erase mode',
      color: Colors.ORANGE,
      emoji: '🗑️',
      value: erase,
      valueModifier: setErase,
    },
    {
      id: ToolConfigIDs.UNDO,
      tooltip: 'Undo up to 10 moves',
      color: Colors.PINK,
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
