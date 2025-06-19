import { Box, Button, Typography, Paper } from '@mui/material';
import { useAuth0 } from '@auth0/auth0-react';

function Login() {
  const { loginWithRedirect } = useAuth0();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: '#f5f5f5',
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          width: '100%',
          maxWidth: 400,
          textAlign: 'center',
          borderRadius: 2,
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom fontWeight={600}>
          Welcome Back
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Please sign in to continue
        </Typography>
        <Button
          variant="contained"
          size="large"
          fullWidth
          onClick={() => loginWithRedirect()}
          sx={{ py: 1.5 }}
        >
          Sign In
        </Button>
      </Paper>
    </Box>
  );
}

export default Login; 