import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Button,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Stack,
  CircularProgress,
  TextField,
  Tooltip,
  TablePagination,
  Skeleton,
} from '@mui/material'
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon, Search as SearchIcon } from '@mui/icons-material'
import EmploymentManagementService from '../api/service/EmploymentManagement'

export default function IndexEmployee() {
  const navigate = useNavigate()
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return rows
    return rows.filter((r) =>
      [r.firstName, r.middleName, r.lastName, r.companyName, r.designation, r.emailId, r.mobileNo]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q))
    )
  }, [rows, query])

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await EmploymentManagementService.list()
      setRows(Array.isArray(data) ? data : data?.content ?? [])
    } catch (e) {
      setError(e?.message || 'Failed to load employees')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const onDelete = async (id) => {
    if (!confirm('Delete this employee?')) return
    try {
      await EmploymentManagementService.remove(id)
      await load()
    } catch (e) {
      alert(e?.message || 'Delete failed')
    }
  }

  const handleChangePage = (_e, newPage) => setPage(newPage)
  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10))
    setPage(0)
  }

  const paged = useMemo(() => {
    const start = page * rowsPerPage
    return filtered.slice(start, start + rowsPerPage)
  }, [filtered, page, rowsPerPage])

  return (
    <Box sx={{ py: 2 }}>
      <Paper sx={{ p: 2, mb: 2 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ xs: 'stretch', sm: 'center' }} justifyContent="space-between">
          <Typography variant="h6">Employees</Typography>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ width: { xs: '100%', sm: 400 } }}>
            <SearchIcon color="action" />
            <TextField size="small" fullWidth placeholder="Search name, email, company..." value={query} onChange={(e) => setQuery(e.target.value)} />
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate('/employees/new')}>
              New
            </Button>
          </Stack>
        </Stack>
      </Paper>

      {loading ? (
        <Paper sx={{ p: 2 }}>
          <Skeleton height={40} />
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} height={32} />
          ))}
        </Paper>
      ) : error ? (
        <Paper sx={{ p: 2, color: 'error.main' }}>{error}</Paper>
      ) : (
        <Paper>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>First Name</TableCell>
                  <TableCell>Middle Name</TableCell>
                  <TableCell>Last Name</TableCell>
                  <TableCell>Designation</TableCell>
                  <TableCell>Company</TableCell>
                  <TableCell>Mobile</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paged.map((r) => (
                  <TableRow key={r.id} hover>
                    <TableCell>{r.id}</TableCell>
                    <TableCell>{r.firstName}</TableCell>
                    <TableCell>{r.middleName}</TableCell>
                    <TableCell>{r.lastName}</TableCell>
                    <TableCell>{r.designation}</TableCell>
                    <TableCell>{r.companyName}</TableCell>
                    <TableCell>{r.mobileNo}</TableCell>
                    <TableCell>{r.emailId}</TableCell>
                    <TableCell align="right">
                      <Tooltip title="Edit">
                        <IconButton color="primary" onClick={() => navigate(`/employees/${r.id}/edit`)}>
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton color="error" onClick={() => onDelete(r.id)}>
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={9} align="center">
                      No employees match your search.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={filtered.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
          />
        </Paper>
      )}
    </Box>
  )
}