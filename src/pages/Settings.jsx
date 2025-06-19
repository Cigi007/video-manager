import { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Tabs,
  Tab,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Card,
  CardContent,
  CardActions,
  TextField,
  Grid,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Help as HelpIcon,
  Payment as PaymentIcon,
  Security as SecurityIcon,
  Storage as StorageIcon,
  Speed as SpeedIcon,
  Support as SupportIcon,
} from '@mui/icons-material';
import CodeIcon from '@mui/icons-material/Code';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { styled } from '@mui/material/styles';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
}));

function TabPanel({ children, value, index }) {
  return (
    <div hidden={value !== index} style={{ padding: '24px 0' }}>
      {value === index && children}
    </div>
  );
}

function Settings() {
  const [tabValue, setTabValue] = useState(0);
  const [helpDetail, setHelpDetail] = useState(null);
  const gtmSnippet = `<!-- Gander snippet by google tag manager starts -->\n<link href=\"https://widget.video.com/static/css/index.css\" rel=\"stylesheet\">\n<script src=\"https://widget.video.com/static/js/index.js\"></script>\n<!-- Gander snippet by google tag manager ends -->`;
  const [copied, setCopied] = useState(false);
  const [accountData, setAccountData] = useState({
    firstName: '',
    lastName: '',
    role: '',
    email: '',
    phone: '',
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(gtmSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleAccountChange = (e) => {
    const { name, value } = e.target;
    setAccountData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateAccountData = () => {
    const newErrors = {};
    if (!accountData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!accountData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!accountData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(accountData.email)) {
      newErrors.email = 'Email is invalid';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAccountSave = () => {
    if (validateAccountData()) {
      // Here you would typically make an API call to update the user data
      setSuccessMessage('Account information updated successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  const handleResetPassword = () => {
    // Here you would typically trigger a password reset flow
    setSuccessMessage('Password reset link sent to your email');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const helpItems = [
    {
      icon: <HelpIcon />,
      title: 'Jak začít',
      description: 'Základní návod pro začátečníky',
      key: 'start',
    },
    {
      icon: <SecurityIcon />,
      title: 'Bezpečnost',
      description: 'Doporučení pro zabezpečení vašich videí',
      key: 'security',
    },
    {
      icon: <StorageIcon />,
      title: 'Správa úložiště',
      description: 'Jak efektivně spravovat vaše video soubory',
      key: 'storage',
    },
    {
      icon: <SpeedIcon />,
      title: 'Optimalizace',
      description: 'Tipy pro zlepšení výkonu',
      key: 'optimization',
    },
    {
      icon: <SupportIcon />,
      title: 'Podpora',
      description: 'Kontaktujte naši zákaznickou podporu',
      key: 'support',
    },
    {
      icon: <CodeIcon color="primary" />,
      title: 'Implementace',
      description: 'Jak vložit script na web pomocí Google Tag Manageru',
      key: 'implementation',
    },
  ];

  const plans = [
    {
      title: 'Základní',
      price: '299 Kč',
      period: 'měsíčně',
      features: [
        '5 GB úložiště',
        'HD kvalita',
        'Základní podpora',
        '1 uživatel',
      ],
    },
    {
      title: 'Profesionální',
      price: '599 Kč',
      period: 'měsíčně',
      features: [
        '20 GB úložiště',
        '4K kvalita',
        'Prioritní podpora',
        '3 uživatelé',
        'Pokročilé statistiky',
      ],
      recommended: true,
    },
    {
      title: 'Enterprise',
      price: '1 499 Kč',
      period: 'měsíčně',
      features: [
        '100 GB úložiště',
        '4K kvalita',
        '24/7 podpora',
        'Neomezený počet uživatelů',
        'Vlastní doména',
        'API přístup',
      ],
    },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Nastavení
      </Typography>

      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        indicatorColor="primary"
        textColor="primary"
        sx={{ mb: 3 }}
      >
        <Tab label="Nápověda" />
        <Tab label="Platby" />
        <Tab label="Account" />
      </Tabs>

      <TabPanel value={tabValue} index={0}>
        {helpDetail === 'implementation' ? (
          <Box sx={{ maxWidth: 900, mx: 'auto', mt: 4, mb: 4, p: { xs: 2, sm: 4, md: 6 }, bgcolor: 'background.paper', borderRadius: 3, boxShadow: 2 }}>
            <Button onClick={() => setHelpDetail(null)} sx={{ mb: 3, pl: 0, fontWeight: 600 }}>
              &larr; Zpět na nápovědu
            </Button>
            <Typography variant="h5" gutterBottom sx={{ mb: 2, fontWeight: 700 }}>
              Implementace na web pomocí Google Tag Manageru
            </Typography>
            <Box sx={{ mb: 3 }}>
              <Typography sx={{ mb: 1.5, fontSize: 17 }}>
                1. Přihlaste se do svého Google Tag Manager účtu.<br/>
                2. Vytvořte nový tag typu <b>Custom HTML</b>.<br/>
                3. Vložte níže uvedený snippet.<br/>
                4. Uložte a publikujte změny.<br/>
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Veškeré nastavení videa (velikost, pozice, vzhled, obsah) se automaticky načte podle URL vašeho webu. Není potřeba nic dalšího nastavovat – vše spravujete v administraci Gander.
              </Typography>
            </Box>
            <Paper variant="outlined" sx={{ p: 2.5, bgcolor: '#f5f5f5', mb: 3, borderRadius: 2, position: 'relative' }}>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1, fontWeight: 600 }}>
                Snippet pro vložení do GTM:
              </Typography>
              <Box sx={{ position: 'relative' }}>
                <Box component="pre" sx={{ fontFamily: 'monospace', fontSize: 15, m: 0, p: 1, bgcolor: '#f8f8f8', borderRadius: 1, whiteSpace: 'pre-wrap' }}>
                  {gtmSnippet}
                </Box>
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<ContentCopyIcon />}
                  onClick={handleCopy}
                  sx={{ position: 'absolute', top: 8, right: 8, minWidth: 36 }}
                >
                  {copied ? 'Zkopírováno!' : 'Kopírovat'}
                </Button>
              </Box>
            </Paper>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              Pokud potřebujete pomoci s implementací, kontaktujte naši podporu.
            </Typography>
          </Box>
        ) : (
          <List>
            {helpItems.map((item, index) => (
              <Box key={index}>
                <ListItem>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText
                    primary={item.title}
                    secondary={item.description}
                  />
                  <Button variant="outlined" size="small" onClick={() => setHelpDetail(item.key)}>
                    Zobrazit
                  </Button>
                </ListItem>
                {index < helpItems.length - 1 && <Divider />}
              </Box>
            ))}
          </List>
        )}
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
          {plans.map((plan, index) => (
            <Card
              key={index}
              sx={{
                flex: 1,
                minWidth: 280,
                maxWidth: 350,
                position: 'relative',
                ...(plan.recommended && {
                  border: '2px solid',
                  borderColor: 'primary.main',
                }),
              }}
            >
              {plan.recommended && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    bgcolor: 'primary.main',
                    color: 'white',
                    px: 2,
                    py: 0.5,
                    borderBottomLeftRadius: 8,
                  }}
                >
                  Doporučeno
                </Box>
              )}
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  {plan.title}
                </Typography>
                <Typography variant="h4" color="primary" gutterBottom>
                  {plan.price}
                </Typography>
                <Typography
                  variant="subtitle1"
                  color="text.secondary"
                  gutterBottom
                >
                  {plan.period}
                </Typography>
                <List>
                  {plan.features.map((feature, featureIndex) => (
                    <ListItem key={featureIndex} sx={{ py: 0.5 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <PaymentIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText primary={feature} />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
              <CardActions>
                <Button
                  variant={plan.recommended ? 'contained' : 'outlined'}
                  fullWidth
                >
                  Vybrat plán
                </Button>
              </CardActions>
            </Card>
          ))}
        </Box>
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <StyledPaper>
          <Typography variant="h6" gutterBottom>
            Account Information
          </Typography>
          {successMessage && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {successMessage}
            </Alert>
          )}
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="First Name"
                name="firstName"
                value={accountData.firstName}
                onChange={handleAccountChange}
                error={!!errors.firstName}
                helperText={errors.firstName}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Last Name"
                name="lastName"
                value={accountData.lastName}
                onChange={handleAccountChange}
                error={!!errors.lastName}
                helperText={errors.lastName}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Role</InputLabel>
                <Select
                  name="role"
                  value={accountData.role}
                  onChange={handleAccountChange}
                  label="Role"
                >
                  <MenuItem value="admin">Admin</MenuItem>
                  <MenuItem value="user">User</MenuItem>
                  <MenuItem value="editor">Editor</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={accountData.email}
                onChange={handleAccountChange}
                error={!!errors.email}
                helperText={errors.email}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone"
                name="phone"
                value={accountData.phone}
                onChange={handleAccountChange}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleAccountSave}
                sx={{ mr: 2 }}
              >
                Save Changes
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleResetPassword}
              >
                Reset Password
              </Button>
            </Grid>
          </Grid>
        </StyledPaper>
      </TabPanel>
    </Box>
  );
}

export default Settings; 