import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Avatar,
  Box,
  Breadcrumbs,
  Link as MLink,
  Container,
  TextField,
  Typography,
  Grid,
  Stack,
  InputAdornment,
  Button,
} from '@mui/material'
import EmploymentManagementService from '../api/service/EmploymentManagement'
import { Card, CardContent, CardHeader, Snackbar, Alert } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import { Email as EmailIcon, Phone as PhoneIcon } from '@mui/icons-material'

const initial = {
  firstName: '',
  middleName: '',
  lastName: '',
  designation: '',
  companyName: '',
  mobileNo: '',
  emailId: '',
}

export default function CreateEmployee() {
  const navigate = useNavigate()
  const [values, setValues] = useState(initial)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const initials = useMemo(() => {
    const parts = [values.firstName, values.middleName, values.lastName].filter(Boolean)
    return parts.map(p => p.trim()[0]?.toUpperCase()).join('').slice(0, 2) || 'EM'
  }, [values.firstName, values.middleName, values.lastName])

  const handleChange = (e) => {
    const { name, value } = e.target
    setValues((v) => ({ ...v, [name]: value }))
  }

  const emailError = values.emailId && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.emailId)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (emailError) return setError('Please enter a valid email')
    setSaving(true)
    try {
      await EmploymentManagementService.create(values)
      setSuccess('Employee created')
      setTimeout(() => navigate('/employees'), 600)
    } catch (e) {
      setError(e?.message || 'Create failed')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Stack spacing={2} sx={{ mb: 2 }}>
        <Breadcrumbs aria-label="breadcrumb">
          <MLink underline="hover" sx={{ cursor: 'pointer' }} onClick={() => navigate('/employees')} color="inherit">
            Employees
          </MLink>
          <Typography color="text.primary">Create</Typography>
        </Breadcrumbs>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Avatar sx={{ bgcolor: 'primary.main', width: 48, height: 48 }}>{initials}</Avatar>
          <Typography variant="h5">Create Employee</Typography>
        </Stack>
      </Stack>

      <Card component="form" onSubmit={handleSubmit}>
        <CardHeader titleTypographyProps={{ variant: 'subtitle1', color: 'text.secondary' }} title="Enter details below" />
        <CardContent>
          <Typography variant="subtitle2" gutterBottom>Personal</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField label="First Name" name="firstName" value={values.firstName} onChange={handleChange} fullWidth required />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Middle Name" name="middleName" value={values.middleName} onChange={handleChange} fullWidth />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Last Name" name="lastName" value={values.lastName} onChange={handleChange} fullWidth />
            </Grid>
          </Grid>

          <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>Work</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField label="Designation" name="designation" value={values.designation} onChange={handleChange} fullWidth />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Company Name" name="companyName" value={values.companyName} onChange={handleChange} fullWidth />
            </Grid>
          </Grid>

          <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>Contact</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField label="Mobile No" name="mobileNo" placeholder="e.g. +1 555 0100" value={values.mobileNo} onChange={handleChange} fullWidth InputProps={{ startAdornment: (<InputAdornment position="start"><PhoneIcon fontSize="small" color="action" /></InputAdornment>) }} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Email" type="email" name="emailId" placeholder="name@company.com" value={values.emailId} onChange={handleChange} fullWidth error={!!emailError} helperText={emailError ? 'Invalid email format' : 'We will never share your email.'} InputProps={{ startAdornment: (<InputAdornment position="start"><EmailIcon fontSize="small" color="action" /></InputAdornment>) }} />
            </Grid>
          </Grid>

          <Box mt={3} display="flex" gap={2}>
            <LoadingButton loading={saving} variant="contained" type="submit">
              Save Employee
            </LoadingButton>
            <Button variant="outlined" onClick={() => navigate('/employees')} disabled={saving}>Cancel</Button>
          </Box>
        </CardContent>
      </Card>

      <Snackbar open={!!error} autoHideDuration={3000} onClose={() => setError('')}>
        <Alert onClose={() => setError('')} severity="error" variant="filled">{error}</Alert>
      </Snackbar>
      <Snackbar open={!!success} autoHideDuration={2000} onClose={() => setSuccess('')}>
        <Alert onClose={() => setSuccess('')} severity="success" variant="filled">{success}</Alert>
      </Snackbar>
    </Container>
  )
}