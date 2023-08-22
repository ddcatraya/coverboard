import { Html } from 'react-konva-utils';

import { useToastContext } from 'contexts';
import { ToolbarSharePopover } from '.';
import { useNavigate } from 'react-router-dom';
import { LocalStorageData, schema } from 'types';
import { ZodError } from 'zod';
import { useMainStore, useToolbarStore } from 'store';

export const ToolbarShare: React.FC = () => {
  const navigate = useNavigate();
  const saveId = useMainStore((state) => state.saveId);
  const resetStoreValues = useMainStore((state) => state.resetStoreValues);
  const updateStoreValues = useMainStore((state) => state.updateStoreValues);
  const getStoreValues = useMainStore((state) => state.getStoreValues);

  const { showSuccessMessage, showErrorMessage } = useToastContext();
  const openShare = useToolbarStore((state) => state.openShare);
  const setOpenShare = useToolbarStore((state) => state.setOpenShare);

  const handleImport = (data: string) => {
    try {
      const parsedData: LocalStorageData = JSON.parse(data);

      try {
        const parsedSchema = schema(parsedData).parse(parsedData);
        if (parsedSchema) {
          updateStoreValues(parsedSchema);
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

  const handleDeleteElements = () => {
    resetStoreValues();

    showSuccessMessage('All elements on screen were cleaned');
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
        instance={getStoreValues()}
        open={openShare}
        onClose={() => setOpenShare(false)}
        handleImport={handleImport}
        handleCopy={handleCopy}
        navigate={navigate}
        saveId={saveId}
        handleDeleteElements={handleDeleteElements}
      />
    </Html>
  );
};
