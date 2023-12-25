import { Covers, PosTypes } from 'types';
import { StateCreator } from 'zustand';

export interface UseCoverParams {
  covers: Array<Covers>;
  updateCoverStarDir: (coverId: string, dir: PosTypes) => void;
  updateStarCount: (coverId: string, count: number) => void;
  updateAllCoversDir: (dir: PosTypes) => void;
  updateAllStarsDir: (dir: PosTypes) => void;
  resetCoverLabel: (coverId: string, coverLabel: 'title' | 'subtitle') => void;
  updateCoverLabel: (
    coverId: string,
    coverLabel: 'title' | 'subtitle',
    label: string,
  ) => void;
  updateCoversText: (
    coverId: string,
    titleText: string,
    subTitleText: string,
  ) => void;
  addCovers: (filteredResults: Array<Covers>) => void;
  getStarCount: (id: string) => number;
  getStarDirById: (id: string) => PosTypes;
  updateCoverTitleDir: (coverId: string, dir: PosTypes) => void;
  updateCoverSubtitleDir: (coverId: string, dir: PosTypes) => void;
}

export const createCoversSlice: StateCreator<
  UseCoverParams,
  [],
  [],
  UseCoverParams
> = (set, get) => ({
  covers: [],
  getStarDirById: (id: string) =>
    get().covers.find((star) => star.id === id)?.star.dir ?? PosTypes.TOP,
  getStarCount: (id: string) =>
    get().covers.find((star) => star.id === id)?.star.count ?? 0,
  updateAllCoversDir(dir) {
    set(({ covers }) => ({
      covers: covers.map((star) => ({
        ...star,
        title: {
          ...star.title,
          dir,
        },
        subtitle: {
          ...star.subtitle,
          dir,
        },
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
  updateCoverTitleDir(coverId, dir) {
    set(({ covers }) => ({
      covers: covers.map((star) =>
        star.id === coverId
          ? {
              ...star,
              title: {
                ...star.title,
                dir,
              },
            }
          : star,
      ),
    }));
  },
  updateCoverSubtitleDir(coverId, dir) {
    set(({ covers }) => ({
      covers: covers.map((star) =>
        star.id === coverId
          ? {
              ...star,
              subtitle: {
                ...star.subtitle,
                dir,
              },
            }
          : star,
      ),
    }));
  },
  updateCoverStarDir(coverId, dir) {
    set(({ covers }) => ({
      covers: covers.map((cover) =>
        cover.id === coverId
          ? {
              ...cover,
              star: {
                ...cover.star,
                dir,
              },
            }
          : cover,
      ),
    }));
  },
  updateStarCount(coverId, count) {
    set(({ covers }) => ({
      covers: covers.map((cover) =>
        cover.id === coverId
          ? {
              ...cover,
              star: {
                ...cover.star,
                count,
              },
            }
          : cover,
      ),
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
  updateCoversText(coverId, titleText, subTitleText) {
    set(({ covers }) => ({
      covers: covers.map((star) =>
        coverId === star.id
          ? {
              ...star,
              title: {
                ...star.title,
                text: titleText,
              },
              subtitle: {
                ...star.subtitle,
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
});
