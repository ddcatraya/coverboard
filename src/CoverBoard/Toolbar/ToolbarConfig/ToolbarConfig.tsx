import { Html } from 'react-konva-utils';

import { useSizesContext, useToastContext, useToolbarContext } from 'contexts';
import { ToolbarConfigPopover } from '.';
import { ToolbarConfigParams, ToolbarConfigValues } from 'types';
import { useMainStore } from 'store';

export const ToolbarConfig: React.FC = () => {
  const { openConfig, setOpenConfig } = useToolbarContext();
  const configs = useMainStore((state) => state.configs);
  const updateConfigs = useMainStore((state) => state.updateConfigs);
  const updateAllCoversDir = useMainStore((state) => state.updateAllCoversDir);
  const { moveIntoView, offLimitCovers } = useSizesContext();
  const { showSuccessMessage } = useToastContext();

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
    moveIntoView();

    showSuccessMessage('All elements outside the screen were moved into view');
  };

  if (!openConfig) return null;

  return (
    <Html>
      <ToolbarConfigPopover
        open={openConfig}
        onClose={() => setOpenConfig(false)}
        onSubmit={handleUpdateCover}
        config={configs}
        offLimitCovers={offLimitCovers}
        handleResetElements={handleResetElements}
      />
    </Html>
  );
};
