import { Html } from 'react-konva-utils';

import { useCoverContext, useToastContext, useToolbarContext } from 'contexts';
import { ToolbarSharePopover } from '.';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import {
  BackColors,
  Colors,
  CoverImage,
  LocalStorageData,
  PosTypes,
} from 'types';
import { useCallback } from 'react';

const schema = (cover: CoverImage[]) =>
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

export const ToolbarShare: React.FC = () => {
  const navigate = useNavigate();
  const { instance, setInstance, saveId, cover } = useCoverContext();
  const { showSuccessMessage, showErrorMessage } = useToastContext();
  const { openShare, setOpenShare } = useToolbarContext();

  const handleImport = (data: string) => {
    try {
      const parsedData: LocalStorageData = JSON.parse(data);

      try {
        if (schema(cover).parse(parsedData)) {
          setInstance(parsedData);
          setOpenShare(false);
          showSuccessMessage('JSON was applied with success');
        }
      } catch (err) {
        showErrorMessage('JSON validation data is not valid');
      }
    } catch (err) {
      showErrorMessage('JSON is not valid');
    }
  };

  const handleCopy = (success: boolean) => {
    success
      ? showSuccessMessage('Text copied with success')
      : showErrorMessage('Error copying text');
  };

  if (!openShare) return null;

  return (
    <Html>
      <ToolbarSharePopover
        instance={instance}
        open={openShare}
        onClose={() => setOpenShare(false)}
        handleImport={handleImport}
        handleCopy={handleCopy}
        navigate={navigate}
        saveId={saveId}
      />
    </Html>
  );
};
