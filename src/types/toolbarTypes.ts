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
  GROUP = 'group',
}

export interface ToolConfig {
  id: ToolConfigIDs;
  tooltip: string;
  color: string;
  emoji: string;
  value: boolean;
  valueModifier: (arg: boolean) => void;
  badge: number | null;
  enabled: boolean;
}
