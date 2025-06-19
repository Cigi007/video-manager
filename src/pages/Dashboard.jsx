import {
  Box,
  Grid,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  InputAdornment,
  IconButton,
} from '@mui/material';
import {
  VideoLibrary as VideoIcon,
  Storage as StorageIcon,
  Visibility as ViewIcon,
  TrendingUp as TrendingIcon,
  Warning as WarningIcon,
  ArrowUpward,
  ArrowDownward,
  Search as SearchIcon,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import { useState } from 'react';

function StatCard({ title, value, icon, color }) {
  return (
    <Paper sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Box
          sx={{
            // backgroundColor: `${color}.light`,
            // borderRadius: '50%',
            p: 1,
            mr: 2,
          }}
        >
          {icon}
        </Box>
        <Typography variant="h6" color="text.secondary">
          {title}
        </Typography>
      </Box>
      <Typography variant="h4">{value}</Typography>
    </Paper>
  );
}

function ActivityItem({ icon, title, time, color }) {
  return (
    <ListItem>
      <ListItemIcon sx={{ color: `${color}.main` }}>{icon}</ListItemIcon>
      <ListItemText
        primary={title}
        secondary={time}
        primaryTypographyProps={{ variant: 'body1' }}
        secondaryTypographyProps={{ variant: 'caption' }}
      />
    </ListItem>
  );
}

function Trend({ value }) {
  if (value > 0) {
    return (
      <Box component="span" color="success.main" sx={{ display: 'inline-flex', alignItems: 'center' }}>
        <ArrowUpward fontSize="small" />
        {value}%
      </Box>
    );
  } else if (value < 0) {
    return (
      <Box component="span" color="error.main" sx={{ display: 'inline-flex', alignItems: 'center' }}>
        <ArrowDownward fontSize="small" />
        {Math.abs(value)}%
      </Box>
    );
  } else {
    return <span>0%</span>;
  }
}

function Dashboard() {
  // Výchozí časový rámec
  const [dateFrom, setDateFrom] = useState(dayjs().subtract(7, 'day'));
  const [dateTo, setDateTo] = useState(dayjs());

  // Výpočet trendu v %
  const getTrend = (current, prev) => {
    if (prev === 0) return current === 0 ? 0 : 100;
    return Math.round(((current - prev) / prev) * 100);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      <Grid container spacing={3}>
        {/* Metriky (budou načteny z backendu) */}
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Celkem videí"
            value="--"
            icon={<VideoIcon sx={{ color: 'primary.main' }} />}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Využito úložiště"
            value="--"
            icon={<StorageIcon sx={{ color: 'warning.main' }} />}
            color="warning"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Celkem zobrazení"
            value="--"
            icon={<ViewIcon sx={{ color: 'success.main' }} />}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Růst prokliků"
            value="--"
            icon={<TrendingIcon sx={{ color: 'info.main' }} />}
            color="info"
          />
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Využití úložiště
            </Typography>
            <Box sx={{ mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                -- GB z -- GB
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={0}
              sx={{ height: 10, borderRadius: 5 }}
            />
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Statistiky videí
            </Typography>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
                <Grid item>
                  <DatePicker
                    label="Od"
                    value={dateFrom}
                    onChange={setDateFrom}
                    format="DD.MM.YYYY"
                    slotProps={{ textField: { size: 'small' } }}
                  />
                </Grid>
                <Grid item>
                  <DatePicker
                    label="Do"
                    value={dateTo}
                    onChange={setDateTo}
                    format="DD.MM.YYYY"
                    slotProps={{ textField: { size: 'small' } }}
                  />
                </Grid>
                <Grid item xs>
                  <TextField
                    label="Hledat video"
                    variant="outlined"
                    fullWidth
                    size="small"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </Grid>
            </LocalizationProvider>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Název Videa</TableCell>
                    <TableCell align="right">Zobrazení</TableCell>
                    <TableCell align="right">Prokliky</TableCell>
                    <TableCell align="right">Nákupy</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell colSpan={4} sx={{ textAlign: 'center', py: 3 }}>
                      Žádná data k zobrazení.
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Dashboard; 