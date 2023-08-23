import React, { useState, useMemo, useEffect } from 'react';
import {
  Grid,
  TextareaAutosize,
  Button,
  Chip,
  Typography,
  TextField,
  Divider,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

import { LocalStorageData, ToolConfigIDs, DEFAULT_KEY } from 'types';
import { NavigateFunction } from 'react-router-dom';
import { addPrefix, clearHash, haxPrefix, removePrefix, setHash } from 'utils';
import { CommonDialog } from 'components';

interface SaveProps {
  open: boolean;
  onClose: () => void;
  instance: LocalStorageData;
  handleImport: (data: string) => void;
  handleCopy: (success: boolean) => void;
  navigate: NavigateFunction;
  saveId: string;
  handleDeleteElements: () => void;
}

export const ToolbarSharePopover: React.FC<SaveProps> = ({
  open,
  instance,
  onClose,
  handleImport,
  handleCopy,
  navigate,
  saveId,
  handleDeleteElements,
}) => {
  const [jsonData, setJsonData] = useState(JSON.stringify(instance, null, 4));
  const [storage, setStorage] = useState(window.localStorage);
  const [newSave, setNewSave] = useState('');

  setHash(ToolConfigIDs.SHARE);

  useEffect(() => {
    setJsonData(JSON.stringify(instance, null, 4));
  }, [instance]);

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
    ...Object.keys(storage).filter(
      (key) => key !== addPrefix(DEFAULT_KEY) && haxPrefix(key),
    ),
  ];

  const hasDefault = window.localStorage.getItem(addPrefix(DEFAULT_KEY));

  const handleClose = () => {
    clearHash();
    onClose();
  };

  const handleCreateNewSave = () => {
    const value = newSave.trim();

    if (value) {
      navigate(`/${newSave}`);
      setNewSave('');
      handleClose();
    }
  };

  return (
    <CommonDialog onClose={onClose} open={open} title="Share options">
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography gutterBottom>Pick a page:</Typography>
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {keyList.map((currentSaveWithPrefix) => {
              const currentSave = removePrefix(currentSaveWithPrefix);
              const showDelete =
                currentSave !== DEFAULT_KEY ||
                (currentSave === DEFAULT_KEY &&
                  currentSave === saveId &&
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

                          if (
                            saveId === DEFAULT_KEY &&
                            currentSave === saveId
                          ) {
                            handleDeleteElements();
                            handleClose();
                            return;
                          }

                          window.localStorage.removeItem(
                            addPrefix(currentSave),
                          );
                          setStorage((prevStorage) => {
                            const prevStorageCopy = { ...prevStorage };
                            delete prevStorageCopy[addPrefix(currentSave)];

                            return prevStorageCopy;
                          });

                          if (saveId === currentSave) {
                            navigate(`/${DEFAULT_KEY}#${ToolConfigIDs.SHARE}`);
                          }
                        }
                      : undefined
                  }
                  deleteIcon={
                    showDelete ? (
                      <div style={{ display: 'flex' }} title="delete page">
                        <CloseIcon />
                      </div>
                    ) : undefined
                  }
                  style={{
                    marginRight: '4px',
                    marginBottom: '8px',
                    width: '32%',
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}
                />
              );
            })}
          </div>
        </Grid>
        <Grid item xs={12}>
          <form
            onSubmit={(evt) => {
              evt.preventDefault();
              handleCreateNewSave();
            }}>
            <div style={{ display: 'flex', verticalAlign: 'middle' }}>
              <TextField
                label="Add new page"
                onChange={(evt) => setNewSave(evt.target.value.trim())}
                size="small"
                value={newSave}
                style={{ marginRight: '10px' }}
              />
              <Button
                variant="contained"
                color="primary"
                disabled={!newSave}
                onClick={handleCreateNewSave}
                style={{ marginRight: '20px', marginBottom: '20px' }}>
                Create
              </Button>
            </div>
          </form>
          <Divider />
        </Grid>

        <Grid item xs={12}>
          <Typography gutterBottom>JSON for: {saveId}</Typography>
          <TextareaAutosize
            value={jsonData}
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
            onClick={() => handleImport(jsonData)}
            disabled={!isValidJSON}
            style={{ marginRight: '20px', marginBottom: '20px' }}>
            Apply
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleCopyText}
            style={{ marginRight: '20px', marginBottom: '20px' }}
            disabled={!isValidJSON}>
            Copy
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={exportData}
            style={{ marginRight: '20px', marginBottom: '20px' }}
            disabled={!isValidJSON}>
            Download
          </Button>
          <Button
            variant="contained"
            color="primary"
            disabled={JSON.stringify(instance, null, 4) === jsonData}
            onClick={() => {
              setJsonData(JSON.stringify(instance, null, 4));
            }}
            style={{ marginRight: '20px', marginBottom: '20px' }}>
            Reset
          </Button>
        </Grid>
      </Grid>
    </CommonDialog>
  );
};
