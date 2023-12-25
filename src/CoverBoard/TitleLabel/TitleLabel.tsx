import React, { useMemo, useState } from 'react';

import { TextLabel } from 'components';
import { buildTitle } from 'types';
import { useMainStore } from 'store';
import { shallow } from 'zustand/shallow';

export const TitleLabel: React.FC = () => {
  const updateTitle = useMainStore((state) => state.updateTitle);
  const resetTitle = useMainStore((state) => state.resetTitle);
  const title = useMainStore((state) => state.configs.title);
  const showMainTitle = useMainStore((state) => state.configs.showMainTitle);
  const saveId = useMainStore((state) => state.saveId);
  const color = useMainStore((state) => state.getColor());

  const toobarIconSize = useMainStore((state) => state.toobarIconSize());
  const dragLimits = useMainStore((state) => state.dragLimits(), shallow);

  const [open, setOpen] = useState(false);

  const handleReset = () => {
    resetTitle();
  };

  const handleSetLabel = (text: string) => {
    updateTitle(text);
  };

  const titleMode = useMemo(() => {
    if (!showMainTitle) {
      return '';
    } else if (!title) {
      return buildTitle(saveId);
    }
    return title;
  }, [saveId, showMainTitle, title]);

  return (
    <TextLabel
      color={color}
      title="title"
      open={open}
      setOpen={setOpen}
      onReset={handleReset}
      label={titleMode}
      setLabel={handleSetLabel}
      pos={{
        x: dragLimits.width / 21,
        y: dragLimits.y + toobarIconSize / 2,
        width: dragLimits.width * 0.9,
        align: 'center',
      }}
      labelSize={2}
    />
  );
};
