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

export const schema = (cover: CoverImage[], lines: LinePoint[]) =>
  z.object({
    configs: z.object(
      {
        size: z
          .number({
            invalid_type_error: 'configs:size must be a number',
            required_error: 'configs:size is required',
          })
          .min(50, 'configs:size must be a number higher than 50')
          .max(200, 'configs:size must be a number lower than 200'),
        title: z
          .string({
            invalid_type_error: 'configs:title must be a string',
            required_error: 'configs:title is required',
          })
          .trim(),
        color: z.nativeEnum(Colors, {
          errorMap: (_, _ctx) => {
            return {
              message: `configs:color must be ${Object.values(Colors).join(
                ' | ',
              )}`,
            };
          },
        }),
        backColor: z.nativeEnum(BackColors, {
          errorMap: (_, _ctx) => {
            return {
              message: `configs:backColor must be ${Object.values(
                BackColors,
              ).join(' | ')}`,
            };
          },
        }),
        showArtist: z.boolean({
          invalid_type_error: 'configs:showArtist must be a boolean',
          required_error: 'configs:showArtist is required',
        }),
        showAlbum: z.boolean({
          invalid_type_error: 'configs:showAlbum must be a boolean',
          required_error: 'configs:showAlbum is required',
        }),
        showTitle: z.boolean({
          invalid_type_error: 'configs:showTitle must be a boolean',
          required_error: 'configs:showTitle is required',
        }),
        labelDir: z.nativeEnum(PosTypes, {
          errorMap: (_, _ctx) => {
            return {
              message: `configs:labelDir must be ${Object.values(PosTypes).join(
                ' | ',
              )}`,
            };
          },
        }),
      },
      {
        invalid_type_error: 'configs must be a object',
        required_error: 'configs is required',
      },
    ),
    cover: z.array(
      z.object({
        id: z
          .string({
            invalid_type_error: 'cover:id must be a string',
            required_error: 'cover:id is required',
          })
          .refine((id) => {
            return cover.find((c) => c.id === id);
          }, 'cover:id cannot be modified'),
        link: z.string().url().includes('https://lastfm.freetls.fastly.net'),
        x: z
          .number({
            invalid_type_error: 'cover:x position must be a number',
            required_error: 'cover:x is required',
          })
          .min(0, 'cover:x position must be positive number'),
        y: z
          .number({
            invalid_type_error: 'cover:y position must be a number',
            required_error: 'cover:y is required',
          })
          .min(0, 'cover:y position must be positive number'),
        artistLabel: z.object({
          originalText: z
            .string({
              invalid_type_error:
                'cover:artistLabel:originalText must be a string',
              required_error: 'cover:artistLabel:originalText is required',
            })
            .refine((text) => {
              return cover.find((c) => c.artistLabel.originalText === text);
            }, 'cover:artistLabel:originalText cannot be modified'),
          text: z
            .string({
              invalid_type_error: 'cover:artistLabel:text must be a string',
              required_error: 'cover:artistLabel:text is required',
            })
            .trim(),
        }),
        albumLabel: z.object({
          originalText: z
            .string({
              invalid_type_error:
                'cover:albumLabel:originalText must be a string',
              required_error: 'cover:albumLabel:originalText is required',
            })
            .refine((text) => {
              return cover.find((c) => c.albumLabel.originalText === text);
            }, 'cover:albumLabel:originalText cannot be modified'),
          text: z
            .string({
              invalid_type_error: 'cover:albumLabel:text must be a string',
              required_error: 'cover:albumLabel:text is required',
            })
            .trim(),
        }),
        dir: z.nativeEnum(PosTypes, {
          errorMap: (_, _ctx) => {
            return {
              message: `cover:dir must be ${Object.values(PosTypes).join(
                ' | ',
              )}`,
            };
          },
        }),
      }),
      {
        invalid_type_error: 'cover must be an array of objects',
        required_error: 'cover is required',
      },
    ),
    lines: z.array(
      z.object({
        id: z
          .string({
            invalid_type_error: 'lines:id must be a string',
            required_error: 'lines:id is required',
          })
          .refine((id) => {
            return lines.find((l) => l.id === id);
          }, 'lines:id cannot be modified'),
        text: z
          .string({
            invalid_type_error: 'lines:label:text must be a string',
            required_error: 'lines:label:text is required',
          })
          .trim(),
        dir: z.nativeEnum(PosTypes, {
          errorMap: (_, _ctx) => {
            return {
              message: `lines:label:dir must be ${Object.values(PosTypes).join(
                ' | ',
              )}`,
            };
          },
        }),
        origin: z.object({
          id: z
            .string({
              invalid_type_error: 'lines:origin:id must be a string',
              required_error: 'lines:origin:id is required',
            })
            .refine((id) => {
              return cover.find((c) => c.id === id);
            }, 'lines:origin:id not found'),
          pos: z.nativeEnum(PosTypes),
        }),
        target: z.object({
          id: z
            .string({
              invalid_type_error: 'lines:target:id must be a string',
              required_error: 'lines:target:id is required',
            })
            .refine((id) => {
              return cover.find((c) => c.id === id);
            }, 'lines:target:id not found'),
          pos: z.nativeEnum(PosTypes, {
            errorMap: (_, _ctx) => {
              return {
                message: `lines:target:dir must be ${Object.values(
                  PosTypes,
                ).join(' | ')}`,
              };
            },
          }),
        }),
      }),
      {
        invalid_type_error: 'lines must be an array of objects',
        required_error: 'lines is required',
      },
    ),
  });
