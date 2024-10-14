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
    categoryId: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (user) {
      setUserData({
        name: user.name || "",
        contact: user.contact || "",
        location: user.location || "",
        categoryId: user.categoryId || "",
        password: user.decryptedPassword || "",
      });
    } else {
      setUserData({
        name: "",
        contact: "",
        location: "",
        categoryId: "",
        password: "",
      });
    }
    setErrors({});
  }, [user]);

  useEffect(() => {
    const generatePassword = () => {
      const nameParts = userData.name.split(" ").filter(Boolean); // Split name into parts and remove empty spaces
      let nameLetters = "";

      // Collect letters from each name part until we get 4 letters
      for (let i = 0; i < nameParts.length; i++) {
        nameLetters += nameParts[i].substring(0, 4 - nameLetters.length);
        if (nameLetters.length >= 4) break;
      }

      // If the name doesn't have 4 letters, pad with letters from the middle or last name part
      if (nameLetters.length < 4 && nameParts.length > 1) {
        const middleOrLastName = nameParts[1];
        nameLetters += middleOrLastName.substring(0, 4 - nameLetters.length);
      }

      // Get the last 4 digits of the contact number
      const contactDigits = userData.contact.slice(-4);

      // Concatenate the name letters and contact digits for the password
      const password = (nameLetters + contactDigits).replace(/\s+/g, ""); // Remove any spaces

      return password;
    };

    if (userData.name && userData.contact.length >= 4) {
      setUserData((prevData) => ({
        ...prevData,
        password: generatePassword(),
      }));
    }
  }, [userData.name, userData.contact]);

  const validateField = (name, value) => {
    switch (name) {
      case "name":
        return value.trim().length >= 2
          ? ""
          : "Name must be at least 2 characters long";
      case "contact":
        return /^\d+$/.test(value) ? "" : "Contact must contain only numbers";
      case "location":
        return value.trim().length > 0 ? "" : "Location is required";
      case "category":
        return value ? "" : "Category is required";
      case "password":
        return value.length >= 8
          ? ""
          : "Password must be at least 8 characters long";
      default:
        return "";
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "contact" && !/^\d*$/.test(value)) {
      return; // Prevent non-numeric input for contact
    }
    setUserData({ ...userData, [name]: value });
    setErrors({ ...errors, [name]: validateField(name, value) });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    Object.keys(userData).forEach((key) => {
      const error = validateField(key, userData[key]);
      if (error) {
        newErrors[key] = error;
      }
    });

    if (Object.keys(newErrors).length === 0) {
      onSubmit(userData);
      setUserData({
        name: "",
        contact: "",
        location: "",
        categoryId: "",
        password: "",
      });
      setErrors({});
      onClose();
    } else {
      setErrors(newErrors);
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };


  return (
    <Dialog
      open={open}
      onClose={(event, reason) => {
        if (reason !== "backdropClick" && reason !== "escapeKeyDown") {
          onClose();
        }
      }}
      maxWidth="xs"
      fullWidth
      disableEscapeKeyDown
    >
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
            error={!!errors.name}
            helperText={errors.name}
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
            error={!!errors.contact}
            helperText={errors.contact}
            inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
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
            error={!!errors.location}
            helperText={errors.location}
          />
          <TextField
            select
            margin="dense"
            name="categoryId"
            label="Category"
            fullWidth
            value={userData.categoryId}
            onChange={handleChange}
            required
            error={!!errors.categoryId}
            helperText={errors.categoryId}
          >
            {categories.map((category) => (
               <MenuItem key={category._id} value={category._id}>
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
            error={!!errors.password}
            helperText={errors.password}
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
