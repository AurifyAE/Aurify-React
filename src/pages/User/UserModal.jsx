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
    email: "",
    contact: "",
    location: "",
    categoryId: "",
    password: "",
    cashBalance: "",
    goldBalance: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (user) {
      setUserData({
        name: user.name || "",
        email: user.email || "",
        contact: user.contact || "",
        location: user.location || "",
        categoryId: user.categoryId || "",
        password: user.decryptedPassword || "",
        cashBalance: user.cashBalance || "",
        goldBalance: user.goldBalance || "",
      });
    } else {
      setUserData({
        name: "",
        email: "",
        contact: "",
        location: "",
        categoryId: "",
        password: "",
        cashBalance: "",
        goldBalance: "",
      });
    }
    setErrors({});
  }, [user]);

  useEffect(() => {
    const generatePassword = () => {
      const nameParts = userData.name.split(" ").filter(Boolean);
      let nameLetters = "";

      for (let i = 0; i < nameParts.length; i++) {
        nameLetters += nameParts[i].substring(0, 4 - nameLetters.length);
        if (nameLetters.length >= 4) break;
      }

      if (nameLetters.length < 4 && nameParts.length > 1) {
        const middleOrLastName = nameParts[1];
        nameLetters += middleOrLastName.substring(0, 4 - nameLetters.length);
      }

      const contactDigits = userData.contact.slice(-4);
      const password = (nameLetters + contactDigits).replace(/\s+/g, "");

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

      case "email":
        return /\S+@\S+\.\S+/.test(value) ? "" : "Invalid email format";

      case "contact":
        return /^\d+$/.test(value) ? "" : "Contact must contain only numbers";

      case "location":
        return value.trim().length > 0 ? "" : "Location is required";

      case "categoryId":
        return value ? "" : "Category is required";

      case "password":
        return value.length >= 8
          ? ""
          : "Password must be at least 8 characters long";

      case "cashBalance":
        return !isNaN(value) && value !== ""
          ? ""
          : "Cash balance must be a valid number";

      case "goldBalance":
        return !isNaN(value) && value !== ""
          ? ""
          : "Gold balance must be a valid number";

      default:
        return "";
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "contact" && !/^\d*$/.test(value)) {
      return;
    }
    
    // Special handling for balance fields to allow negative numbers
    if ((name === "cashBalance" || name === "goldBalance") && 
        !/^-?\d*\.?\d*$/.test(value)) {
      return;
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
      // Convert balance strings to numbers before submitting
      const processedUserData = {
        ...userData,
        cashBalance: parseFloat(userData.cashBalance) || 0,
        goldBalance: parseFloat(userData.goldBalance) || 0,
      };
      
      onSubmit(processedUserData);
      setUserData({
        name: "",
        email: "",
        contact: "",
        location: "",
        categoryId: "",
        password: "",
        cashBalance: "",
        goldBalance: "",
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
            name="email"
            label="Email"
            type="email"
            fullWidth
            value={userData.email}
            onChange={handleChange}
            required
            error={!!errors.email}
            helperText={errors.email}
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
            name="cashBalance"
            label="Cash Balance"
            type="number"
            fullWidth
            value={userData.cashBalance}
            onChange={handleChange}
            required
            error={!!errors.cashBalance}
            helperText={errors.cashBalance}
            inputProps={{
              step: "any"
            }}
          />
          <TextField
            margin="dense"
            name="goldBalance"
            label="Gold Balance"
            type="number"
            fullWidth
            value={userData.goldBalance}
            onChange={handleChange}
            required
            error={!!errors.goldBalance}
            helperText={errors.goldBalance}
            inputProps={{
              step: "any"
            }}
          />
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