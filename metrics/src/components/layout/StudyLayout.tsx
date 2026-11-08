import { useState } from 'react'
import type { ReactNode } from 'react'
import {
  AppBar,
  Box,
  Chip,
  Divider,
  Drawer,
  IconButton,
  Link,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material'
import DashboardOutlined from '@mui/icons-material/DashboardOutlined'
import TableChartOutlined from '@mui/icons-material/TableChartOutlined'
import MenuBookOutlined from '@mui/icons-material/MenuBookOutlined'
import MenuRounded from '@mui/icons-material/MenuRounded'
import PrintOutlined from '@mui/icons-material/PrintOutlined'
import type { View } from '../../domain/study/types'
import { useStudy } from '../../features/study/useStudy'

const sidebarWidth = 224
const navigation = [
  { view: 'overview', label: 'Overview', icon: DashboardOutlined },
  { view: 'data', label: 'Data', icon: TableChartOutlined },
  { view: 'method', label: 'Methodology', icon: MenuBookOutlined },
] as const

export function StudyLayout({ view, children }: { view: View; children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { dataset } = useStudy()
  const sidebar = (
    <Stack
      sx={{ height: '100%', p: 2.5, pt: 4, bgcolor: 'background.paper', color: 'text.primary' }}
    >
      <Link
        href="#overview"
        underline="none"
        color="inherit"
        sx={{ display: 'flex', gap: 1.5, alignItems: 'center', px: 0.5 }}
        onClick={() => setMobileOpen(false)}
      >
        <Box
          sx={{
            fontFamily: 'Georgia, serif',
            fontSize: 32,
            lineHeight: '42px',
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
            width: 42,
            textAlign: 'center',
            borderRadius: '12px 3px 12px 3px',
            letterSpacing: '-4px',
            pr: '4px',
          }}
        >
          pl
        </Box>
        <Box>
          <Typography sx={{ fontSize: 18, fontWeight: 650, letterSpacing: -0.6 }}>
            prompt / lens
          </Typography>
          <Typography sx={{ fontSize: 7, letterSpacing: '1.8px', color: 'text.secondary' }}>
            RESEARCH WORKSPACE
          </Typography>
        </Box>
      </Link>
      <Typography variant="overline" sx={{ mt: 6, px: 1.5, mb: 1.5, color: 'text.secondary' }}>
        Study 01
      </Typography>
      <List disablePadding>
        {navigation.map((item) => (
          <ListItemButton
            key={item.view}
            component="a"
            href={`#${item.view}`}
            selected={view === item.view}
            aria-current={view === item.view ? 'page' : undefined}
            onClick={() => setMobileOpen(false)}
            sx={{
              borderRadius: 1,
              mb: 0.75,
              color: 'text.secondary',
              '&.Mui-selected': { bgcolor: 'action.selected', color: 'primary.main' },
            }}
          >
            <ListItemIcon sx={{ minWidth: 32, color: 'inherit' }}>
              <item.icon sx={{ fontSize: 19 }} />
            </ListItemIcon>
            <ListItemText primary={item.label} slotProps={{ primary: { sx: { fontSize: 13 } } }} />
            {item.view === 'data' && (
              <Typography variant="caption">{dataset.tasks.length}</Typography>
            )}
          </ListItemButton>
        ))}
      </List>
      <Box sx={{ mx: 1, mt: 5, pt: 2.5, borderTop: 1, borderColor: 'divider' }}>
        <Typography variant="overline" sx={{ color: 'text.secondary', fontSize: 8 }}>
          Research question
        </Typography>
        <Typography sx={{ my: 2, fontSize: 15, lineHeight: 1.85 }}>
          Does changing the prompt language affect code quality?
        </Typography>
        <Stack direction="row" sx={{ gap: 1 }}>
          {['KZ', 'ENG', 'MIX'].map((language) => (
            <Chip key={language} label={language} variant="outlined" sx={{ fontSize: 10 }} />
          ))}
        </Stack>
      </Box>
      <Box sx={{ mt: 'auto', pt: 6, px: 0.5 }}>
        <Typography sx={{ color: 'text.secondary', fontSize: 10 }}>
          ● Research Methods & Tools
        </Typography>
        <Typography sx={{ color: 'text.secondary', fontSize: 9, mt: 0.5 }}>
          LLM coding benchmark · 2026
        </Typography>
      </Box>
    </Stack>
  )

  return (
    <Box sx={{ display: 'flex', minHeight: '100dvh' }}>
      <Box component="a" href="#main" className="skip-link">
        Skip to content
      </Box>
      <Box
        component="nav"
        aria-label="Study sections"
        className="app-sidebar"
        sx={{ width: { md: sidebarWidth }, flexShrink: { md: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { width: sidebarWidth },
          }}
        >
          {sidebar}
        </Drawer>
        <Drawer
          variant="permanent"
          open
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { width: sidebarWidth },
          }}
        >
          {sidebar}
        </Drawer>
      </Box>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <AppBar position="static" color="primary" elevation={1} className="app-topbar">
          <Toolbar sx={{ minHeight: { xs: 64, md: 72 }, px: { xs: 2, md: 4 } }}>
            <IconButton
              color="inherit"
              aria-label="Open navigation"
              onClick={() => setMobileOpen(true)}
              sx={{ mr: 1, display: { md: 'none' } }}
            >
              <MenuRounded />
            </IconButton>
            <Typography variant="caption" color="inherit">
              Workspace{' '}
              <Box component="span" sx={{ mx: 1.5, opacity: 0.65 }}>
                /
              </Box>
              <Box component="span">LLM Benchmark</Box>
            </Typography>
            <Box sx={{ flex: 1 }} />
            <Chip
              label="● Local project"
              variant="outlined"
              sx={{ mr: 2, border: 0, color: 'inherit', display: { xs: 'none', sm: 'flex' } }}
            />
            <Tooltip title="Print / save as PDF">
              <IconButton
                color="inherit"
                aria-label="Print report"
                onClick={() => window.print()}
                size="small"
              >
                <PrintOutlined fontSize="small" />
              </IconButton>
            </Tooltip>
          </Toolbar>
        </AppBar>
        <Box
          component="main"
          id="main"
          sx={{ maxWidth: 1600, mx: 'auto', p: { xs: 2, sm: 3, lg: 4.5 }, pb: 0 }}
        >
          {children}
          <Divider sx={{ mt: 4 }} />
          <Stack
            component="footer"
            direction={{ xs: 'column', sm: 'row' }}
            sx={{ justifyContent: 'space-between', gap: 1, py: 2.5 }}
          >
            <Typography variant="caption" color="text.secondary">
              prompt / lens{' '}
              <Box component="span" sx={{ mx: 1 }}>
                /
              </Box>{' '}
              Research Methods & Tools
            </Typography>
            <Typography variant="caption" color="text.secondary">
              From source tests to verifiable metrics.
            </Typography>
          </Stack>
        </Box>
      </Box>
    </Box>
  )
}
