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
  Grid
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
        console.log(response.data.data._id);

        const mediaResponse = await axiosInstance.get(`/backgrounds/${response.data.data._id}`);
        console.log(mediaResponse);
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
    <Box className="bg-gray-100" sx={{ flexGrow: 1, fontFamily: 'Open Sans, sans-serif' }}>
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <GradientTypography variant="h4" gutterBottom align="center">
          {existingImage ? 'Update Your Background' : 'Add New Background'}
        </GradientTypography>
        <Typography variant="body1" color="text.secondary" gutterBottom align="center" sx={{ fontFamily: 'Open Sans, sans-serif' }}>
          {existingImage ? 'Update your existing background or upload a new one.' : 'Upload your Background.'}
        </Typography>

        <Card sx={{ mt: 3 }}>
          <CardContent>

            <Box 
              sx={{ 
                border: '2px dashed #ccc', 
                borderRadius: 2, 
                p: 3, 
                textAlign: 'center',
                backgroundColor: '#f9f9f9',
                '&:hover': {
                  backgroundColor: '#f0f0f0',
                },
                fontFamily: 'Open Sans, sans-serif'
              }}
            >
              {existingImage ? (
                <Box sx={{ mb: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Typography variant="h6" gutterBottom sx={{ fontFamily: 'Open Sans, sans-serif' }}>
                    Current Image
                  </Typography>
                  <img src={existingImage} alt="Current media" style={{ maxWidth: '100%', maxHeight: '200px', marginBottom: '16px' }} />
                </Box>
              ) : (
                <CloudUploadIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
              )}
              <Typography variant="h6" gutterBottom sx={{ fontFamily: 'Open Sans, sans-serif' }}>
                {existingImage ? 'Update Background' : 'Upload Background'}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom sx={{ fontFamily: 'Open Sans, sans-serif' }}>
                Images must be less than 2 MB in size.
              </Typography>
              <Grid container spacing={2} justifyContent="center" alignItems="center" sx={{ mt: 2 }}>
                <Grid item>
                  <UploadButton
                    variant="contained"
                    component="label"
                  >
                    {existingImage ? 'Change' : 'Select File'}
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </UploadButton>
                </Grid>
                <Grid item>
                  <GradientButton 
                    variant="contained" 
                    onClick={handleUpload} 
                    disabled={uploading || (!file && !existingImage)}
                  >
                    {uploading ? <CircularProgress size={24} color="inherit" /> : 'Post'}
                  </GradientButton>
                </Grid>
              </Grid>
              {file && (
                <Typography variant="body2" sx={{ mt: 2, fontFamily: 'Open Sans, sans-serif' }}>
                  Selected file: {file.name}
                </Typography>
              )}
            </Box>
            {uploadStatus && (
              <Typography variant="body2" color={uploadStatus.includes('failed') ? 'error' : 'success'} sx={{ mt: 2, textAlign: 'center' }}>
                {uploadStatus}
              </Typography>
            )}
            {error && (
              <Typography variant="body2" color="error" sx={{ mt: 2, textAlign: 'center' }}>
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