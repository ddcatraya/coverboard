import { Html } from 'react-konva-utils';

import { useCoverContext, useToastContext, useToolbarContext } from 'contexts';
import { ToolbarSharePopover } from '.';
import { useNavigate } from 'react-router-dom';

export const ToolbarShare: React.FC = () => {
  const navigate = useNavigate();
  const { instance, setInstance, saveId } = useCoverContext();
  const { showSuccessMessage, showErrorMessage } = useToastContext();
  const { openShare, setOpenShare } = useToolbarContext();

  const handleImport = (data: string) => {
    try {
      const parsedData = JSON.parse(data);
      setInstance(parsedData);

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
