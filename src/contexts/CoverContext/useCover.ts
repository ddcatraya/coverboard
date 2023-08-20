import { Vector2d } from 'konva/lib/types';
import { Covers, PosTypes, LabelType, Lines } from 'types';
export interface UseCoverParams {
  updateCoverDir: (coverId: string, dir: PosTypes) => void;
  updateAllCoversDir: (dir: PosTypes) => void;
  resetAllCovers: () => void;
  resetCoverLabel: (coverId: string, coverLabel: LabelType) => void;
  updateCoverLabel: (
    coverId: string,
    coverLabel: LabelType,
    label: string,
  ) => void;
  removeCover: (coverId: string) => void;
  updateCoversText: (artistText: string, albumText: string) => void;
  addCovers: (filteredAlbums: Array<Covers>) => void;
  updateCoverPosition: (coverId: string, { x, y }: Vector2d) => void;
  updateAllCoverPosition: (arrayPos: Array<Vector2d>) => void;
  clearAllCovers: () => void;
}

export const useCover = (
  setCover: (currentCover: (curr: Covers[]) => Covers[]) => void,
  setLines: (currentLines: (curr: Lines[]) => Lines[]) => void,
): UseCoverParams => {
  return {
    clearAllCovers() {
      setCover(() => []);
      setLines(() => []);
    },
    updateAllCoversDir(dir) {
      setCover((currentCover) =>
        currentCover.map((star) => ({
          ...star,
          dir,
        })),
      );
    },
    updateCoverDir(coverId, dir) {
      setCover((currentCover) =>
        currentCover.map((star) =>
          star.id === coverId
            ? {
                ...star,
                dir,
              }
            : star,
        ),
      );
    },
    resetAllCovers() {
      setCover((currentCover) =>
        currentCover.map((star) => ({
          ...star,
          artist: {
            ...star.artist,
            text: star.artist.originalText,
          },
          album: {
            ...star.album,
            text: star.album.originalText,
          },
          dir: PosTypes.BOTTOM,
          x: 0,
          y: 0,
        })),
      );
    },
    resetCoverLabel(coverId, coverLabel) {
      setCover((currentCover) =>
        currentCover.map((star) =>
          star.id === coverId
            ? {
                ...star,
                [coverLabel]: {
                  ...star[coverLabel],
                  text: star[coverLabel].originalText,
                },
                dir: PosTypes.BOTTOM,
              }
            : star,
        ),
      );
    },
    updateCoverLabel(coverId, coverLabel, text) {
      setCover((currentCover) =>
        currentCover.map((star) => {
          return coverId === star.id
            ? {
                ...star,
                [coverLabel]: {
                  ...star[coverLabel],
                  text,
                },
              }
            : star;
        }),
      );
    },
    removeCover(coverId) {
      setCover((currentCover) => currentCover.filter((c) => c.id !== coverId));
      setLines((currentLine) =>
        currentLine.filter(
          (l) => l.origin.id !== coverId || l.target.id !== coverId,
        ),
      );
    },
    updateCoversText(artistText, albumText) {
      setCover((currentCover) =>
        currentCover.map((star) => ({
          ...star,
          [LabelType.ARTIST]: {
            ...star[LabelType.ARTIST],
            text: artistText,
          },
          [LabelType.ALBUM]: {
            ...star[LabelType.ALBUM],
            text: albumText,
          },
        })),
      );
    },
    addCovers(filteredAlbums) {
      setCover((currentAlbums) => [...currentAlbums, ...filteredAlbums]);
    },
    updateCoverPosition(coverId, { x, y }) {
      setCover((currentCover) =>
        currentCover.map((star) => {
          return coverId === star.id ? { ...star, x, y } : star;
        }),
      );
    },
    updateAllCoverPosition(posArray) {
      setCover((currentCover) =>
        currentCover.map((star, index) => {
          return { ...star, x: posArray[index].x, y: posArray[index].y };
        }),
      );
    },
  };
};
