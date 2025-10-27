import React from 'react';
import { Dialog, DialogTitle, DialogContent, IconButton, Box, Typography, useTheme } from '@mui/material';
import { Close } from '@mui/icons-material';

function Modal({ isOpen, onClose, title, children }) {
  const theme = useTheme();
  const mode = theme.palette.mode;
  
  return (
    <Dialog 
      open={isOpen} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          background: mode === 'dark' 
            ? 'rgba(30, 41, 59, 0.95)'
            : 'rgba(255, 255, 255, 0.98)',
          backdropFilter: 'blur(20px)'
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        pb: 2,
        borderBottom: '1px solid',
        borderColor: 'divider'
      }}>
        <Typography variant="h6" fontWeight={700}>{title}</Typography>
        <IconButton onClick={onClose} size="small">
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ p: 3 }}>
        {children}
      </DialogContent>
    </Dialog>
  );
}

export default Modal;