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
  updateCoverPosition: (coverId: string, { x, y }: Vector2d) => void;
  updateAllCoverPosition: (arrayPos: Array<Vector2d>) => void;
  getDirById: (id: string) => Covers['dir'];
  updateScale: (
    id: string,
    scale: {
      scaleX: number;
      scaleY: number;
    },
  ) => void;
  getStarCount: (id: string) => Covers['starCount'];
  getScale: (id: string) => {
    scaleX: number;
    scaleY: number;
  };
  getLink: (id: string) => Covers['link'];
  getStarDirById: (id: string) => Covers['starDir'];
}

export const createCoversSlice: StateCreator<
  UseCoverParams,
  [],
  [],
  UseCoverParams
> = (set, get) => ({
  covers: [],
  getLink: (id: string) =>
    get().covers.find((star) => star.id === id)?.link ?? '',
  getDirById: (id: string) =>
    get().covers.find((star) => star.id === id)?.dir ?? PosTypes.BOTTOM,
  getStarDirById: (id: string) =>
    get().covers.find((star) => star.id === id)?.starDir ?? PosTypes.TOP,
  getStarCount: (id: string) =>
    get().covers.find((star) => star.id === id)?.starCount ?? 0,
  getScale: (id: string) => ({
    scaleX: get().covers.find((star) => star.id === id)?.scaleX ?? 1,
    scaleY: get().covers.find((star) => star.id === id)?.scaleY ?? 1,
  }),

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
  updateScale(coverId, scale) {
    set(({ covers }) => ({
      covers: covers.map((star) =>
        star.id === coverId
          ? {
              ...star,
              scaleX: scale.scaleX,
              scaleY: scale.scaleY,
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
  addGroupCovers(filteredResults) {
    set(({ covers }) => ({
      covers: [...covers, ...filteredResults],
    }));
  },
  updateCoverPosition(coverId, { x, y }) {
    set(({ covers }) => {
      const coverToChange = covers.find((star) => coverId === star.id);
      if (coverToChange) {
        const filteredCovers = covers.filter((star) => coverId !== star.id);

        if (coverToChange.link) {
          filteredCovers.push({ ...coverToChange, x, y });
        } else {
          filteredCovers.unshift({ ...coverToChange, x, y });
        }

        return { covers: filteredCovers };
      }

      return {
        covers,
      };
    });
  },
  updateAllCoverPosition(posArray) {
    set(({ covers }) => ({
      covers: covers.map((star, index) => {
        return { ...star, x: posArray[index].x, y: posArray[index].y };
      }),
    }));
  },
});
