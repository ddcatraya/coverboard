import { Dialog, DialogTitle, IconButton, DialogContent } from '@mui/material';
import { clearHash } from 'utils';
import { Close as CloseIcon } from '@mui/icons-material';

interface CommonDialogProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
}

export const CommonDialog: React.FC<CommonDialogProps> = ({
  open,
  onClose,
  children,
  title,
}) => {
  return (
    <Dialog
      open={open}
      onClose={() => {
        clearHash();
        onClose();
      }}>
      <DialogTitle>
        {title}
        <IconButton
          aria-label="close"
          color="inherit"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
          }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent
        style={{
          paddingLeft: '30px',
          paddingRight: '30px',
          paddingTop: '5px',
        }}>
        {children}
      </DialogContent>
    </Dialog>
  );
};
