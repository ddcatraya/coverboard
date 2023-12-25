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
  UNDO = 'undo',
  GROUP = 'group',
  SCREENSHOT = 'screenshot',
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
