import React, { useState, useMemo, useEffect } from 'react';
import {
  Dialog,
  Grid,
  TextareaAutosize,
  Button,
  Chip,
  Typography,
  TextField,
  IconButton,
} from '@mui/material';
import {
  Close as CloseIcon,
  KeyboardArrowRightRounded,
} from '@mui/icons-material';

import { LocalStorageData, ToolConfigIDs, DEFAULT_KEY } from 'types';
import { NavigateFunction } from 'react-router-dom';
import { addPrefix, clearHash, haxPrefix, removePrefix, setHash } from 'utils';

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

  const handleCreateNewSave = () => {
    const value = newSave.trim();

    if (value) {
      navigate(`/${newSave}#share`);
      setNewSave('');
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={() => {
        clearHash();
        onClose();
      }}>
      <Grid
        container
        spacing={2}
        style={{
          padding: '20px',
          borderRadius: '5px',
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
          {keyList.map((currentSaveWithPrefix) => {
            const currentSave = removePrefix(currentSaveWithPrefix);
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
                  onClose();
                }}
                onDelete={
                  showDelete
                    ? (evt) => {
                        evt.preventDefault();

                        window.localStorage.removeItem(addPrefix(currentSave));
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
                deleteIcon={showDelete ? <CloseIcon /> : undefined}
                style={{ marginRight: '4px' }}
              />
            );
          })}
        </Grid>
        <Grid item xs={12}>
          <form
            onSubmit={(evt) => {
              evt.preventDefault();
              handleCreateNewSave();
            }}>
            <TextField
              label="Add new page"
              onChange={(evt) => setNewSave(evt.target.value.trim())}
              size="small"
              value={newSave}
              style={{ width: '200px ' }}
              InputProps={{
                endAdornment: (
                  <IconButton>
                    <KeyboardArrowRightRounded onClick={handleCreateNewSave} />
                  </IconButton>
                ),
              }}
            />
          </form>
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
            style={{ marginBottom: '20px' }}>
            Reset
          </Button>
        </Grid>
      </Grid>
    </Dialog>
  );
};
