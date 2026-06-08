import React, { useState, useEffect } from 'react';
import axiosInstance from '../../axios/axiosInstance';
import { 
  Typography, 
  Button, 
  Card, 
  CardContent, 
  TextField, 
  Box,
  Container,
  CircularProgress,
  Grid,
  Stack
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/system';
import '@fontsource/open-sans';

const GradientButton = styled(Button)({
  background: 'linear-gradient(310deg, #7928CA 0%, #FF0080 100%)',
  color: 'white',
  '&:hover': {
    background: 'linear-gradient(310deg, #7928CA 0%, #FF0080 100%)',
    opacity: 0.9,
  },
  fontFamily: 'Open Sans, sans-serif',
});

const GradientTypography = styled(Typography)({
  background: 'linear-gradient(310deg, #7928CA 0%, #FF0080 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  fontFamily: 'Open Sans, sans-serif',
});

const UploadButton = styled(Button)({
  background: 'linear-gradient(310deg, #7928CA 0%, #FF0080 100%)',
  color: 'white',
  '&:hover': {
    background: 'linear-gradient(310deg, #7928CA 0%, #FF0080 100%)',
    opacity: 0.9,
  },
  fontFamily: 'Open Sans, sans-serif',
});

const Media = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  const [userID, setUserID] = useState(null);
  const [error, setError] = useState(null);
  const [existingImage, setExistingImage] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const userName = localStorage.getItem('userName');
      
      if (!userName) {
        setError('User not logged in');
        return;
      }
  
      try {
        const response = await axiosInstance.get(`/data/${userName}`);
        setUserID(response.data.data._id);

        const mediaResponse = await axiosInstance.get(`/backgrounds/${response.data.data._id}`);
        if (mediaResponse.data.data && mediaResponse.data.data.filename) {
          setExistingImage(`${mediaResponse.data.data.url}`);
        }
      } catch (err) {
        setError('Failed to fetch user data: ' + err.message);
      }
    };
  
    fetchUserData();
  }, []);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile && selectedFile.type.startsWith('image/')) {
      setFile(selectedFile);
      setExistingImage(URL.createObjectURL(selectedFile));
    } else {
      setUploadStatus('Please select a valid image file.');
      event.target.value = null;
    }
  };

  const handleUpload = async () => {
    if (!file && !existingImage) {
      setUploadStatus('Please select a file.');
      return;
    }

    if (!userID) {
      setUploadStatus('User ID not available. Please try again.');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    if (file) {
      formData.append('image', file);
    }

    try {
      const response = await axiosInstance.post(`/upload/${userID}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setUploadStatus(`File uploaded successfully!`);
      // setExistingImage(`${response.data.data.filename}`);
      setFile(null);
    } catch (error) {
      console.error('Upload error:', error);
      setUploadStatus(`Upload failed: ${error.response?.data?.message || error.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
<Box
  sx={{
    minHeight: "100vh",
    background: "#F4F7FB",
    py: 6,
    fontFamily: "Open Sans, sans-serif",
  }}
>
  <Container maxWidth="md">
    {/* HEADER */}
    <Box textAlign="center" mb={4}>
      <Typography
        sx={{
          fontSize: "36px",
          fontWeight: 700,
          color: "#0F172A",
          mb: 1,
        }}
      >
        {existingImage ? "Update Background" : "Upload Background"}
      </Typography>

      <Typography
        sx={{
          color: "#64748B",
          fontSize: "15px",
        }}
      >
        Manage your screen background image.
      </Typography>
    </Box>

    {/* CARD */}
    <Card
      sx={{
        borderRadius: "28px",
        border: "1px solid #E6EDF5",
        boxShadow: "0 10px 30px rgba(15,23,42,0.04)",
      }}
    >
      <CardContent sx={{ p: 4 }}>
        <Box
          sx={{
            border: "2px dashed #DCE8FF",
            borderRadius: "24px",
            background: "#F8FBFF",
            p: 5,
            textAlign: "center",
          }}
        >
          {/* IMAGE PREVIEW */}
          {existingImage ? (
            <Box mb={3}>
              <Typography
                sx={{
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#475569",
                  mb: 2,
                }}
              >
                Current Background
              </Typography>

              <Box
                sx={{
                  borderRadius: "18px",
                  overflow: "hidden",
                  border: "1px solid #E6EDF5",
                  maxWidth: 450,
                  mx: "auto",
                }}
              >
                <img
                  src={existingImage}
                  alt="Background"
                  style={{
                    width: "100%",
                    display: "block",
                  }}
                />
              </Box>
            </Box>
          ) : (
            <CloudUploadIcon
              sx={{
                fontSize: 56,
                color: "#2563EB",
                mb: 2,
              }}
            />
          )}

          <Typography
            sx={{
              fontSize: "22px",
              fontWeight: 600,
              color: "#0F172A",
              mb: 1,
            }}
          >
            {existingImage
              ? "Replace Background"
              : "Choose Background"}
          </Typography>

          <Typography
            sx={{
              color: "#64748B",
              fontSize: "14px",
              mb: 4,
            }}
          >
            PNG, JPG or WEBP • Maximum 2 MB
          </Typography>

          {/* ACTIONS */}
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            justifyContent="center"
          >
            <Button
              component="label"
              variant="outlined"
              sx={{
                height: 52,
                px: 4,
                borderRadius: "14px",
                borderColor: "#DCE8FF",
                color: "#2563EB",
                textTransform: "none",
                fontWeight: 600,
              }}
            >
              Select File

              <input
                hidden
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
            </Button>

            <Button
              variant="contained"
              onClick={handleUpload}
              disabled={uploading || (!file && !existingImage)}
              sx={{
                height: 52,
                px: 4,
                borderRadius: "14px",
                background: "#2563EB",
                textTransform: "none",
                fontWeight: 600,
                boxShadow: "none",

                "&:hover": {
                  background: "#1D4ED8",
                  boxShadow: "none",
                },
              }}
            >
              {uploading ? (
                <CircularProgress
                  size={20}
                  color="inherit"
                />
              ) : (
                "Save Background"
              )}
            </Button>
          </Stack>

          {file && (
            <Typography
              sx={{
                mt: 3,
                fontSize: "14px",
                color: "#475569",
              }}
            >
              Selected: {file.name}
            </Typography>
          )}
        </Box>

        {uploadStatus && (
          <Typography
            sx={{
              mt: 3,
              textAlign: "center",
              color: uploadStatus.includes("failed")
                ? "#DC2626"
                : "#16A34A",
            }}
          >
            {uploadStatus}
          </Typography>
        )}

        {error && (
          <Typography
            sx={{
              mt: 2,
              textAlign: "center",
              color: "#DC2626",
            }}
          >
            {error}
          </Typography>
        )}
      </CardContent>
    </Card>
  </Container>
</Box>
  );
}

export default Media;