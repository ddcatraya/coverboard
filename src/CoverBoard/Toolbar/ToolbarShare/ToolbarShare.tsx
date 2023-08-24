import { Html } from 'react-konva-utils';

import { ToolbarSharePopover } from '.';
import { useNavigate } from 'react-router-dom';
import { LocalStorageData, schema } from 'types';
import { ZodError } from 'zod';
import { useMainStore, useToastStore, useToolbarStore } from 'store';
import { shallow } from 'zustand/shallow';

export const ToolbarShare: React.FC = () => {
  const navigate = useNavigate();
  const saveId = useMainStore((state) => state.saveId);
  const resetStoreValues = useMainStore((state) => state.resetStoreValues);
  const updateStoreValues = useMainStore((state) => state.updateStoreValues);
  const getStoreValues = useMainStore((state) => state.getStoreValues);

  const showSuccessMessage = useToastStore((state) => state.showSuccessMessage);
  const showErrorMessage = useToastStore((state) => state.showErrorMessage);
  const [openShare, setOpenShare] = useToolbarStore(
    (state) => [state.openShare, state.setOpenShare],
    shallow,
  );

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
