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
  const { erase, setErase, editLines, setEditLines } = useCoverContext();
  const {
    openSearch,
    setOpenSearch,
    openResize,
    setOpenResize,
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
      reverse: true,
    },
    {
      id: ToolConfigIDs.RESIZE,
      tooltip: 'Settings',
      color: Colors.PURPLE,
      emoji: '⚙️',
      value: openResize,
      valueModifier: setOpenResize,
      reverse: true,
    },
    {
      id: ToolConfigIDs.SHARE,
      tooltip: 'Share options',
      color: Colors.BLUE,
      emoji: '🔗',
      value: openShare,
      valueModifier: setOpenShare,
      reverse: true,
    },
    {
      id: ToolConfigIDs.ARROW,
      tooltip: 'Create arrow mode',
      color: Colors.GOLD,
      emoji: '➜',
      value: editLines,
      valueModifier: setEditLines,
      reverse: true,
    },
    {
      id: ToolConfigIDs.ERASE,
      tooltip: 'Erase mode',
      color: Colors.ORANGE,
      emoji: '🗑️',
      value: erase,
      valueModifier: setErase,
      reverse: true,
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
