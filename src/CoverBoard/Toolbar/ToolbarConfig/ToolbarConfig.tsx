import { Html } from 'react-konva-utils';

import { ToolbarConfigPopover } from '.';
import { ToolbarConfigParams, ToolbarConfigValues } from 'types';
import { useMainStore, useToastStore, useToolbarStore } from 'store';
import { Vector2d } from 'konva/lib/types';
import { shallow } from 'zustand/shallow';

export const ToolbarConfig: React.FC = () => {
  const [openConfig, setOpenConfig] = useToolbarStore(
    (state) => [state.openConfig, state.setOpenConfig],
    shallow,
  );
  const coverSizeWidth = useMainStore((state) => state.coverSizeWidth());
  const coverSizeHeight = useMainStore((state) => state.coverSizeHeight());
  const covers = useMainStore((state) => state.covers);
  const dragLimits = useMainStore((state) => state.dragLimits(), shallow);
  const updateConfigs = useMainStore((state) => state.updateConfigs);
  const updateAllCoverPosition = useMainStore(
    (state) => state.updateAllCoverPosition,
  );
  const updateAllCoversDir = useMainStore((state) => state.updateAllCoversDir);
  const showSuccessMessage = useToastStore((state) => state.showSuccessMessage);

  const handleUpdateCover = (
    config: ToolbarConfigParams,
    updatedParam?: ToolbarConfigValues,
  ) => {
    if (updatedParam === ToolbarConfigValues.LABEL_DIR) {
      updateAllCoversDir(config[ToolbarConfigValues.LABEL_DIR]);
    } else {
      updateConfigs({ ...config, title: config.title.trim() });
    }
  };

  const handleResetElements = () => {
    const posArray = covers.map(({ x, y }) => {
      let pos: Vector2d = { x, y };
      if (x > dragLimits.width - coverSizeWidth && x > 0) {
        pos.x = dragLimits.width - coverSizeWidth;
      }
      if (y > dragLimits.height - coverSizeHeight && y > 0) {
        pos.y = dragLimits.height - coverSizeHeight;
      }
      return pos;
    });
    if (posArray.length) {
      updateAllCoverPosition(posArray);
    }

    showSuccessMessage('All elements outside the screen were moved into view');
  };

  if (!openConfig) return null;

  return (
    <Html>
      <ToolbarConfigPopover
        open={openConfig}
        onClose={() => setOpenConfig(false)}
        onSubmit={handleUpdateCover}
        handleResetElements={handleResetElements}
      />
    </Html>
  );
};
