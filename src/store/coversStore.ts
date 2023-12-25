import { Vector2d } from 'konva/lib/types';
import { Covers, LabelType, PosTypes } from 'types';
import { StateCreator } from 'zustand';

export interface UseCoverParams {
  covers: Array<Covers>;
  updateCoverDir: (coverId: string, dir: PosTypes) => void;
  updateCoverStarDir: (coverId: string, dir: PosTypes) => void;
  updateStarCount: (coverId: string, count: number) => void;
  updateAllCoversDir: (dir: PosTypes) => void;
  updateAllStarsDir: (dir: PosTypes) => void;
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
  addCovers: (filteredResults: Array<Covers>) => void;
  updateCoverPositionRelative: (coverId: string, { x, y }: Vector2d) => void;
  getDirById: (id: string) => Covers['dir'];
  getStarCount: (id: string) => Covers['starCount'];
  getStarDirById: (id: string) => Covers['dir'];
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
  getStarDirById: (id: string) =>
    get().covers.find((star) => star.id === id)?.starDir ?? PosTypes.TOP,
  getStarCount: (id: string) =>
    get().covers.find((star) => star.id === id)?.starCount ?? 0,
  updateAllCoversDir(dir) {
    set(({ covers }) => ({
      covers: covers.map((star) => ({
        ...star,
        dir,
      })),
    }));
  },
  updateAllStarsDir(starDir) {
    set(({ covers }) => ({
      covers: covers.map((star) => ({
        ...star,
        starDir,
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
  updateCoverStarDir(coverId, starDir) {
    set(({ covers }) => ({
      covers: covers.map((star) =>
        star.id === coverId
          ? {
              ...star,
              starDir,
            }
          : star,
      ),
    }));
  },
  updateStarCount(coverId, starCount) {
    set(({ covers }) => ({
      covers: covers.map((star) =>
        star.id === coverId
          ? {
              ...star,
              starCount,
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
  addCovers(filteredResults) {
    set(({ covers }) => ({
      covers: [...covers, ...filteredResults],
    }));
  },
  updateCoverPositionRelative(coverId, { x, y }) {
    set(({ covers }) => ({
      covers: covers.map((star) => {
        return coverId === star.id
          ? { ...star, x: star.x - x, y: star.y - y }
          : star;
      }),
    }));
  },
});
