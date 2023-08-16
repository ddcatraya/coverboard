import React, { useState, useMemo } from 'react';
import { Modal, Grid, TextareaAutosize, Button, Chip } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

import { LocalStorageData, ToolConfigIDs } from 'types';
import { NavigateFunction } from 'react-router-dom';

interface SaveProps {
  open: boolean;
  onClose: () => void;
  instance: LocalStorageData;
  handleImport: (data: string) => void;
  handleCopy: (success: boolean) => void;
  navigate: NavigateFunction;
  saveId: string;
}

export const ToolbarSharePopover: React.FC<SaveProps> = ({
  open,
  instance,
  onClose,
  handleImport,
  handleCopy,
  navigate,
  saveId,
}) => {
  const [jsonData, setJsonData] = useState(JSON.stringify(instance));
  const [storage, setStorage] = useState(window.localStorage);

  window.location.hash = ToolConfigIDs.SHARE;

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
    <Modal
      open={open}
      onClose={() => {
        window.location.hash = '';
        onClose();
      }}>
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
          {Object.keys(storage).map((currentSave) => (
            <Chip
              href={`/coverboard/${currentSave}#${ToolConfigIDs.SHARE}`}
              component="a"
              key={currentSave}
              label={currentSave}
              color={saveId === currentSave ? 'primary' : 'default'}
              onDelete={
                saveId !== currentSave
                  ? () => {
                      window.localStorage.removeItem(currentSave);
                      setStorage((prevStorage) => {
                        const { currentSave, ...restStorage } = prevStorage;

                        return restStorage;
                      });
                    }
                  : undefined
              }
              deleteIcon={saveId !== currentSave ? <CloseIcon /> : undefined}
              style={{ margin: '4px' }}
            />
          ))}
        </Grid>
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
