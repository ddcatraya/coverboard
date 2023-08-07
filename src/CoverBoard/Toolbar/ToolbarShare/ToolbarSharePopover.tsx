import React, { useState, useMemo } from 'react';
import { Modal, Grid, TextareaAutosize, Button } from '@mui/material';

import { LocalStorageData } from 'types';

interface SaveProps {
  open: boolean;
  onClose: () => void;
  localStorage: LocalStorageData;
  handleImport: (data: string) => void;
  handleCopy: (success: boolean) => void;
}

export const ToolbarSharePopover: React.FC<SaveProps> = ({
  open,
  localStorage,
  onClose,
  handleImport,
  handleCopy,
}) => {
  const [jsonData, setJsonData] = useState(JSON.stringify(localStorage));

  const handleCopyText = () => {
    try {
      navigator.clipboard.writeText(jsonData);
      handleCopy(true);
    } catch (err) {
      handleCopy(false);
    }
  };

  const exportData = () => {
    const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
      jsonData,
    )}`;
    const link = document.createElement('a');
    link.href = jsonString;
    link.download = 'data.json';

    link.click();
  };

  const handTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setJsonData(event.target.value);
  };

  const isValidJSON = useMemo(() => {
    try {
      JSON.parse(jsonData);
      return true;
    } catch (err) {
      return false;
    }
  }, [jsonData]);

  return (
    <Modal open={open} onClose={onClose}>
      <Grid
        container
        spacing={2}
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'white',
          padding: '20px',
          borderRadius: '5px',
          width: '50%',
        }}>
        <Grid item xs={12}>
          <TextareaAutosize
            defaultValue={jsonData}
            minRows={2}
            maxRows={20}
            style={{ resize: 'none', width: '95%' }}
            onChange={handTextChange}
          />
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleCopyText}
            style={{ marginRight: '10px' }}
            disabled={!isValidJSON}>
            Copy JSON
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={exportData}
            style={{ marginRight: '10px' }}
            disabled={!isValidJSON}>
            Download JSON
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleImport(jsonData)}
            disabled={!isValidJSON}>
            Apply JSON
          </Button>
        </Grid>
      </Grid>
    </Modal>
  );
};

/*
const handleCopyText = () => {
    const encoded = window.btoa(params);

    const getBaseURL = () => {
      const protocol = window.location.protocol;
      const hostname = window.location.hostname;
      const port = window.location.port;
      return `${protocol}//${hostname}${port ? ':' + port : ''}/coverboard/`;
    };

    navigator.clipboard.writeText(getBaseURL() + '?share=' + encoded);
  };
*/
