import { Vector2d } from 'konva/lib/types';
import { Dispatch, SetStateAction } from 'react';
import {
  CoverImage,
  LocalStorageKeys,
  PosTypes,
  LabelType,
  LocalStorageData,
} from 'types';
import { useLocalStorage } from 'usehooks-ts';

export interface UseCoverParams {
  [LocalStorageKeys.COVER]: LocalStorageData[LocalStorageKeys.COVER];
  setCover: Dispatch<SetStateAction<LocalStorageData[LocalStorageKeys.COVER]>>;
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
  addCovers: (filteredAlbums: Array<CoverImage>) => void;
  updateCoverPosition: (coverId: string, { x, y }: Vector2d) => void;
}

export const useCover = (updateAction: () => void): UseCoverParams => {
  const [cover, setCover] = useLocalStorage<Array<CoverImage>>(
    LocalStorageKeys.COVER,
    [],
  );

  return {
    cover,
    setCover,
    updateAllCoversDir(dir) {
      setCover((currentCover) =>
        currentCover.map((star) => ({
          ...star,
          dir,
        })),
      );
      updateAction();
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
      updateAction();
    },
    resetAllCovers() {
      setCover((currentCover) =>
        currentCover.map((star) => ({
          ...star,
          artistLabel: {
            ...star.artistLabel,
            text: star.artistLabel.originalText,
          },
          albumLabel: {
            ...star.albumLabel,
            text: star.albumLabel.originalText,
          },
          dir: PosTypes.BOTTOM,
        })),
      );
      updateAction();
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
      updateAction();
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
      updateAction();
    },
    removeCover(coverId) {
      setCover((currentCover) => currentCover.filter((c) => c.id !== coverId));
      updateAction();
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
      updateAction();
    },
    addCovers(filteredAlbums) {
      setCover((currentAlbums) => [...currentAlbums, ...filteredAlbums]);
      updateAction();
    },
    updateCoverPosition(coverId, { x, y }) {
      setCover((currentCover) =>
        currentCover.map((star) => {
          return coverId === star.id ? { ...star, x, y } : star;
        }),
      );
      updateAction();
    },
  };
};
