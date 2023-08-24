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
  SCREENSHOT = 'screenshot',
}

export interface ToolConfig {
  id: ToolConfigIDs;
  tooltip: string;
  color: string;
  emoji: string;
  value: boolean;
  valueModifier: (arg: any) => void;
  badge: number | null;
  enabled: boolean;
}
