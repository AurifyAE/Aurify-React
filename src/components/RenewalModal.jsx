
import { EmailOutlined, PhoneOutlined } from '@mui/icons-material';
import { Box, Button, Dialog, DialogContent, Tooltip, Typography } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import React from 'react';

const theme = createTheme({
  typography: {
    fontFamily: '"Open Sans", "Helvetica", "Arial", sans-serif',
  },
});

const RenewalModal = ({ open, onClose }) => {
  const handleContactSupport = () => {
    window.location.href = 'mailto:techsupport@example.com?subject=Service Renewal Request';
  };

  return (
    <ThemeProvider theme={theme}>
      <Dialog 
        open={open} 
        onClose={(event, reason) => {
          if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') {
            onClose();
          }
        }}
        maxWidth="sm" 
        fullWidth
        disableEscapeKeyDown={true}
      >
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 3, mb: 2 }}>
            <Typography variant="h5" component="p" sx={{ mb: 2, textAlign: 'center', fontWeight: 600 }}>
              Your session has expired
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, textAlign: 'center' }}>
              Please contact our technical support for assistance. We're here to help you restore your service.
            </Typography>
          </Box>
        </DialogContent>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, pb: 3 }}>
          <Tooltip title="techsupport@example.com" placement="top">
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
      </Dialog>
    </ThemeProvider>
  );
};

export default RenewalModal;
