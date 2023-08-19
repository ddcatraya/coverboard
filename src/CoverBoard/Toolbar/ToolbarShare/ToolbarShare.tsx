import { Html } from 'react-konva-utils';

import { useCoverContext, useToastContext, useToolbarContext } from 'contexts';
import { ToolbarSharePopover } from '.';
import { useNavigate } from 'react-router-dom';
import { LocalStorageData, schema } from 'types';
import { ZodError } from 'zod';

export const ToolbarShare: React.FC = () => {
  const navigate = useNavigate();
  const { instance, setInstance, saveId, cover, lines } = useCoverContext();
  const { showSuccessMessage, showErrorMessage } = useToastContext();
  const { openShare, setOpenShare } = useToolbarContext();

  const handleImport = (data: string) => {
    try {
      const parsedData: LocalStorageData = JSON.parse(data);

      try {
        const parsedSchema = schema(cover, lines).parse(parsedData);
        if (parsedSchema) {
          setInstance(parsedSchema);
          setOpenShare(false);
          showSuccessMessage('JSON was applied with success');
        }
      } catch (err) {
        if (err instanceof ZodError) {
          showErrorMessage(JSON.parse(err.message)[0].message);
          return;
        }
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
