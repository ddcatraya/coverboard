import { Html } from 'react-konva-utils';

import { useCoverContext, useToolbarContext } from 'contexts';
import { ToolbarConfigPopover } from '.';
import { ToolbarConfigParams, ToolbarConfigValues } from 'types';

export const ToolbarConfig: React.FC = () => {
  const { openConfig, setOpenConfig } = useToolbarContext();
  const {
    updateConfigs,
    resetConfigs,
    configs,
    updateAllCoversDir,
    clearAllCovers,
    clearAllLines,
  } = useCoverContext();

  const handleUpdateCover = (
    config: ToolbarConfigParams,
    updatedParam?: ToolbarConfigValues,
  ) => {
    if (updatedParam === ToolbarConfigValues.LABEL_DIR) {
      updateAllCoversDir(config[ToolbarConfigValues.LABEL_DIR]);
    } else {
      updateConfigs(config);
    }
  };

  const handleDeleteElements = () => {
    clearAllCovers();

    clearAllLines();

    resetConfigs();
  };

  if (!openConfig) return null;

  return (
    <Html>
      <ToolbarConfigPopover
        open={openConfig}
        onClose={() => setOpenConfig(false)}
        onSubmit={handleUpdateCover}
        config={configs}
        handleDeleteElements={handleDeleteElements}
      />
    </Html>
  );
};
