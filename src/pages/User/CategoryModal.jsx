import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";

const CategoryModal = ({ open, onClose, onSubmit, category }) => {
  const [formData, setFormData] = useState({
    name: "",
    sellPremium: 0,
    sellCharge: 0,
    spread: 0,
    buyPremium: 0,
    buyCharge: 0,
  });

  useEffect(() => {
    if (category) {
      setFormData(category);
    } else {
      setFormData({
        name: "",
        sellPremium: 0,
        sellCharge: 0,
        spread: 0,
        buyPremium: 0,
        buyCharge: 0,
      });
    }
  }, [category]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: name === "name" ? value : parseFloat(value),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
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
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Sell Premium"
                name="sellPremium"
                type="number"
                value={formData.sellPremium}
                onChange={handleChange}
                inputProps={{ step: "0.01" }}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Sell Charge"
                name="sellCharge"
                type="number"
                value={formData.sellCharge}
                onChange={handleChange}
                inputProps={{ step: "0.01" }}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Spread"
                name="spread"
                type="number"
                value={formData.spread}
                onChange={handleChange}
                inputProps={{ step: "0.01" }}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Buy Premium"
                name="buyPremium"
                type="number"
                value={formData.buyPremium}
                onChange={handleChange}
                inputProps={{ step: "0.01" }}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Buy Charge"
                name="buyCharge"
                type="number"
                value={formData.buyCharge}
                onChange={handleChange}
                inputProps={{ step: "0.01" }}
                required
              />
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
