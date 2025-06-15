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
            backgroundColor: `${color}.light`,
            borderRadius: '50%',
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
  const stats = [
    {
      title: 'Celkem videí',
      value: '12',
      icon: <VideoIcon sx={{ color: 'primary.main' }} />,
      color: 'primary',
    },
    {
      title: 'Vyčerpáno úložiště',
      value: '45%',
      icon: <StorageIcon sx={{ color: 'warning.main' }} />,
      color: 'warning',
    },
    {
      title: 'Zobrazení',
      value: '1,234',
      icon: <ViewIcon sx={{ color: 'success.main' }} />,
      color: 'success',
    },
    {
      title: 'Růst',
      value: '+15%',
      icon: <TrendingIcon sx={{ color: 'info.main' }} />,
      color: 'info',
    },
  ];

  const activities = [
    {
      icon: <VideoIcon />,
      title: 'Nahráno nové video "Produktové video.mp4"',
      time: 'Před 2 hodinami',
      color: 'primary',
    },
    {
      icon: <WarningIcon />,
      title: 'Varování: Úložiště je téměř plné',
      time: 'Před 5 hodinami',
      color: 'warning',
    },
    {
      icon: <ViewIcon />,
      title: 'Video "Úvodní video.mp4" dosáhlo 100 zobrazení',
      time: 'Před 1 dnem',
      color: 'success',
    },
  ];

  // Výchozí časový rámec
  const [dateFrom, setDateFrom] = useState(dayjs().subtract(7, 'day'));
  const [dateTo, setDateTo] = useState(dayjs());

  // Ukázková data pro videa
  const videoMetrics = [
    {
      id: 1,
      name: 'Úvodní video.mp4',
      views: 1200,
      viewsPrev: 1000,
      clicks: 150,
      clicksPrev: 120,
      purchases: 12,
      purchasesPrev: 10,
    },
    {
      id: 2,
      name: 'Produktové video.mp4',
      views: 950,
      viewsPrev: 1100,
      clicks: 110,
      clicksPrev: 130,
      purchases: 8,
      purchasesPrev: 9,
    },
    {
      id: 3,
      name: 'Promo video.mov',
      views: 600,
      viewsPrev: 500,
      clicks: 80,
      clicksPrev: 60,
      purchases: 5,
      purchasesPrev: 4,
    },
  ];

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
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <StatCard {...stat} />
          </Grid>
        ))}

        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Využití úložiště
            </Typography>
            <Box sx={{ mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                4.5 GB z 10 GB
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={45}
              sx={{ height: 10, borderRadius: 5 }}
            />
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Poslední aktivity
            </Typography>
            <List>
              {activities.map((activity, index) => (
                <Box key={index}>
                  <ActivityItem {...activity} />
                  {index < activities.length - 1 && <Divider />}
                </Box>
              ))}
            </List>
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
              </Grid>
            </LocalizationProvider>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Název videa</TableCell>
                    <TableCell align="right">Zobrazení</TableCell>
                    <TableCell align="right">Trend</TableCell>
                    <TableCell align="right">Prokliky</TableCell>
                    <TableCell align="right">Trend</TableCell>
                    <TableCell align="right">Nákupy</TableCell>
                    <TableCell align="right">Trend</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {videoMetrics.map((video) => (
                    <TableRow key={video.id}>
                      <TableCell>{video.name}</TableCell>
                      <TableCell align="right">{video.views}</TableCell>
                      <TableCell align="right">
                        <Trend value={getTrend(video.views, video.viewsPrev)} />
                      </TableCell>
                      <TableCell align="right">{video.clicks}</TableCell>
                      <TableCell align="right">
                        <Trend value={getTrend(video.clicks, video.clicksPrev)} />
                      </TableCell>
                      <TableCell align="right">{video.purchases}</TableCell>
                      <TableCell align="right">
                        <Trend value={getTrend(video.purchases, video.purchasesPrev)} />
                      </TableCell>
                    </TableRow>
                  ))}
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