import React, { useState, useMemo } from 'react';
import {
  Modal,
  Grid,
  TextareaAutosize,
  Button,
  Chip,
  Typography,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

import { LocalStorageData, ToolConfigIDs } from 'types';
import { NavigateFunction } from 'react-router-dom';
import { clearHash, setHash } from 'utils';
import { DEFAULT_KEY } from 'contexts/CoverContext/CoverContext';

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
  const [jsonData, setJsonData] = useState(JSON.stringify(instance, null, 4));
  const [storage, setStorage] = useState(window.localStorage);

  setHash(ToolConfigIDs.SHARE);

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
    link.download = `${saveId}.json`;

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

  const keyList = [
    DEFAULT_KEY,
    ...Object.keys(storage).filter((key) => key !== DEFAULT_KEY),
  ];

  const hasDefault = window.localStorage.getItem(DEFAULT_KEY);

  return (
    <Modal
      open={open}
      onClose={() => {
        clearHash();
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
          <Typography variant="h4" component="h4">
            Share options
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography gutterBottom>
            Pick a saved state (change URL for new one):
          </Typography>
          {keyList.map((currentSave) => {
            const showDelete =
              currentSave !== DEFAULT_KEY ||
              (currentSave === DEFAULT_KEY &&
                currentSave !== saveId &&
                hasDefault);
            return (
              <Chip
                key={currentSave}
                label={currentSave}
                color={saveId === currentSave ? 'primary' : 'default'}
                onClick={() => {
                  navigate(`/${currentSave}#${ToolConfigIDs.SHARE}`);
                }}
                onDelete={
                  showDelete
                    ? (evt) => {
                        evt.preventDefault();

                        window.localStorage.removeItem(currentSave);
                        setStorage((prevStorage) => {
                          const prevStorageCopy = { ...prevStorage };
                          delete prevStorageCopy[currentSave];

                          return prevStorageCopy;
                        });

                        if (saveId === currentSave) {
                          navigate(`/${DEFAULT_KEY}#${ToolConfigIDs.SHARE}`);
                        }
                      }
                    : undefined
                }
                deleteIcon={showDelete ? <CloseIcon /> : undefined}
                style={{ margin: '4px' }}
              />
            );
          })}
        </Grid>
        <Grid item xs={12}>
          <Typography gutterBottom>JSON for: {saveId}</Typography>
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
            disabled={!isValidJSON}
            style={{ marginRight: '10px' }}>
            Apply JSON
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              setJsonData(JSON.stringify(instance, null, 4));
            }}>
            Reset
          </Button>
        </Grid>
      </Grid>
    </Modal>
  );
};
