import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Modal,
  Backdrop,
  Fade,
} from '@mui/material';

const glassMorphismStyle = {
  background: 'rgba(255, 255, 255, 0.25)',
  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
  backdropFilter: 'blur(4px)',
  WebkitBackdropFilter: 'blur(4px)',
  borderRadius: '10px',
  border: '1px solid rgba(255, 255, 255, 0.18)',
  padding: '20px',
};

const UserEditModal = ({ open, handleClose, user, onSave }) => {
  const [editedUser, setEditedUser] = useState(user);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedUser(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    onSave(editedUser);
    handleClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={open}>
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          ...glassMorphismStyle,
        }}>
          <Typography variant="h6" component="h2" gutterBottom>
            Edit User
          </Typography>
          <TextField
            fullWidth
            label="Name"
            name="name"
            value={editedUser.name}
            onChange={handleChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Phone Number"
            name="phoneNo"
            value={editedUser.phoneNo}
            onChange={handleChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Spread"
            name="spread"
            value={editedUser.spread}
            onChange={handleChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Location"
            name="location"
            value={editedUser.location}
            onChange={handleChange}
            margin="normal"
          />
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={handleClose} sx={{ mr: 1 }}>Cancel</Button>
            <Button onClick={handleSave} variant="contained">Save</Button>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};

export default UserEditModal;
