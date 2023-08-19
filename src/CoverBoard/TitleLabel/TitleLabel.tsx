import React, { useMemo, useState } from 'react';

import { TextLabel } from 'components';
import { useCoverContext, useSizesContext } from 'contexts';
import { Modes } from 'types';

export const TitleLabel: React.FC = () => {
  const { updateTitle, resetTitle, configs, erase, editLines } =
    useCoverContext();
  const { dragLimits } = useSizesContext();
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
      return Modes.TITLE;
    }
    return configs.title;
  }, [configs.showTitle, configs.title, editLines, erase]);

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
