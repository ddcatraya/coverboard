import React, { useMemo, useState } from 'react';

import { TextLabel } from 'components';
import { buildTitle, Modes } from 'types';
import { useMainStore, useUtilsStore } from 'store';

export const TitleLabel: React.FC = () => {
  const updateTitle = useMainStore((state) => state.updateTitle);
  const resetTitle = useMainStore((state) => state.resetTitle);
  const title = useMainStore((state) => state.configs.title);
  const showTitle = useMainStore((state) => state.configs.showTitle);
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
    } else if (!showTitle) {
      return '';
    } else if (!title) {
      return buildTitle(saveId);
    }
    return title;
  }, [editLines, erase, saveId, showTitle, title]);

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
