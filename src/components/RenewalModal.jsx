import { Close as CloseIcon, EmailOutlined, PhoneOutlined } from '@mui/icons-material';
import { Box, Button, Dialog, DialogContent, IconButton, Tooltip, Typography } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import React, { useEffect, useState } from 'react';
import expired from '../assets/expired.png';
import logo from '../assets/logo.png';

const theme = createTheme({
  typography: {
    fontFamily: '"Open Sans", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 20,
        },
      },
    },
  },
});

const RenewalModal = ({ open, onClose }) => {
  const [isOpen, setIsOpen] = useState(open);

  useEffect(() => {
    setIsOpen(open);
  }, [open]);

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  const handleContactSupport = () => {
    window.location.href = 'mailto:techsupport@example.com?subject=Service Renewal Request';
  };

  return (
    <ThemeProvider theme={theme}>
      <Dialog 
        open={isOpen} 
        onClose={(event, reason) => {
          if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') {
            handleClose();
          }
        }}
        maxWidth="sm" 
        fullWidth
        disableEscapeKeyDown={true}
      >
        <DialogContent sx={{ position: 'relative', p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
          <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 3, mb: 2 }}>
            <img src={expired} alt="Expired" style={{ width: 80, height: 80, marginBottom: 16 }} />
            <Typography variant="h5" component="p" sx={{ color: 'error.main', fontWeight: 700, textAlign: 'center', mb: 2 }}>
              Your session has expired
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, textAlign: 'center' }}>
            Please contact our technical support for assistance. We're here to help you restore your service.
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 3 }}>
            <Tooltip title="aurifycontact@gmail.com" placement="top">
              <Button 
                onClick={handleContactSupport} 
                variant="contained" 
                startIcon={<EmailOutlined />}
                sx={{ 
                  borderRadius: 20, 
                  textTransform: 'none',
                  '&:hover': {
                    backgroundColor: '#1565c0',
                  }
                }}
              >
                Contact Support
              </Button>
            </Tooltip>
            <Tooltip title="+971 58 502 3411" placement="top">
              <Button 
                onClick={() => window.location.href = 'tel:+971585023411'} 
                variant="outlined" 
                startIcon={<PhoneOutlined />}
                sx={{ 
                  borderRadius: 20, 
                  textTransform: 'none',
                  '&:hover': {
                    backgroundColor: '#e3f2fd',
                  }
                }}
              >
                Call Support
              </Button>
            </Tooltip>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 'auto' }}>
            <img src={logo} alt="Aurify Logo" style={{ width: 40, height: 40, marginRight: 8 }} />
            <Typography variant="h6" component="span">
              Aurify
            </Typography>
          </Box>
        </DialogContent>
      </Dialog>
    </ThemeProvider>
  );
};

export default RenewalModal;