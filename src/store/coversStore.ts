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
    get().covers.find((cover) => cover.id === id)?.star.dir ?? PosTypes.TOP,
  getStarCount: (id: string) =>
    get().covers.find((cover) => cover.id === id)?.star.count ?? 0,
  updateAllCoversDir(dir) {
    set(({ covers }) => ({
      covers: covers.map((cover) => ({
        ...cover,
        title: {
          ...cover.title,
          dir,
        },
        subtitle: {
          ...cover.subtitle,
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
      covers: covers.map((cover) =>
        cover.id === coverId
          ? {
              ...cover,
              title: {
                ...cover.title,
                dir,
              },
            }
          : cover,
      ),
    }));
  },
  updateCoverSubtitleDir(coverId, dir) {
    set(({ covers }) => ({
      covers: covers.map((cover) =>
        cover.id === coverId
          ? {
              ...cover,
              subtitle: {
                ...cover.subtitle,
                dir,
              },
            }
          : cover,
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
      covers: covers.map((cover) =>
        cover.id === coverId
          ? {
              ...cover,
              [coverLabel]: {
                ...cover[coverLabel],
                text: cover[coverLabel].search,
              },
              dir: PosTypes.BOTTOM,
            }
          : cover,
      ),
    }));
  },
  updateCoverLabel(coverId, coverLabel, text) {
    set(({ covers }) => ({
      covers: covers.map((cover) => {
        return coverId === cover.id
          ? {
              ...cover,
              [coverLabel]: {
                ...cover[coverLabel],
                text,
              },
            }
          : cover;
      }),
    }));
  },
  updateCoversText(coverId, titleText, subTitleText) {
    set(({ covers }) => ({
      covers: covers.map((cover) =>
        coverId === cover.id
          ? {
              ...cover,
              title: {
                ...cover.title,
                text: titleText,
              },
              subtitle: {
                ...cover.subtitle,
                text: subTitleText,
              },
            }
          : cover,
      ),
    }));
  },
  addCovers(filteredResults) {
    set(({ covers }) => ({
      covers: [...covers, ...filteredResults],
    }));
  },
});
