import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
  Grid,
  Stack,
  CircularProgress,
} from '@mui/material'
import EmploymentManagementService from '../api/service/EmploymentManagement'
import { Card, CardContent, CardHeader, Snackbar, Alert } from '@mui/material'

const empty = {
  firstName: '',
  middleName: '',
  lastName: '',
  designation: '',
  companyName: '',
  mobileNo: '',
  emailId: '',
}

export default function EditEmployee() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [values, setValues] = useState(empty)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        const data = await EmploymentManagementService.getById(id)
        setValues({
          firstName: data.firstName ?? '',
          middleName: data.middleName ?? '',
          lastName: data.lastName ?? '',
          designation: data.designation ?? '',
          companyName: data.companyName ?? '',
          mobileNo: data.mobileNo ?? '',
          emailId: data.emailId ?? '',
        })
      } catch (e) {
        alert(e?.message || 'Failed to load employee')
        navigate('/employees')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id, navigate])

  const handleChange = (e) => {
    const { name, value } = e.target
    setValues((v) => ({ ...v, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await EmploymentManagementService.update(id, values)
      setSuccess('Employee updated')
      setTimeout(() => navigate('/employees'), 600)
    } catch (e) {
      setError(e?.message || 'Update failed')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" py={6}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Card component="form" onSubmit={handleSubmit}>
        <CardHeader title="Edit Employee" />
        <CardContent>
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
          <Grid item xs={12} sm={6}>
            <TextField label="Designation" name="designation" value={values.designation} onChange={handleChange} fullWidth />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Company Name" name="companyName" value={values.companyName} onChange={handleChange} fullWidth />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Mobile No" name="mobileNo" value={values.mobileNo} onChange={handleChange} fullWidth />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Email" type="email" name="emailId" value={values.emailId} onChange={handleChange} fullWidth />
          </Grid>
        </Grid>

        <Box mt={3} display="flex" gap={2}>
          <Button variant="contained" type="submit" disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
          <Button variant="outlined" onClick={() => navigate('/employees')} disabled={saving}>Cancel</Button>
        </Box>
        </CardContent>
      </Card>
    </Container>
  )
}