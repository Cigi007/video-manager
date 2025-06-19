import { useState, useContext, useEffect, useCallback } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Switch,
  FormControlLabel,
  InputAdornment,
  Chip,
  Avatar,
  Drawer,
  Menu,
  MenuItem,
  Tabs,
  Tab,
  Divider,
  Tooltip,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Search as SearchIcon,
  ArrowDropDown as ArrowDropDownIcon,
  OpenInNew as OpenInNewIcon,
  Close as CloseIcon,
  Link as LinkIcon,
  Check as CheckIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { AppDataContext } from '../App';
import { useAuth0 } from '@auth0/auth0-react';

function normalizeUrl(url) {
  return url
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .replace(/\/$/, '')
    .toLowerCase();
}

function Pages() {
  const { pages, setPages, videos, setVideos, setAlert } = useContext(AppDataContext);
  const [search, setSearch] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedPage, setSelectedPage] = useState(null);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [menuPageId, setMenuPageId] = useState(null);
  const [videoToAdd, setVideoToAdd] = useState('');
  const [editingPageId, setEditingPageId] = useState(null);
  const [editingPageName, setEditingPageName] = useState('');
  const [editPageError, setEditPageError] = useState('');
  const [newPageDialog, setNewPageDialog] = useState(false);
  const [newUrl, setNewUrl] = useState('');
  const [newName, setNewName] = useState('');
  const [newPageError, setNewPageError] = useState('');
  const [drawerTab, setDrawerTab] = useState(0);
  const [videoSearch, setVideoSearch] = useState('');
  const [videoSearchResults, setVideoSearchResults] = useState([]);
  const [pendingConnectedVideos, setPendingConnectedVideos] = useState([]);

  const navigate = useNavigate();
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  const fetchPages = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const token = await getAccessTokenSilently();
      const response = await fetch(`${API_URL}/api/pages`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setPages(data);
    } catch (error) {
      console.error("Error fetching pages:", error);
      setAlert({ message: `Chyba při načítání stránek: ${error.message}`, type: "error" });
    }
  }, [isAuthenticated, getAccessTokenSilently, API_URL, setPages, setAlert]);

  useEffect(() => {
    fetchPages();
  }, [fetchPages]);

  const handleOpenDrawer = (page) => {
    setSelectedPage(page);
    setDrawerOpen(true);
    setDrawerTab(0);
    setPendingConnectedVideos(page.Videos || []);
    setVideoSearch('');
    setVideoSearchResults([]);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setSelectedPage(null);
  };

  const handleMenuOpen = (event, pageId) => {
    setMenuAnchor(event.currentTarget);
    setMenuPageId(pageId);
  };
  const handleMenuClose = () => {
    setMenuAnchor(null);
    setMenuPageId(null);
  };
  
  const handleAddPageClick = () => {
    setNewPageDialog(true);
    setNewName('');
    setNewUrl('');
    setNewPageError('');
  };

  const handleCreatePage = async () => {
    const trimmedName = newName.trim();
    const trimmedUrl = newUrl.trim();

    if (!trimmedName || !trimmedUrl) {
      setNewPageError('Název a URL jsou povinné.');
      return;
    }
    if (!trimmedUrl.startsWith('http://') && !trimmedUrl.startsWith('https://')) {
        setNewPageError('URL musí začínat s http:// nebo https://');
        return;
    }
    if (pages.some(p => normalizeUrl(p.url) === normalizeUrl(trimmedUrl))) {
        setNewPageError('Stránka s touto URL už existuje.');
        return;
    }

    try {
      const token = await getAccessTokenSilently();
      const response = await fetch(`${API_URL}/api/pages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: trimmedName, url: trimmedUrl }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      setAlert({ message: "Stránka byla úspěšně vytvořena!", type: "success" });
      setNewPageDialog(false);
      fetchPages(); // Refresh the list of pages
    } catch (error) {
      console.error("Error creating page:", error);
      setNewPageError(`Chyba při vytváření stránky: ${error.message}`);
      setAlert({ message: `Chyba při vytváření stránky: ${error.message}`, type: "error" });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Opravdu chcete tuto stránku smazat? Videa propojená s touto stránkou ztratí toto propojení.")) return;
    try {
      const token = await getAccessTokenSilently();
      const response = await fetch(`${API_URL}/api/pages/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Update videos that were connected to this page
      const updatedVideos = videos.map(video => ({
        ...video,
        connectedPages: (video.connectedPages || []).filter(page => page.id !== id)
      }));
      setVideos(updatedVideos);

      setAlert({ message: "Stránka byla úspěšně smazána.", type: "success" });
      fetchPages(); // Refresh the list of pages
    } catch (error) {
      console.error("Error deleting page:", error);
      setAlert({ message: `Chyba při mazání stránky: ${error.message}`, type: "error" });
    }
  };

  // Přidání videa do stránky (obousměrně) - UPRAVENO pro komunikaci s BE
  const handleAddVideo = async () => {
    if (!videoToAdd || !selectedPage) return;
    const videoObj = videos.find(v => v.id === videoToAdd);
    if (!videoObj) {
      setAlert({ message: "Vybrané video nebylo nalezeno.", type: "error" });
      return;
    }

    const isAlreadyConnected = (videoObj.connectedPages || []).some(cp => cp.id === selectedPage.id);
    if (isAlreadyConnected) {
      setAlert({ message: "Video je již propojeno s touto stránkou.", type: "warning" });
      return;
    }

    const updatedConnectedPages = [
      ...(videoObj.connectedPages || []),
      { id: selectedPage.id, name: selectedPage.name, url: selectedPage.url },
    ];

    try {
      const token = await getAccessTokenSilently();
      const response = await fetch(`${API_URL}/api/videos/${videoObj.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ connectedPages: updatedConnectedPages }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setAlert({ message: `Video '${videoObj.title}' bylo propojeno se stránkou '${selectedPage.name}'.`, type: "success" });
      setVideoToAdd('');
      setVideos(videos.map(v => v.id === videoObj.id ? { ...v, connectedPages: updatedConnectedPages } : v));
      setSelectedPage({
        ...selectedPage,
      });
    } catch (error) {
      console.error("Error linking video to page:", error);
      setAlert({ message: `Chyba při propojování videa se stránkou: ${error.message}`, type: "error" });
    }
  };

  const handleRemoveVideo = (videoToRemove) => {
    setPendingConnectedVideos(prev => prev.filter(video => video.id !== videoToRemove.id));
  };

  const handleEditPage = (page) => {
    setEditingPageId(page.id);
    setEditingPageName(page.name);
    setEditPageError('');
  };

  const handleEditPageCancel = () => {
    setEditingPageId(null);
    setEditingPageName('');
    setEditPageError('');
  };

  const handleEditPageSave = async (page) => {
    if (!editingPageName.trim()) {
      setEditPageError('Název stránky nemůže být prázdný.');
      return;
    }
    try {
      const token = await getAccessTokenSilently();
      const response = await fetch(`${API_URL}/api/pages/${page.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: editingPageName }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      setAlert({ message: 'Název stránky byl úspěšně aktualizován.', type: 'success' });
      setEditingPageId(null);
      setEditingPageName('');
      fetchPages();
    } catch (error) {
      console.error("Error updating page name:", error);
      setEditPageError(`Chyba při aktualizaci názvu stránky: ${error.message}`);
      setAlert({ message: `Chyba při aktualizaci názvu stránky: ${error.message}`, type: "error" });
    }
  };

  const handleVideoSearchChange = (e) => {
    const value = e.target.value;
    setVideoSearch(value);
    if (!value) {
      setVideoSearchResults([]);
      return;
    }
    const results = videos.filter(video =>
      video.title.toLowerCase().includes(value.toLowerCase()) &&
      !pendingConnectedVideos.some(pcv => pcv.id === video.id)
    );
    setVideoSearchResults(results);
  };
  const handleSelectVideo = (video) => {
    setPendingConnectedVideos(prev => [...prev, video]);
    setVideoSearch('');
    setVideoSearchResults([]);
  };

  const handleSave = async () => {
    if (!selectedPage) return;
    
    try {
      const token = await getAccessTokenSilently();
      const response = await fetch(`${API_URL}/api/pages/${selectedPage.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: selectedPage.name,
          url: selectedPage.url,
          abTesting: selectedPage.abTesting,
          connectedVideoIds: pendingConnectedVideos.map(video => video.id)
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const updatedPage = await response.json();
      setPages(pages.map(p => p.id === updatedPage.id ? updatedPage : p));
      setAlert({ message: 'Stránka byla úspěšně aktualizována.', type: 'success' });
      handleCloseDrawer();
    } catch (error) {
      console.error('Error saving page:', error);
      setAlert({ message: `Chyba při ukládání stránky: ${error.message}`, type: 'error' });
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" component="h1" fontWeight="bold">Správa stránek</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddPageClick}
          >
            Přidat stránku
          </Button>
        </Box>
        <TextField
          fullWidth
          label="Hledat stránky"
          variant="outlined"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 2 }}
        />
        <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Název</TableCell>
                <TableCell>URL</TableCell>
                <TableCell>Propojená videa</TableCell>
                <TableCell>A/B testování</TableCell>
                <TableCell align="right">Akce</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pages.filter(page =>
                page.name.toLowerCase().includes(search.toLowerCase()) ||
                page.url.toLowerCase().includes(search.toLowerCase())
              ).map((page) => (
                <TableRow key={page.id}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {editingPageId === page.id ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <TextField
                            value={editingPageName}
                            onChange={(e) => setEditingPageName(e.target.value)}
                            size="small"
                            error={!!editPageError}
                            helperText={editPageError}
                            onKeyDown={e => {
                              if (e.key === 'Enter') handleEditPageSave(page);
                              if (e.key === 'Escape') handleEditPageCancel();
                            }}
                            autoFocus
                            sx={{ minWidth: 120 }}
                          />
                          <IconButton color="primary" onClick={() => handleEditPageSave(page)} disabled={!!editPageError}><CheckIcon /></IconButton>
                          <IconButton color="error" onClick={handleEditPageCancel}><CloseIcon /></IconButton>
                        </Box>
                      ) : (
                        <Typography fontWeight={600}>{page.name}</Typography>
                      )}
                      <Tooltip title="Otevřít stránku" arrow>
                        <IconButton size="small" href={page.url} target="_blank">
                          <OpenInNewIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Upravit stránku" arrow>
                        <IconButton size="small" onClick={() => handleOpenDrawer(page)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      <a href={page.url} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>{page.url}</a>
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={page.Videos?.length || 0}
                      color="primary"
                      size="small"
                      sx={{ fontWeight: 700, mr: 1 }}
                    />
                    <Button
                      size="small"
                      endIcon={<ArrowDropDownIcon />}
                      sx={{ textTransform: 'none', color: 'primary.main', fontWeight: 600 }}
                      onClick={() => handleOpenDrawer(page)}
                    >
                      Videa
                    </Button>
                  </TableCell>
                  <TableCell>
                    <FormControlLabel
                      control={<Switch checked={page.abTesting === 'Active'} onChange={() => { /* Implement A/B testing toggle */ }} name="abTestingSwitch" />}
                      label={page.abTesting}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton color="error" onClick={() => handleDelete(page.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {pages.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} sx={{ textAlign: 'center', py: 3 }}>
                    Žádné stránky nebyly nalezeny. Vytvořte první stránku!
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Drawer pro přidávání/odebírání videí ze stránky */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={handleCloseDrawer}
        PaperProps={{
          sx: { width: '400px', p: 2 }
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Správa stránky</Typography>
          <IconButton onClick={handleCloseDrawer}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Tabs value={drawerTab} onChange={(e, newValue) => setDrawerTab(newValue)}>
          <Tab label="Detaily" />
          <Tab label="Propojení" />
        </Tabs>

        <Box sx={{ mt: 2 }}>
          {drawerTab === 0 ? (
            <Box>
              <TextField
                fullWidth
                label="Název stránky"
                value={selectedPage?.name || ''}
                onChange={(e) => setSelectedPage(prev => ({ ...prev, name: e.target.value }))}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="URL stránky"
                value={selectedPage?.url || ''}
                onChange={(e) => setSelectedPage(prev => ({ ...prev, url: e.target.value }))}
                sx={{ mb: 2 }}
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={selectedPage?.abTesting === 'Active'}
                    onChange={(e) => setSelectedPage(prev => ({ ...prev, abTesting: e.target.checked ? 'Active' : 'Inactive' }))}
                    name="abTestingSwitch"
                  />
                }
                label={selectedPage?.abTesting || 'Inactive'}
              />
            </Box>
          ) : (
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                Propojená videa
              </Typography>
              <Box sx={{ mb: 2 }}>
                <TextField
                  fullWidth
                  label="Hledat video"
                  value={videoSearch}
                  onChange={handleVideoSearchChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
                {videoSearchResults.length > 0 && (
                  <Paper sx={{ mt: 1, maxHeight: 200, overflow: 'auto' }}>
                    {videoSearchResults.map((video) => (
                      <Box
                        key={video.id}
                        sx={{
                          p: 1,
                          display: 'flex',
                          alignItems: 'center',
                          cursor: 'pointer',
                          '&:hover': { bgcolor: 'action.hover' },
                        }}
                        onClick={() => handleSelectVideo(video)}
                      >
                        <Typography>{video.title}</Typography>
                      </Box>
                    ))}
                  </Paper>
                )}
              </Box>

              <Typography variant="subtitle2" gutterBottom>
                Aktuálně propojená videa:
              </Typography>
              {pendingConnectedVideos.map((video) => (
                <Chip
                  key={video.id}
                  label={video.title}
                  onDelete={() => handleRemoveVideo(video)}
                  sx={{ m: 0.5 }}
                />
              ))}
            </Box>
          )}
        </Box>

        <Box sx={{ mt: 'auto', pt: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
            disabled={!selectedPage}
          >
            Uložit změny
          </Button>
        </Box>
      </Drawer>

      {/* Dialog pro přidání nové stránky */}
      <Dialog open={newPageDialog} onClose={() => setNewPageDialog(false)}>
        <DialogTitle>Přidat novou stránku</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Název stránky"
            type="text"
            fullWidth
            variant="outlined"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="URL stránky"
            type="text"
            fullWidth
            variant="outlined"
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
            error={!!newPageError}
            helperText={newPageError}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNewPageDialog(false)}>Zrušit</Button>
          <Button onClick={handleCreatePage} variant="contained">Vytvořit</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Pages;