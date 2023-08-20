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
  const { updateConfigs, configs, updateAllCoversDir } = useCoverContext();
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
