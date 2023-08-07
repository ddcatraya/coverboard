export interface SearchResults {
  link: string;
  artist: string;
  album: string;
}

export enum PopupState {
  ARTIST = 'artist',
  ALBUM = 'album',
}

export interface SearchParams {
  [PopupState.ARTIST]: string;
  [PopupState.ALBUM]: string;
}
