import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";

const commodities = ["Gold", "Silver", "Copper", "Platinum"];

const initialFormState = {
  name: "",
  commodities: [],
};

const CategoryModal = ({ open, onClose, onSubmit, category }) => {
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (category) {
      setFormData(category);
    } else {
      setFormData(initialFormState);
    }
  }, [category, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  const handleCommodityChange = (commodity) => {
    setFormData((prevData) => ({
      ...prevData,
      commodities: prevData.commodities.includes(commodity)
        ? prevData.commodities.filter((c) => c !== commodity)
        : [...prevData.commodities, commodity],
    }));
    setErrors((prevErrors) => ({ ...prevErrors, commodities: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    if (formData.commodities.length === 0) {
      newErrors.commodities = "At least one commodity must be selected";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
      if (!category) {
        // Reset form only when adding a new category
        setFormData(initialFormState);
        setErrors({});
      }
    }
  };

  return (
    <Dialog
      open={open}
      onClose={(event, reason) => {
        if (reason !== "backdropClick" && reason !== "escapeKeyDown") {
          onClose();
        }
      }}
      maxWidth="sm"
      fullWidth
      disableEscapeKeyDown
    >
      <DialogTitle>{category ? "Edit Category" : "Add Category"}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                error={!!errors.name}
                helperText={errors.name}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Commodities
              </Typography>
              {commodities.map((commodity) => (
                <FormControlLabel
                  key={commodity}
                  control={
                    <Checkbox
                      checked={formData.commodities.includes(commodity)}
                      onChange={() => handleCommodityChange(commodity)}
                      name={commodity}
                    />
                  }
                  label={commodity}
                />
              ))}
              {errors.commodities && (
                <Typography
                  color="error"
                  variant="caption"
                  display="block"
                  gutterBottom
                >
                  {errors.commodities}
                </Typography>
              )}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            {category ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CategoryModal;
