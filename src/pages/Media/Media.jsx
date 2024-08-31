import React, { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Card, 
  CardContent, 
  TextField, 
  IconButton,
  Box,
  Container
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/system';
import '@fontsource/open-sans'; // Import Open Sans font

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
  const [mediaTitle, setMediaTitle] = useState('');

  return (
    <Box className="bg-gray-100" sx={{ flexGrow: 1, fontFamily: 'Open Sans, sans-serif' }}>
      <AppBar position="static" color="default" elevation={0}>
        <Toolbar className="ml-auto" >
          <Button color="inherit" sx={{ fontFamily: 'Open Sans, sans-serif' }}>Cancel</Button>
          <GradientButton variant="contained" sx={{ ml: 2 }}>
            Post
          </GradientButton>
        </Toolbar>
      </AppBar>

      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <GradientTypography variant="h4" gutterBottom align="center">
          What is your new Media?
        </GradientTypography>
        <Typography variant="body1" color="text.secondary" gutterBottom align="center" sx={{ fontFamily: 'Open Sans, sans-serif' }}>
          Upload your Media.
        </Typography>

        <Card sx={{ mt: 3 }}>
          <CardContent>
            <TextField
              fullWidth
              label="Media Title"
              variant="outlined"
              placeholder="Write the title of this media"
              value={mediaTitle}
              onChange={(e) => setMediaTitle(e.target.value)}
              sx={{ mb: 3, fontFamily: 'Open Sans, sans-serif' }}
              InputLabelProps={{
                style: { fontFamily: 'Open Sans, sans-serif' },
              }}
              InputProps={{
                style: { fontFamily: 'Open Sans, sans-serif' },
              }}
            />

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
              <CloudUploadIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" gutterBottom sx={{ fontFamily: 'Open Sans, sans-serif' }}>
                Upload Media
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom sx={{ fontFamily: 'Open Sans, sans-serif' }}>
                Videos must be less than 30 MB and photos must be less than 2 MB in size.
              </Typography>
              <UploadButton
                variant="contained"
                component="label"
                sx={{ mt: 2 }}
              >
                Upload
                <input
                  type="file"
                  hidden
                  accept="image/*,video/*"
                  multiple
                />
              </UploadButton>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}

export default Media;