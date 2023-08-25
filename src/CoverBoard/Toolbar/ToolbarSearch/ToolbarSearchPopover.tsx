import React, { useState } from 'react';
import { TextField, Button, Grid } from '@mui/material';

import { LabelType, ToolConfigIDs, CoverValues } from 'types';
import { clearHash, setHash } from 'utils';
import { CommonDialog } from 'components';
import { flushSync } from 'react-dom';

interface PopupProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (inputArray: Array<CoverValues>) => void;
}

const initialState = () => [
  { [LabelType.TITLE]: '', [LabelType.SUBTITLE]: '' },
  { [LabelType.TITLE]: '', [LabelType.SUBTITLE]: '' },
  { [LabelType.TITLE]: '', [LabelType.SUBTITLE]: '' },
  { [LabelType.TITLE]: '', [LabelType.SUBTITLE]: '' },
  { [LabelType.TITLE]: '', [LabelType.SUBTITLE]: '' },
];

export const ToolbarSearchPopover: React.FC<PopupProps> = ({
  open,
  onClose,
  onSubmit,
}) => {
  const [inputs, setInputs] = useState<Array<CoverValues>>(initialState());
  const [loading, setLoading] = useState(false);

  setHash(ToolConfigIDs.SEARCH);

  const handleInputChange = (
    index: number,
    field: LabelType,
    value: string,
  ) => {
    setInputs((prevInputs) => {
      const updatedInputs = [...prevInputs];
      updatedInputs[index][field] = value;
      return updatedInputs;
    });
  };

  const handleSubmit = async (evt: React.SyntheticEvent<HTMLFormElement>) => {
    evt.preventDefault();

    flushSync(() => {
      setLoading(true);
    });

    try {
      const filterInputs = inputs.filter(
        (input) =>
          input[LabelType.TITLE] !== '' && input[LabelType.SUBTITLE] !== '',
      );
      await onSubmit(filterInputs);
      setInputs(initialState());
      onClose();
    } finally {
      setLoading(false);
      clearHash();
    }
  };

  const isInputDisabled =
    !!inputs.find(
      (input) =>
        (input[LabelType.TITLE] !== '' && input[LabelType.SUBTITLE] === '') ||
        (input[LabelType.TITLE] === '' && input[LabelType.SUBTITLE] !== ''),
    ) ||
    !inputs.some(
      (input) =>
        input[LabelType.TITLE] !== '' && input[LabelType.SUBTITLE] !== '',
    );

  return (
    <CommonDialog open={open} title="Search" onClose={onClose}>
      <form onSubmit={handleSubmit}>
        {inputs.map((input, index) => (
          <Grid
            container
            rowGap={0.5}
            key={`input-${index}`}
            style={{
              marginBottom: '20px',
              backgroundColor: '#F2F4F7',
            }}>
            <Grid item sm={6} xs={12}>
              <TextField
                fullWidth
                label={[LabelType.TITLE]}
                value={input[LabelType.TITLE]}
                onChange={(e) =>
                  handleInputChange(index, LabelType.TITLE, e.target.value)
                }
              />
            </Grid>
            <Grid item sm={6} xs={12}>
              <TextField
                fullWidth
                label={[LabelType.SUBTITLE]}
                value={input[LabelType.SUBTITLE]}
                onChange={(e) =>
                  handleInputChange(index, LabelType.SUBTITLE, e.target.value)
                }
              />
            </Grid>
          </Grid>
        ))}
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            disabled={isInputDisabled || loading}
            type="submit">
            Submit
          </Button>
        </Grid>
      </form>
    </CommonDialog>
  );
};
