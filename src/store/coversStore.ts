import { Vector2d } from 'konva/lib/types';
import { Covers, LabelType, PosTypes } from 'types';
import { StateCreator } from 'zustand';

export interface UseCoverParams {
  covers: Array<Covers>;
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
  updateCoversText: (
    coverId: string,
    titleText: string,
    subTitleText: string,
  ) => void;
  addCovers: (filteredAlbums: Array<Covers>) => void;
  updateCoverPosition: (coverId: string, { x, y }: Vector2d) => void;
  updateAllCoverPosition: (arrayPos: Array<Vector2d>) => void;
  getDirById: (id: string) => Covers['dir'];
}

export const createCoversSlice: StateCreator<
  UseCoverParams,
  [],
  [],
  UseCoverParams
> = (set, get) => ({
  covers: [],
  getDirById: (id: string) =>
    get().covers.find((star) => star.id === id)?.dir ?? PosTypes.BOTTOM,
  updateAllCoversDir(dir) {
    set(({ covers }) => ({
      covers: covers.map((star) => ({
        ...star,
        dir,
      })),
    }));
  },
  updateCoverDir(coverId, dir) {
    set(({ covers }) => ({
      covers: covers.map((star) =>
        star.id === coverId
          ? {
              ...star,
              dir,
            }
          : star,
      ),
    }));
  },
  resetAllCovers() {
    set(({ covers }) => ({
      covers: covers.map((star) => ({
        ...star,
        [LabelType.TITLE]: {
          ...star[LabelType.TITLE],
          text: star[LabelType.TITLE].search,
        },
        [LabelType.SUBTITLE]: {
          ...star[LabelType.SUBTITLE],
          text: star[LabelType.SUBTITLE].search,
        },
        dir: PosTypes.BOTTOM,
        x: 0,
        y: 0,
      })),
    }));
  },
  resetCoverLabel(coverId, coverLabel) {
    set(({ covers }) => ({
      covers: covers.map((star) =>
        star.id === coverId
          ? {
              ...star,
              [coverLabel]: {
                ...star[coverLabel],
                text: star[coverLabel].search,
              },
              dir: PosTypes.BOTTOM,
            }
          : star,
      ),
    }));
  },
  updateCoverLabel(coverId, coverLabel, text) {
    set(({ covers }) => ({
      covers: covers.map((star) => {
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
    }));
  },
  removeCover(coverId) {
    set(({ covers }) => ({
      covers: covers.filter((c) => c.id !== coverId),
    }));
    /* setLines((currentLine) =>
      currentLine.filter(
        (l) => l.origin.id !== coverId || l.target.id !== coverId,
      ),
    ); */
  },
  updateCoversText(coverId, titleText, subTitleText) {
    set(({ covers }) => ({
      covers: covers.map((star) =>
        coverId === star.id
          ? {
              ...star,
              [LabelType.TITLE]: {
                ...star[LabelType.TITLE],
                text: titleText,
              },
              [LabelType.SUBTITLE]: {
                ...star[LabelType.SUBTITLE],
                text: subTitleText,
              },
            }
          : star,
      ),
    }));
  },
  addCovers(filteredAlbums) {
    set(({ covers }) => ({
      covers: [...covers, ...filteredAlbums],
    }));
  },
  updateCoverPosition(coverId, { x, y }) {
    set(({ covers }) => ({
      covers: covers.map((star) => {
        return coverId === star.id ? { ...star, x, y } : star;
      }),
    }));
  },
  updateAllCoverPosition(posArray) {
    set(({ covers }) => ({
      covers: covers.map((star, index) => {
        return { ...star, x: posArray[index].x, y: posArray[index].y };
      }),
    }));
  },
});
