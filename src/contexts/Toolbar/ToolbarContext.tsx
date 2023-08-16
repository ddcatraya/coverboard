import React, { createContext, useState, useContext } from 'react';
import { ToolConfigIDs, TooltipValues } from 'types';
import { getHash } from 'utils';

interface ToolbarContextData {
  openSearch: boolean;
  setOpenSearch: React.Dispatch<React.SetStateAction<boolean>>;
  openConfig: boolean;
  setOpenConfig: React.Dispatch<React.SetStateAction<boolean>>;
  tooltip: TooltipValues | null;
  setTooltip: React.Dispatch<React.SetStateAction<TooltipValues | null>>;
  openShare: boolean;
  setOpenShare: React.Dispatch<React.SetStateAction<boolean>>;
}

const ToolbarContext = createContext<ToolbarContextData>(
  {} as ToolbarContextData,
);

export const useToolbarContext = () => {
  const context = useContext(ToolbarContext);
  if (!context) {
    throw new Error('useToolbarContext must be used within a ToobarProvider');
  }
  return context;
};

export const ToolbarProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const hash = getHash();
  const [openSearch, setOpenSearch] = useState(hash === ToolConfigIDs.SEARCH);
  const [openConfig, setOpenConfig] = useState(hash === ToolConfigIDs.CONFIG);
  const [tooltip, setTooltip] = useState<TooltipValues | null>(null);
  const [openShare, setOpenShare] = useState(hash === ToolConfigIDs.SHARE);

  return (
    <ToolbarContext.Provider
      value={{
        openSearch,
        setOpenSearch,
        openConfig,
        setOpenConfig,
        tooltip,
        setTooltip,
        openShare,
        setOpenShare,
      }}>
      {children}
    </ToolbarContext.Provider>
  );
};
