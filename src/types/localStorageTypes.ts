import { BackColors, Colors, Media, ToolbarConfigParams } from './configTypes';
import { Covers, LabelType } from './coverTypes';
import { Lines } from './lineTypes';
import { z } from 'zod';
import { PosTypes } from './generalTypes';
import { validate } from 'uuid';

export enum LocalStorageKeys {
  COVER = 'covers',
  LINES = 'lines',
  CONFIG = 'configs',
}

export interface LocalStorageData {
  [LocalStorageKeys.CONFIG]: ToolbarConfigParams;
  [LocalStorageKeys.COVER]: Array<Covers>;
  [LocalStorageKeys.LINES]: Array<Lines>;
}

export const schema = (parsedData: LocalStorageData) =>
  z.object({
    configs: z.object(
      {
        size: z
          .number({
            invalid_type_error: 'configs:size must be a number',
            required_error: 'configs:size is required',
          })
          .min(50, 'configs:size must be a number higher than 50')
          .max(150, 'configs:size must be a number lower than 150'),
        media: z.nativeEnum(Media, {
          errorMap: (_, _ctx) => {
            return {
              message: `configs:media must be ${Object.values(Media).join(
                ' | ',
              )}`,
            };
          },
        }),
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
        arrowColor: z.nativeEnum(Colors, {
          errorMap: (_, _ctx) => {
            return {
              message: `configs:arrowColor must be ${Object.values(Colors).join(
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
        showTitle: z.boolean({
          invalid_type_error: 'configs:showTitle must be a boolean',
          required_error: 'configs:showTitle is required',
        }),
        showSubtitle: z.boolean({
          invalid_type_error: 'configs:showSubtitle must be a boolean',
          required_error: 'configs:showSubtitle is required',
        }),
        showMainTitle: z.boolean({
          invalid_type_error: 'configs:showMainTitle must be a boolean',
          required_error: 'configs:showMainTitle is required',
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
    covers: z.array(
      z.object({
        id: z
          .string({
            invalid_type_error: 'covers:id must be a string',
            required_error: 'covers:id is required',
          })
          .refine((id) => {
            return validate(id);
          }, 'covers:id has invalid format'),
        link: z
          .string()
          .url() /* .includes('https://lastfm.freetls.fastly.net'), */,
        x: z
          .number({
            invalid_type_error: 'covers:x position must be a number',
            required_error: 'covers:x is required',
          })
          .min(0, 'covers:x position must be positive number'),
        y: z
          .number({
            invalid_type_error: 'covers:y position must be a number',
            required_error: 'covers:y is required',
          })
          .min(0, 'covers:y position must be positive number'),
        [LabelType.TITLE]: z.object({
          search: z.string({
            invalid_type_error: 'covers:search must be a string',
            required_error: 'covers:search is required',
          }),
          text: z
            .string({
              invalid_type_error: 'covers:text must be a string',
              required_error: 'covers:text is required',
            })
            .trim(),
        }),
        [LabelType.SUBTITLE]: z.object({
          search: z.string({
            invalid_type_error: 'covers:search must be a string',
            required_error: 'covers:search is required',
          }),
          text: z
            .string({
              invalid_type_error: 'covers:text must be a string',
              required_error: 'covers:text is required',
            })
            .trim(),
        }),
        dir: z.nativeEnum(PosTypes, {
          errorMap: (_, _ctx) => {
            return {
              message: `covers:dir must be ${Object.values(PosTypes).join(
                ' | ',
              )}`,
            };
          },
        }),
      }),
      {
        invalid_type_error: 'covers must be an array of objects',
        required_error: 'covers is required',
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
            return validate(id);
          }, 'lines:id has invalid format'),
        text: z
          .string({
            invalid_type_error: 'lines:text must be a string',
            required_error: 'lines:text is required',
          })
          .trim(),
        dir: z.nativeEnum(PosTypes, {
          errorMap: (_, _ctx) => {
            return {
              message: `lines:dir must be ${Object.values(PosTypes).join(
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
              return validate(id);
            }, 'lines:origin:id has invalid format')
            .refine((id) => {
              return parsedData.covers.find((star) => star.id === id);
            }, 'lines:origin:id does not exist'),
          dir: z.nativeEnum(PosTypes, {
            errorMap: (_, _ctx) => {
              return {
                message: `lines:origin:dir must be ${Object.values(
                  PosTypes,
                ).join(' | ')}`,
              };
            },
          }),
        }),
        target: z.object({
          id: z
            .string({
              invalid_type_error: 'lines:target:id must be a string',
              required_error: 'lines:target:id is required',
            })
            .refine((id) => {
              return validate(id);
            }, 'lines:target:id has invalid format')
            .refine((id) => {
              return parsedData.covers.find((star) => star.id === id);
            }, 'lines:target:id does not exist'),
          dir: z.nativeEnum(PosTypes, {
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
