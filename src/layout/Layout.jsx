import { AppBar, Box, Button, Container, CssBaseline, IconButton, ThemeProvider, Toolbar, Typography, createTheme } from '@mui/material'
import { Add as AddIcon, Group as GroupIcon } from '@mui/icons-material'
import { useNavigate, useLocation } from 'react-router-dom'

const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#9c27b0' },
  },
  shape: { borderRadius: 10 },
})

import { Outlet } from 'react-router-dom'

export default function Layout() {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="fixed" color="primary" enableColorOnDark>
        <Toolbar>
          <IconButton color="inherit" edge="start" onClick={() => navigate('/employees')} sx={{ mr: 2 }}>
            <GroupIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Employment Management
          </Typography>
          {location.pathname !== '/employees/new' && (
            <Button color="inherit" startIcon={<AddIcon />} onClick={() => navigate('/employees/new')}>
              New
            </Button>
          )}
        </Toolbar>
      </AppBar>
      <Toolbar />
      <Box component="main" sx={{ py: 3 }}>
        <Container maxWidth="lg"><Outlet /></Container>
      </Box>
    </ThemeProvider>
  )
}
