import { AppBar, Avatar, Box, Button, Container, CssBaseline, Divider, Drawer, IconButton, List, ListItemButton, ListItemIcon, ListItemText, Menu, MenuItem, ThemeProvider, Toolbar, Tooltip, Typography, createTheme, useMediaQuery } from '@mui/material'
import { Add as AddIcon, Group as GroupIcon, Menu as MenuIcon, Home as HomeIcon, DarkMode as DarkModeIcon, LightMode as LightModeIcon } from '@mui/icons-material'
import { useNavigate, useLocation, Outlet } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'

const drawerWidth = 240

function buildTheme(mode) {
  return createTheme({
    palette: {
      mode,
      primary: { main: mode === 'light' ? '#1976d2' : '#90caf9' },
      secondary: { main: mode === 'light' ? '#9c27b0' : '#ce93d8' },
      background: { default: mode === 'light' ? '#f7f8fa' : '#0b0f14' },
    },
    shape: { borderRadius: 10 },
    components: {
      MuiListItemButton: {
        styleOverrides: { root: { borderRadius: 8, marginInline: 8 } },
      },
    },
  })
}

export default function Layout() {
  const [mode, setMode] = useState('light')
  useEffect(() => {
    const saved = localStorage.getItem('themeMode')
    if (saved === 'light' || saved === 'dark') {
      setMode(saved)
    } else {
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      setMode(prefersDark ? 'dark' : 'light')
    }
  }, [])
  useEffect(() => {
    localStorage.setItem('themeMode', mode)
  }, [mode])

  const theme = useMemo(() => buildTheme(mode), [mode])

  const navigate = useNavigate()
  const location = useLocation()
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'))
  const [mobileOpen, setMobileOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null)
  const user = useMemo(() => ({ name: 'Emma Miller', email: 'emma@example.com' }), [])
  const initials = useMemo(() => user.name.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase(), [user])

  const navItems = useMemo(() => [
    { label: 'Employees', icon: <GroupIcon />, to: '/employees' },
    { label: 'Create Employee', icon: <AddIcon />, to: '/employees/new' },
  ], [])

  const drawer = (
    <Box role="presentation" sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Toolbar sx={{ px: 2 }}>
        <Typography variant="h6" noWrap sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <HomeIcon fontSize="small" /> Employment
        </Typography>
      </Toolbar>
      <Divider />
      <Box sx={{ flex: 1, py: 1 }}>
        <List>
          {navItems.map((item) => {
            const selected = location.pathname === item.to
            return (
              <ListItemButton key={item.to} selected={selected} onClick={() => { navigate(item.to); setMobileOpen(false) }}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            )
          })}
        </List>
      </Box>
      <Divider />
      <Box component="footer" sx={{ p: 2 }}>
        <Typography variant="caption" color="text.secondary">© {new Date().getFullYear()} Employment Management</Typography>
      </Box>
    </Box>
  )

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <AppBar position="fixed" color="primary" sx={{ zIndex: (t) => t.zIndex.drawer + 1 }}>
        <Toolbar>
          {!isMdUp && (
            <IconButton color="inherit" edge="start" onClick={() => setMobileOpen((v) => !v)} sx={{ mr: 2 }}>
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6" sx={{ flexGrow: 1 }}>Employment Management</Typography>
          <IconButton color="inherit" onClick={() => setMode((m) => (m === 'light' ? 'dark' : 'light'))} sx={{ mr: 1 }} aria-label="Toggle theme">
            {mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
          </IconButton>
          {location.pathname !== '/employees/new' && (
            <Button color="inherit" startIcon={<AddIcon />} onClick={() => navigate('/employees/new')}>
              New
            </Button>
          )}
          <Tooltip title={user.name}>
            <IconButton color="inherit" onClick={(e) => setAnchorEl(e.currentTarget)} sx={{ ml: 1 }}>
              <Avatar sx={{ width: 32, height: 32 }}>{initials}</Avatar>
            </IconButton>
          </Tooltip>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <MenuItem onClick={() => { setAnchorEl(null); navigate('/employees') }}>Profile</MenuItem>
            <MenuItem onClick={() => {
              setAnchorEl(null)
              try {
                localStorage.removeItem('token')
                sessionStorage.clear()
              } catch {}
              navigate('/employees')
            }}>Logout</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Box sx={{ display: 'flex' }}>
        {/* Sidebar */}
        {isMdUp ? (
          <Drawer variant="permanent" open sx={{ width: drawerWidth, flexShrink: 0, [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' } }}>
            {drawer}
          </Drawer>
        ) : (
          <Drawer variant="temporary" open={mobileOpen} onClose={() => setMobileOpen(false)} ModalProps={{ keepMounted: true }} sx={{ display: { xs: 'block', md: 'none' }, [`& .MuiDrawer-paper`]: { width: drawerWidth } }}>
            {drawer}
          </Drawer>
        )}

        {/* Main content */}
        <Box component="main" sx={{ flexGrow: 1, minHeight: '100vh', bgcolor: 'background.default' }}>
          <Toolbar />
          <Container maxWidth="lg" sx={{ py: 3 }}>
            <Outlet />
          </Container>
          <Box component="footer" sx={{ mt: 'auto', py: 2, borderTop: '1px solid', borderColor: 'divider', textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">Built with React & Material UI</Typography>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  )
}
