import React, { createContext, useState, useContext } from 'react';
import { TooltipValues } from 'types';

interface ToolbarContextData {
  openSearch: boolean;
  setOpenSearch: React.Dispatch<React.SetStateAction<boolean>>;
  openResize: boolean;
  setOpenResize: React.Dispatch<React.SetStateAction<boolean>>;
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
  const [openSearch, setOpenSearch] = useState(false);
  const [openResize, setOpenResize] = useState(false);
  const [tooltip, setTooltip] = useState<TooltipValues | null>(null);
  const [openShare, setOpenShare] = useState(false);

  return (
    <ToolbarContext.Provider
      value={{
        openSearch,
        setOpenSearch,
        openResize,
        setOpenResize,
        tooltip,
        setTooltip,
        openShare,
        setOpenShare,
      }}>
      {children}
    </ToolbarContext.Provider>
  );
};
