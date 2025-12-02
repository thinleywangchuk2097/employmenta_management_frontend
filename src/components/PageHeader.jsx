import { Box, Breadcrumbs, Stack, Typography, Link as MLink } from '@mui/material'
import { useNavigate } from 'react-router-dom'

export default function PageHeader({ title, breadcrumb = [], actions = null, mb = 2 }) {
  const navigate = useNavigate()
  return (
    <Box sx={{ mb }}>
      {breadcrumb.length > 0 && (
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 1 }}>
          {breadcrumb.map((item, idx) => (
            item.to ? (
              <MLink key={idx} underline="hover" sx={{ cursor: 'pointer' }} color="inherit" onClick={() => navigate(item.to)}>
                {item.label}
              </MLink>
            ) : (
              <Typography key={idx} color="text.primary">{item.label}</Typography>
            )
          ))}
        </Breadcrumbs>
      )}
      <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ xs: 'flex-start', sm: 'center' }} justifyContent="space-between" spacing={1}>
        <Typography variant="h5" component="h1">{title}</Typography>
        {actions}
      </Stack>
    </Box>
  )
}
