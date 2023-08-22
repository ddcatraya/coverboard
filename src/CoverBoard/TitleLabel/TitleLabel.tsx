import React, { useMemo, useState } from 'react';

import { TextLabel } from 'components';
import { buildTitle, Modes } from 'types';
import { useMainStore, useUtilsStore } from 'store';

export const TitleLabel: React.FC = () => {
  const updateTitle = useMainStore((state) => state.updateTitle);
  const resetTitle = useMainStore((state) => state.resetTitle);
  const configs = useMainStore((state) => state.configs);
  const saveId = useMainStore((state) => state.saveId);
  const erase = useUtilsStore((state) => state.erase);
  const editLines = useUtilsStore((state) => state.editLines);

  const dragLimits = useMainStore((state) => state.dragLimits());
  const [open, setOpen] = useState(false);

  const handleReset = () => {
    resetTitle();
  };

  const handleSetLabel = (text: string) => {
    updateTitle(text);
  };

  const titleMode = useMemo(() => {
    if (erase) {
      return Modes.ERASE;
    } else if (editLines) {
      return Modes.ARROW;
    } else if (!configs.showTitle) {
      return '';
    } else if (!configs.title) {
      return buildTitle(saveId);
    }
    return configs.title;
  }, [configs.showTitle, configs.title, editLines, erase, saveId]);

  return (
    <TextLabel
      title="title"
      listening={!erase && !editLines}
      open={open}
      setOpen={setOpen}
      onReset={handleReset}
      label={titleMode}
      setLabel={handleSetLabel}
      pos={{
        x: dragLimits.width / 4,
        y: dragLimits.y,
        width: dragLimits.width / 2,
        align: 'center',
      }}
      labelSize={2}
    />
  );
};
