import { BackColors, Colors, ToolbarConfigParams } from './configTypes';
import { CoverImage } from './coverTypes';
import { LinePoint } from './lineTypes';
import { z } from 'zod';
import { PosTypes } from './generalTypes';

export enum LocalStorageKeys {
  COVER = 'cover',
  LINES = 'lines',
  CONFIG = 'configs',
}

export interface LocalStorageData {
  [LocalStorageKeys.CONFIG]: ToolbarConfigParams;
  [LocalStorageKeys.COVER]: Array<CoverImage>;
  [LocalStorageKeys.LINES]: Array<LinePoint>;
}

export const schema = (cover: CoverImage[]) =>
  z.object({
    configs: z.object({
      size: z.number().min(50).max(200),
      title: z.string(),
      color: z.nativeEnum(Colors),
      backColor: z.nativeEnum(BackColors),
      showArtist: z.boolean(),
      showAlbum: z.boolean(),
      showTitle: z.boolean(),
      labelDir: z.nativeEnum(PosTypes),
    }),
    cover: z.array(
      z.object({
        id: z.string(),
        link: z.string().url().includes('https://lastfm.freetls.fastly.net'),
        x: z.number().min(0),
        y: z.number().min(0),
        artistLabel: z.object({
          originalText: z.string(),
          text: z.string(),
        }),
        albumLabel: z.object({
          originalText: z.string(),
          text: z.string(),
        }),
        dir: z.nativeEnum(PosTypes),
      }),
    ),
    lines: z.array(
      z.object({
        id: z.string(),
        label: z.object({
          text: z.string(),
          dir: z.nativeEnum(PosTypes),
        }),
        origin: z.object({
          id: z.string().refine((id) => {
            return cover.find((c) => c.id === id);
          }),
          pos: z.nativeEnum(PosTypes),
        }),
        target: z.object({
          id: z.string().refine((id) => {
            return cover.find((c) => c.id === id);
          }),
          pos: z.nativeEnum(PosTypes),
        }),
      }),
    ),
  });
