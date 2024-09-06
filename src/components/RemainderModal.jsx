import { Close as CloseIcon, EmailOutlined, PhoneOutlined } from '@mui/icons-material';
import { Box, Button, Dialog, DialogContent, IconButton, Tooltip, Typography } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import React from 'react';
import alarm from '../assets/alarm.png';
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

const ReminderModal = ({ open, onClose, message }) => {
  const handleContactSupport = () => {
    window.location.href = 'mailto:techsupport@example.com?subject=Service Expiry Reminder';
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
        maxWidth="xs" 
        fullWidth
        disableEscapeKeyDown={true}
      >
        <DialogContent sx={{ position: 'relative', p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: '#f5f5f5' }}>
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              position: 'absolute',
              right: 4,
              top: 4,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
          <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 1, mb: 1 }}>
          <img src={alarm} alt="Alarm" style={{ width: 60, height: 60, marginBottom: 8 }} />
            <Typography variant="h6" component="p" sx={{ color: '#ff9800', fontWeight: 700, textAlign: 'center', mb: 1 }}>
              Reminder: Service Expiry Approaching
            </Typography>
            <Typography variant="body2" sx={{ mb: 2, textAlign: 'center', color: '#616161' }}>
              {message}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 2 }}>
            <Tooltip title="aurifycontact@gmail.com" placement="top">
              <Button 
                onClick={handleContactSupport} 
                variant="contained" 
                startIcon={<EmailOutlined />}
                size="small"
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
                size="small"
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
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img src={logo} alt="Aurify Logo" style={{ width: 30, height: 30, marginRight: 4 }} />
            <Typography variant="subtitle1" component="span">
              Aurify
            </Typography>
          </Box>
        </DialogContent>
      </Dialog>
    </ThemeProvider>
  );
};

export default ReminderModal;