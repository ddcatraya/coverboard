import { Html } from 'react-konva-utils';

import { useCoverContext, useToolbarContext } from 'contexts';
import { ToolbarConfigPopover } from '.';
import { ToolbarConfigParams, ToolbarConfigValues } from 'types';

export const ToolbarConfig: React.FC = () => {
  const { openResize, setOpenResize } = useToolbarContext();
  const {
    updateConfigs,
    resetConfigs,
    configs,
    resetAllCovers,
    resetAllLines,
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

  const handleResetElements = () => {
    resetAllCovers();

    resetAllLines();

    resetConfigs();
  };

  const handleDeleteElements = () => {
    clearAllCovers();

    clearAllLines();

    resetConfigs();
  };

  if (!openResize) return null;

  return (
    <Html>
      <ToolbarConfigPopover
        open={openResize}
        onClose={() => setOpenResize(false)}
        onSubmit={handleUpdateCover}
        config={configs}
        handleResetSettings={resetConfigs}
        handleResetElements={handleResetElements}
        handleDeleteElements={handleDeleteElements}
      />
    </Html>
  );
};
