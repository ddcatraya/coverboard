import { Html } from 'react-konva-utils';

import {
  useCoverContext,
  useSizesContext,
  useToastContext,
  useToolbarContext,
} from 'contexts';
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
  const { moveIntoView, offLimitCovers } = useSizesContext();
  const { showSuccessMessage } = useToastContext();

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
    moveIntoView();

    showSuccessMessage('All elements outside the screen were moved into view');
  };

  const handleDeleteElements = () => {
    clearAllCovers();

    clearAllLines();

    resetConfigs();

    showSuccessMessage('All elements on screen were cleaned');
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
        handleDeleteElements={handleDeleteElements}
        handleResetElements={handleResetElements}
      />
    </Html>
  );
};
