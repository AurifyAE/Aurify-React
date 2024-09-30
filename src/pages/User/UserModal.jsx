import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  MenuItem,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";

const UserModal = ({ open, onClose, onSubmit, user, categories }) => {
  const [userData, setUserData] = useState({
    name: "",
    contact: "",
    location: "",
    category: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (user) {
      setUserData({
        name: user.name || "",
        contact: user.contact || "",
        location: user.location || "",
        category: user.category || "",
        password: "", // Password field is initially empty
      });
    } else {
      setUserData({
        name: "",
        contact: "",
        location: "",
        category: "",
        password: "",
      });
    }
  }, [user]);

  useEffect(() => {
    // Update password when name or contact changes
    if (userData.name && userData.contact) {
      setUserData((prevData) => ({
        ...prevData,
        password: `${prevData.name}${prevData.contact}`,
      }));
    }
  }, [userData.name, userData.contact]);

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting user data:", userData);
    onSubmit(userData);
    onClose();
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{user ? "Edit User" : "Add User"}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Name"
            type="text"
            fullWidth
            value={userData.name}
            onChange={handleChange}
            required
          />
          <TextField
            margin="dense"
            name="contact"
            label="Contact"
            type="tel"
            fullWidth
            value={userData.contact}
            onChange={handleChange}
            required
          />
          <TextField
            margin="dense"
            name="location"
            label="Location"
            type="text"
            fullWidth
            value={userData.location}
            onChange={handleChange}
            required
          />
          <TextField
            select
            margin="dense"
            name="category"
            label="Category"
            fullWidth
            value={userData.category}
            onChange={handleChange}
            required
          >
            {categories.map((category) => (
              <MenuItem key={category._id} value={category.name}>
                {category.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            margin="dense"
            name="password"
            label="Password"
            type={showPassword ? "text" : "password"}
            fullWidth
            value={userData.password}
            onChange={handleChange}
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit">{user ? "Update" : "Add"}</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default UserModal;
