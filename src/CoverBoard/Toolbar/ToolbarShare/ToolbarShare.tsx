import { Html } from 'react-konva-utils';

import { useCoverContext, useToastContext, useToolbarContext } from 'contexts';
import { ToolbarSharePopover } from '.';

export const ToolbarShare: React.FC = () => {
  const { getLocalStorage, setLocalStorage } = useCoverContext();
  const { showSuccessMessage, showErrorMessage } = useToastContext();
  const { openShare, setOpenShare } = useToolbarContext();

  const handleImport = (data: string) => {
    try {
      const parsedData = JSON.parse(data);
      setLocalStorage(parsedData);

      setOpenShare(false);
    } catch (err) {
      showErrorMessage('invalid JSON Data');
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
        localStorage={getLocalStorage()}
        open={openShare}
        onClose={() => setOpenShare(false)}
        handleImport={handleImport}
        handleCopy={handleCopy}
      />
    </Html>
  );
};
