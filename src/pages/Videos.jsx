import { useState, useContext, useEffect, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
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
  CircularProgress,
  InputAdornment,
  Chip,
  Avatar,
  Drawer,
  Tabs,
  Tab,
  Tooltip,
  Divider,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  CloudUpload as UploadIcon,
  Search as SearchIcon,
  ArrowDropDown as ArrowDropDownIcon,
  Close as CloseIcon,
  Check as CheckIcon,
  PlayCircleOutline as PlayCircleOutlineIcon,
} from '@mui/icons-material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { AppDataContext } from '../App';
import { useAuth0 } from '@auth0/auth0-react';

function normalizeUrl(url) {
  return url
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .replace(/\/$/, '')
    .toLowerCase();
}

function formatDuration(seconds) {
  if (!seconds) return 'Neznámá délka';
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

function formatFileSize(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function formatDateOnly(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('cs-CZ', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

function formatTimeOnly(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleTimeString('cs-CZ', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function Videos() {
  const [search, setSearch] = useState('');
  const [uploading, setUploading] = useState(false);
  const [editDialog, setEditDialog] = useState({ open: false, video: null });
  const [newName, setNewName] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [drawerTab, setDrawerTab] = useState(0);
  const [pageUrl, setPageUrl] = useState('');
  const { pages, setPages, videos, setVideos } = useContext(AppDataContext);
  const [localPages, setLocalPages] = useState([...pages]);
  const [pageSearchResults, setPageSearchResults] = useState([]);
  const [pendingConnectedPages, setPendingConnectedPages] = useState([]);
  const [editingVideoId, setEditingVideoId] = useState(null);
  const [editingVideoName, setEditingVideoName] = useState('');
  const [editVideoError, setEditVideoError] = useState('');
  const [createPageError, setCreatePageError] = useState('');
  const [uploadError, setUploadError] = useState('');
  const { getAccessTokenSilently } = useAuth0();
  const { isAuthenticated, user, getAccessTokenSilently: auth0GetAccessTokenSilently } = useAuth0();
  const { setAlert } = useContext(AppDataContext);

  const [linkingMethod, setLinkingMethod] = useState('existing');
  const [newPageName, setNewPageName] = useState('');
  const [newPageUrl, setNewPageUrl] = useState('');

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
  const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100 MB
  const SUPPORTED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/ogg'];

  const fetchVideos = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const token = await getAccessTokenSilently();
      const response = await fetch(`${API_URL}/api/videos`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setVideos(data);
    } catch (error) {
      console.error("Error fetching videos:", error);
      setAlert({ message: `Chyba při načítání videí: ${error.message}`, type: "error" });
    }
  }, [isAuthenticated, getAccessTokenSilently, setAlert, API_URL]);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  const onDrop = useCallback(async (acceptedFiles, fileRejections) => {
    if (!isAuthenticated) {
      setAlert({ message: "Pro nahrávání videí musíte být přihlášeni.", type: "warning" });
      return;
    }

    if (fileRejections.length > 0) {
      fileRejections.forEach((fileRejection) => {
        fileRejection.errors.forEach((error) => {
          if (error.code === 'file-too-large') {
            setUploadError(`Soubor ${fileRejection.file.name} je příliš velký. Maximální velikost je ${formatFileSize(MAX_FILE_SIZE)}.`);
          } else if (error.code === 'file-invalid-type') {
            setUploadError(`Soubor ${fileRejection.file.name} má nepodporovaný formát. Podporované formáty: ${SUPPORTED_VIDEO_TYPES.map(type => type.split('/')[1]).join(', ')}.`);
          } else {
            setUploadError(`Chyba při nahrávání souboru ${fileRejection.file.name}: ${error.message}`);
          }
        });
      });
      return;
    }

    if (acceptedFiles.length === 0) return;

    setUploading(true);
    setUploadError(''); // Clear previous errors
    const formData = new FormData();
    acceptedFiles.forEach(file => {
      formData.append("videos", file);
    });

    try {
      const token = await getAccessTokenSilently();
      const response = await fetch(`${API_URL}/api/videos`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setAlert({ message: "Videa byla úspěšně nahrána!", type: "success" });
      fetchVideos(); // Refresh the list of videos
    } catch (error) {
      console.error("Error uploading videos:", error);
      setAlert({ message: `Chyba při nahrávání videí: ${error.message}`, type: "error" });
    } finally {
      setUploading(false);
    }
  }, [isAuthenticated, getAccessTokenSilently, setAlert, fetchVideos, API_URL]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: SUPPORTED_VIDEO_TYPES.reduce((acc, type) => ({ ...acc, [type]: [] }), {}),
    maxSize: MAX_FILE_SIZE,
  });

  const handleEditClick = (video) => {
    setEditDialog({ open: true, video });
    setNewName(video.title);
  };

  const handleEditSave = async () => {
    if (!editDialog.video || !newName.trim()) {
      setAlert({ message: "Název nemůže být prázdný.", type: "error" });
      return;
    }
    try {
      const token = await getAccessTokenSilently();
      const response = await fetch(`${API_URL}/api/videos/${editDialog.video.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title: newName }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      setAlert({ message: "Název videa byl úspěšně aktualizován.", type: "success" });
      setEditDialog({ open: false, video: null });
      fetchVideos(); // Refresh the list
    } catch (error) {
      console.error("Error updating video:", error);
      setAlert({ message: `Chyba při aktualizaci videa: ${error.message}`, type: "error" });
    }
  };

  const handleDeleteClick = async (id) => {
    if (!window.confirm("Opravdu chcete toto video smazat?")) return;
    try {
      const token = await getAccessTokenSilently();
      const response = await fetch(`${API_URL}/api/videos/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      setAlert({ message: "Video bylo úspěšně smazáno.", type: "success" });
      fetchVideos(); // Refresh the list
    } catch (error) {
      console.error("Error deleting video:", error);
      setAlert({ message: `Chyba při mazání videa: ${error.message}`, type: "error" });
    }
  };

  const handleOpenDrawer = (video) => {
    console.log('Frontend - handleOpenDrawer received video:', video);
    setSelectedVideo(video);
    setDrawerOpen(true);
    setDrawerTab(0);
    setLocalPages([...pages]);
    setPendingConnectedPages(video.Pages || []);
    setPageUrl('');
    setNewPageName('');
    setNewPageUrl('');
    setPageSearchResults([]);
    setCreatePageError('');
    setLinkingMethod('existing');
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setSelectedVideo(null);
  };

  const handleRemovePendingPage = (pageIdToRemove) => {
    setPendingConnectedPages(pendingConnectedPages.filter(page => page.id !== pageIdToRemove));
  };

  const handlePageSearchChange = (e) => {
    const value = e.target.value;
    setPageUrl(value);
    if (!value) {
      setPageSearchResults([]);
      return;
    }
    const normValue = normalizeUrl(value);
    let results = localPages.filter(page =>
      normalizeUrl(page.url).includes(normValue) || page.name.toLowerCase().includes(value.toLowerCase())
    );
    setPageSearchResults(results);
  };

  const handleCreatePage = async () => {
    if (!newPageName.trim() || !newPageUrl.trim()) {
      setCreatePageError('Název i URL stránky nemůže být prázdná.');
      return;
    }
    const normalizedUrl = normalizeUrl(newPageUrl);
    if (localPages.some(p => normalizeUrl(p.url) === normalizedUrl)) {
      setCreatePageError('Stránka s touto URL již existuje.');
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
        body: JSON.stringify({ name: newPageName, url: newPageUrl }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const newPage = await response.json();
      setLocalPages([...localPages, newPage]);
      setPendingConnectedPages([...pendingConnectedPages, newPage]);
      setNewPageUrl('');
      setNewPageName('');
      setCreatePageError('');
      setAlert({ message: 'Stránka byla úspěšně vytvořena a přidána k propojení!', type: 'success' });
      setLinkingMethod('existing');
    } catch (error) {
      console.error('Error creating page:', error);
      setCreatePageError(`Chyba při vytváření stránky: ${error.message}`);
      setAlert({ message: `Chyba při vytváření stránky: ${error.message}`, type: 'error' });
    }
  };

  const handleSelectPage = (page) => {
    if (!pendingConnectedPages.some(p => p.id === page.id)) {
      setPendingConnectedPages([...pendingConnectedPages, page]);
    }
    setPageUrl('');
    setPageSearchResults([]);
  };

  const handleSave = async () => {
    if (!selectedVideo) return;
    
    try {
      const token = await getAccessTokenSilently();
      const response = await fetch(`${API_URL}/api/videos/${selectedVideo.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: selectedVideo.title,
          connectedPageIds: pendingConnectedPages.map(page => page.id) || []
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const updatedVideo = await response.json();
      setVideos(videos.map(v => v.id === updatedVideo.id ? updatedVideo : v));
      setAlert({ message: 'Video bylo úspěšně aktualizováno.', type: 'success' });
      handleCloseDrawer();
    } catch (error) {
      console.error('Error saving video:', error);
      setAlert({ message: `Chyba při ukládání videa: ${error.message}`, type: 'error' });
    }
  };

  const filteredVideos = videos.filter(video =>
    video.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>Správa Videí</Typography>
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <TextField
          label="Hledat videa"
          variant="outlined"
          fullWidth
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>
      <Paper
        elevation={2}
        {...getRootProps()}
        sx={{
          mb: 3,
          p: 3,
          border: '2px dashed',
          borderColor: isDragActive ? 'primary.main' : 'grey.400',
          backgroundColor: isDragActive ? 'grey.100' : 'transparent',
          textAlign: 'center',
          cursor: 'pointer',
          transition: 'border-color .2s ease-in-out, background-color .2s ease-in-out',
        }}
      >
        <input {...getInputProps()} />
        {uploading ? (
          <CircularProgress />
        ) : (
          <Typography variant="body1" color="text.secondary">
            {isDragActive ? "Přetáhněte soubory sem..." : "Přetáhněte video soubory sem, nebo klikněte pro výběr souborů"}
          </Typography>
        )}
        <Button
          variant="contained"
          startIcon={<CloudUploadIcon />}
          sx={{ mt: 2 }}
          onClick={(e) => { e.stopPropagation(); /* Prevents dropzone from activating again */ }}
        >
          Vybrat soubory k nahrání
        </Button>
        {uploadError && (
          <Typography color="error" sx={{ mt: 2 }}>
            {uploadError}
          </Typography>
        )}
        <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
          Podporované formáty: {SUPPORTED_VIDEO_TYPES.map(type => type.split('/')[1]).join(', ')}. Maximální velikost: {formatFileSize(MAX_FILE_SIZE)}.
        </Typography>
      </Paper>
      
      <Paper elevation={2} sx={{ mb: 3 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Název Videa</TableCell>
                <TableCell>Náhled</TableCell>
                <TableCell>Délka</TableCell>
                <TableCell>Velikost</TableCell>
                <TableCell>Datum nahrání</TableCell>
                <TableCell>Propojené stránky</TableCell>
                <TableCell align="right">Akce</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredVideos.map((video) => (
                <TableRow key={video.id}>
                  <TableCell>{video.title}</TableCell>
                  <TableCell>
                    {video.thumbnail ? (
                      <Box
                        component="img"
                        src={video.thumbnail}
                        alt="Video Thumbnail"
                        sx={{ width: 100, height: 60, objectFit: 'cover', borderRadius: 1 }}
                      />
                    ) : (
                      <PlayCircleOutlineIcon sx={{ width: 100, height: 60, color: 'text.disabled' }} />
                    )}
                  </TableCell>
                  <TableCell>{formatDuration(video.duration)}</TableCell>
                  <TableCell>{formatFileSize(video.size)}</TableCell>
                  <TableCell>{formatDateOnly(video.createdAt)} {formatTimeOnly(video.createdAt)}</TableCell>
                  <TableCell>
                    {video.Pages && video.Pages.length > 0 ? (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {video.Pages.map((page) => (
                          <Chip key={page.id} label={page.name} size="small" onDelete={() => { /* handle delete directly from the table if needed */ }} />
                        ))}
                      </Box>
                    ) : (
                      <Typography variant="body2" color="textSecondary">Žádné</Typography>
                    )}
                  </TableCell>
                  <TableCell align="right">
                    <IconButton onClick={() => handleEditClick(video)} color="primary" size="small">
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteClick(video.id)} color="error" size="small">
                      <DeleteIcon />
                    </IconButton>
                    <Button
                      variant="outlined"
                      size="small"
                      sx={{ textTransform: 'none', fontWeight: 600, ml: 1 }}
                      onClick={() => handleOpenDrawer(video)}
                    >
                      Spravovat video
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filteredVideos.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} sx={{ textAlign: 'center', py: 3 }}>
                    Žádná videa nalezena. Nahrajte první video!
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Edit Video Dialog */}
      <Dialog open={editDialog.open} onClose={() => setEditDialog({ open: false, video: null })}>
        <DialogTitle>Upravit název videa</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nový název"
            type="text"
            fullWidth
            variant="outlined"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialog({ open: false, video: null })}>Zrušit</Button>
          <Button onClick={handleEditSave} variant="contained">Uložit</Button>
        </DialogActions>
      </Dialog>

      {/* Video Management Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={handleCloseDrawer}
        PaperProps={{
          sx: { width: 500 },
        }}
      >
        {selectedVideo && (
          <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Správa videa: {selectedVideo.title}</Typography>
              <IconButton onClick={handleCloseDrawer}>
                <CloseIcon />
              </IconButton>
            </Box>
            <Tabs value={linkingMethod} onChange={(event, newValue) => {
              setLinkingMethod(newValue);
              setCreatePageError('');
              setNewPageName('');
              setNewPageUrl('');
              setPageUrl('');
              setPageSearchResults([]);
            }} sx={{ mb: 2 }}>
              <Tab value="existing" label="Propojit s existující stránkou" />
              <Tab value="new" label="Vytvořit novou stránku" />
            </Tabs>

            {linkingMethod === 'new' && (
              <Box sx={{ display: 'flex', gap: 3, flexDirection: 'column', mb: 3 }}>
                <Typography fontWeight={600} sx={{ mb: 1 }}>Vytvořit a propojit novou stránku</Typography>
                <TextField
                  label="Název stránky"
                  variant="outlined"
                  fullWidth
                  value={newPageName}
                  onChange={(e) => setNewPageName(e.target.value)}
                  sx={{ mb: 1 }}
                />
                <TextField
                  label="URL stránky"
                  variant="outlined"
                  fullWidth
                  value={newPageUrl}
                  onChange={(e) => {
                    setNewPageUrl(e.target.value);
                    setCreatePageError('');
                  }}
                  error={!!createPageError}
                  helperText={createPageError}
                  sx={{ mb: 2 }}
                />
                <Button
                  variant="contained"
                  onClick={handleCreatePage}
                  startIcon={<CheckIcon />}
                  fullWidth
                  disabled={!newPageName.trim() || !newPageUrl.trim()}
                >
                  Vytvořit a propojit stránku
                </Button>
              </Box>
            )}

            {linkingMethod === 'existing' && (
              <Box sx={{ display: 'flex', gap: 3, flexDirection: 'column', mb: 3 }}>
                <Typography fontWeight={600} sx={{ mb: 1 }}>Propojit video s existující stránkou</Typography>
                <TextField
                  label="Hledat existující stránky"
                  variant="outlined"
                  fullWidth
                  value={pageUrl}
                  onChange={handlePageSearchChange}
                  sx={{ mb: 2 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
                <Paper elevation={1} sx={{ maxHeight: 200, overflow: 'auto', mb: 2 }}>
                  {pageSearchResults.length > 0 ? (
                    <Table size="small">
                      <TableBody>
                        {pageSearchResults.map((page) => (
                          <TableRow key={page.id} hover onClick={() => handleSelectPage(page)} sx={{ cursor: 'pointer' }}>
                            <TableCell>{page.name || page.url}</TableCell>
                            <TableCell align="right">
                              {pendingConnectedPages.some(p => p.id === page.id) ? (
                                <CheckIcon color="success" />
                              ) : (
                                <ArrowDropDownIcon color="action" />
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <Typography variant="body2" color="textSecondary" sx={{ p: 2 }}>
                      Žádné výsledky.
                    </Typography>
                  )}
                </Paper>
                <Divider />
                <Typography fontWeight={600} sx={{ mb: 1 }}>Aktuálně propojené stránky</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {pendingConnectedPages.length > 0 ? (
                    pendingConnectedPages.map((page) => (
                      <Chip
                        key={page.id}
                        label={page.name || page.url}
                        onDelete={() => handleRemovePendingPage(page.id)}
                        avatar={<Avatar>P</Avatar>}
                      />
                    ))
                  ) : (
                    <Typography variant="body2" color="textSecondary">Žádné stránky nejsou propojeny.</Typography>
                  )}
                </Box>
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSave}
                    disabled={!selectedVideo}
                  >
                    Uložit propojení
                  </Button>
                </Box>
              </Box>
            )}
          </Box>
        )}
      </Drawer>
    </Box>
  );
}

export default Videos;