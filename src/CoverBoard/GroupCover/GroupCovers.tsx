import { Group } from 'react-konva';
import { useMainStore, useUtilsStore } from 'store';
import { GroupCover } from './GroupCover';

export const GroupCovers: React.FC = () => {
  const groups = useMainStore((state) => state.groups);
  const setSelected = useUtilsStore((state) => state.setSelected);
  const refreshGroups = useMainStore((state) => state.refreshGroups);

  const handlesSelect = (evt, groupId: string) => {
    evt.cancelBubble = true;
    setSelected({ id: groupId, elem: 'group', open: false });
    refreshGroups(groupId);
  };

  return (
    <>
      {groups.map((group) => (
        <Group
          key={group.id}
          onClick={(evt) => handlesSelect(evt, group.id)}
          onTouchStart={(evt) => handlesSelect(evt, group.id)}>
          <GroupCover
            id={group.id}
            title={group.title.text}
            subtitle={group.subtitle.text}
            x={group.x}
            y={group.y}
            dir={group.title.dir}
            subDir={group.subtitle.dir}
            scaleX={group.scaleX}
            scaleY={group.scaleY}
          />
        </Group>
      ))}
    </>
  );
};
