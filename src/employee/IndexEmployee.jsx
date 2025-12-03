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
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Chip,
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
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [targetId, setTargetId] = useState(null)

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

  const onDelete = (id) => {
    setTargetId(id)
    setConfirmOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!targetId) return
    try {
      await EmploymentManagementService.remove(targetId)
      setConfirmOpen(false)
      setTargetId(null)
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
      <Paper sx={{ p: 2, mb: 2 }} elevation={0}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ xs: 'stretch', sm: 'center' }} justifyContent="space-between">
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="h6">Employees</Typography>
            {rows?.length ? (
              <Chip size="small" label={`${rows.length}`} color="default" sx={{ ml: 0.5 }} />
            ) : null}
          </Stack>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ width: { xs: '100%', sm: 480 } }}>
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
        <Paper sx={{ overflow: 'hidden' }}>
          <TableContainer sx={{ maxHeight: 560 }}>
            <Table size="small" stickyHeader sx={{
              '& thead th': {
                fontWeight: 600,
                backgroundColor: (theme) => theme.palette.mode === 'light' ? '#f6f7f9' : 'rgba(255,255,255,0.04)',
                color: 'text.primary',
                borderBottom: '1px solid',
                borderColor: 'divider',
                whiteSpace: 'nowrap',
              },
              '& tbody tr:hover': {
                backgroundColor: (theme) => theme.palette.action.hover,
              },
              '& tbody td': {
                borderBottom: '1px solid',
                borderColor: 'divider',
              },
            }}>
              <TableHead>
                <TableRow>
                  <TableCell width={72}>ID</TableCell>
                  <TableCell width={160}>First Name</TableCell>
                  <TableCell width={160}>Middle Name</TableCell>
                  <TableCell width={160}>Last Name</TableCell>
                  <TableCell width={180}>Designation</TableCell>
                  <TableCell width={200}>Company</TableCell>
                  <TableCell width={140}>Mobile</TableCell>
                  <TableCell width={240}>Email</TableCell>
                  <TableCell align="right" width={120}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paged.map((r, idx) => (
                  <TableRow key={r.id} hover sx={{
                    backgroundColor: (theme) => idx % 2 === 1 ? (theme.palette.mode === 'light' ? '#fafafa' : 'rgba(255,255,255,0.02)') : 'inherit',
                  }}>
                    <TableCell>
                      <Typography variant="caption" color="text.secondary">#{r.id}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight={500}>{r.firstName}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{r.middleName || '-'}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{r.lastName}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{r.designation || '-'}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{r.companyName || '-'}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{r.mobileNo || '-'}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" noWrap>{r.emailId || '-'}</Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Edit">
                        <IconButton size="small" color="primary" onClick={() => navigate(`/employees/${r.id}/edit`)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton size="small" color="error" onClick={() => onDelete(r.id)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={9} align="center" sx={{ py: 6 }}>
                      <Typography variant="body2" color="text.secondary">No employees match your search.</Typography>
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
            sx={{ borderTop: '1px solid', borderColor: 'divider' }}
          />
        </Paper>
      )}

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Delete Employee</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this employee? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={handleConfirmDelete}>Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}