export interface TooltipValues {
  text: string;
  x: number;
  y: number;
}

export enum ToolConfigIDs {
  SEARCH = 'search',
  CONFIG = 'config',
  SHARE = 'share',
  ARROW = 'arrow',
  ERASE = 'erase',
  UNDO = 'undo',
}

export interface ToolConfig {
  id: ToolConfigIDs;
  tooltip: string;
  color: string;
  emoji: string;
  value: boolean;
  valueModifier: React.Dispatch<React.SetStateAction<boolean>>;
  badge: number | null;
}
