import React, { useMemo, useState } from 'react';

import { TextLabel } from 'components';
import { useCoverContext, useSizesContext } from 'contexts';

export const TitleLabel: React.FC = () => {
  const { updateTitle, resetTitle, configs, erase, editLines } =
    useCoverContext();
  const { dragLimits, windowSize, coverSize, initialX } = useSizesContext();
  const [open, setOpen] = useState(false);

  const handleReset = () => {
    resetTitle();
  };

  const handleSetLabel = (text: string) => {
    updateTitle(text);
  };

  const titleMode = useMemo(() => {
    if (erase) {
      return '<Erase mode>';
    } else if (editLines) {
      return '<Create arrow mode>';
    } else if (!configs.showTitle) {
      return '';
    }
    return configs.title;
  }, [configs.showTitle, configs.title, editLines, erase]);

  return (
    <TextLabel
      title="title"
      listening={!erase && !editLines && !!configs.title}
      open={open}
      setOpen={setOpen}
      onReset={handleReset}
      label={titleMode}
      setLabel={handleSetLabel}
      pos={{
        x: -configs.size / 2 + dragLimits.width / 4,
        y: 0,
        width: dragLimits.width / 2,
        align: 'center',
      }}
      labelSize={2}
    />
  );
};
