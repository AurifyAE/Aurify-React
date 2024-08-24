import React from 'react';
import { Modal, Box, Typography, Button } from '@mui/material';

const RenewalModal = ({ open, onClose }) => {
  const handleContactAdmin = () => {
    window.location.href = 'mailto:superadmin@example.com?subject=Service Renewal Request';
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="renewal-modal-title"
      aria-describedby="renewal-modal-description"
    >
      <Box sx={{ 
        width: 400, 
        margin: 'auto', 
        marginTop: '10%',
        padding: 3, 
        bgcolor: 'background.paper',
        borderRadius: 2,
        boxShadow: 24
      }}>
        <Typography id="renewal-modal-title" variant="h6" component="h2">
          Service Expiration Notice
        </Typography>
        <Typography id="renewal-modal-description" sx={{ mt: 2 }}>
          Your service has expired. Please contact the super admin to renew your service.
        </Typography>
        <Button 
          onClick={handleContactAdmin} 
          variant="contained" 
          sx={{ mt: 2 }}
        >
          Contact Super Admin
        </Button>
      </Box>
    </Modal>
  );
};

export default RenewalModal;
