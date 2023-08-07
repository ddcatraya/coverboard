export interface TooltipValues {
  text: string;
  x: number;
  y: number;
}

export enum ToolConfigIDs {
  SEARCH = 'search',
  RESIZE = 'resize',
  SHARE = 'share',
  ARROW = 'arrow',
  ERASE = 'erase',
}

export interface ToolConfig {
  id: ToolConfigIDs;
  tooltip: string;
  color: string;
  emoji: string;
  value: boolean;
  valueModifier: React.Dispatch<React.SetStateAction<boolean>>;
  reverse: boolean;
}
