import { useState, useContext } from 'react';
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
} from '@mui/icons-material';
import { mockPages } from '../mockData';
import { AppDataContext } from '../App';

const mockVideos = [
  {
    id: 1,
    name: 'Vítací videoo',
    duration: '00:51',
    size: '148.55 MB',
    pages: 1,
    pageNames: ['Homepage'],
    uploaded: '09 Jun 2025',
    uploadedTime: '07:50 PM',
    source: 'Uploaded Content',
    thumbnail: 'https://randomuser.me/api/portraits/women/44.jpg',
    videoUrl: 'https://randomuser.me/api/portraits/women/44.jpg',
    connectedPages: [
      { name: 'Home Page', url: 'http://www.brunoshop.cz/' },
    ],
  },
  {
    id: 2,
    name: 'Produktové video',
    duration: '01:23',
    size: '98.12 MB',
    pages: 0,
    pageNames: [],
    uploaded: '10 Jun 2025',
    uploadedTime: '10:15 AM',
    source: 'Uploaded Content',
    thumbnail: 'https://randomuser.me/api/portraits/men/32.jpg',
    videoUrl: 'https://randomuser.me/api/portraits/men/32.jpg',
    connectedPages: [],
  },
  {
    id: 3,
    name: 'Ukázkové video',
    duration: '02:05',
    size: '210.00 MB',
    pages: 2,
    pageNames: ['Homepage', 'Produkt'],
    uploaded: '11 Jun 2025',
    uploadedTime: '14:30 PM',
    source: 'Uploaded Content',
    thumbnail: 'https://randomuser.me/api/portraits/men/45.jpg',
    videoUrl: 'https://randomuser.me/api/portraits/men/45.jpg',
    connectedPages: [],
  },
];

function normalizeUrl(url) {
  return url
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .replace(/\/$/, '')
    .toLowerCase();
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

  const onDrop = async (acceptedFiles) => {
    setUploading(true);
    try {
      // Simulace nahrávání
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newVideos = acceptedFiles.map((file, index) => ({
        id: videos.length + index + 1,
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        createdAt: new Date().toISOString(),
      }));

      setVideos([...videos, ...newVideos]);
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'video/mp4': ['.mp4'],
      'video/quicktime': ['.mov'],
    },
  });

  const handleEdit = (video) => {
    setEditingVideoId(video.id);
    setEditingVideoName(video.name);
    setEditVideoError('');
  };

  const handleEditCancel = () => {
    setEditingVideoId(null);
    setEditingVideoName('');
    setEditVideoError('');
  };

  const handleEditSave = (video) => {
    const trimmed = editingVideoName.trim();
    if (!trimmed) {
      setEditVideoError('Název nesmí být prázdný.');
      return;
    }
    if (videos.some(v => v.id !== video.id && v.name.trim().toLowerCase() === trimmed.toLowerCase())) {
      setEditVideoError('Video s tímto názvem už existuje.');
      return;
    }
    setVideos(videos.map(v => v.id === video.id ? { ...v, name: trimmed } : v));
    setEditingVideoId(null);
    setEditingVideoName('');
    setEditVideoError('');
  };

  const handleDelete = (id) => {
    setVideos(videos.filter((v) => v.id !== id));
  };

  const handleOpenDrawer = (video) => {
    setSelectedVideo(video);
    setDrawerOpen(true);
    setDrawerTab(0);
    setLocalPages([...pages]);
    setPendingConnectedPages(video.connectedPages || []);
    setPageUrl('');
    setPageSearchResults([]);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setSelectedVideo(null);
  };

  const handlePageUrlChange = (e) => {
    const value = e.target.value;
    setPageUrl(value);
    setCreatePageError('');
    if (!value) {
      setPageSearchResults([]);
      return;
    }
    const normValue = normalizeUrl(value);
    let results = localPages.filter(page =>
      normalizeUrl(page.url).includes(normValue) ||
      page.name.toLowerCase().includes(value.toLowerCase())
    );
    results = results.filter((page, idx, arr) => arr.findIndex(p => p.id === page.id) === idx);
    setPageSearchResults(results);
  };

  const handleCreatePage = () => {
    const trimmed = pageUrl.trim();
    if (!trimmed) {
      setCreatePageError('URL nesmí být prázdná.');
      return;
    }
    if (localPages.some(page => normalizeUrl(page.url) === normalizeUrl(trimmed))) {
      setCreatePageError('Stránka s touto URL už existuje.');
      return;
    }
    const newPage = {
      id: localPages.length + 1,
      name: trimmed,
      url: trimmed,
      videos: [],
      abTesting: 'Inactive',
    };
    setLocalPages([...localPages, newPage]);
    setPendingConnectedPages([...pendingConnectedPages, { name: trimmed, url: trimmed.startsWith('http') ? trimmed : 'http://' + trimmed }]);
    setPageUrl('');
    setPageSearchResults([]);
    setCreatePageError('');
  };

  const handleSelectPage = (page) => {
    setPendingConnectedPages([...pendingConnectedPages, { name: page.name, url: page.url.startsWith('http') ? page.url : 'http://' + page.url }]);
    setPageUrl('');
    setPageSearchResults([]);
  };

  const handleSave = () => {
    // Uložit nové stránky do AppDataContext
    setPages(localPages);
    // Uložit propojení do videa (mock logika, pouze lokálně)
    setVideos(videos => videos.map(v => v.id === selectedVideo.id ? { ...v, connectedPages: pendingConnectedPages } : v));
    setDrawerOpen(false);
    setSelectedVideo(null);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Manage Videos
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <TextField
          placeholder="Search"
          size="small"
          value={search}
          onChange={e => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            sx: { borderRadius: 2, bgcolor: '#fafbfc' },
          }}
          sx={{ width: 260 }}
        />
      </Box>
      <Paper sx={{ borderRadius: 3, p: 2 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ background: '#fafbfc' }}>
                <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>Video</TableCell>
                <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>Linked Pages</TableCell>
                <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>Date Uploaded</TableCell>
                <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>Source</TableCell>
                <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {videos
                .filter(v => v.name.toLowerCase().includes(search.toLowerCase()))
                .map((video) => (
                <TableRow key={video.id} hover sx={{ verticalAlign: 'middle' }}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar src={video.thumbnail} variant="rounded" sx={{ width: 56, height: 40, mr: 2 }} />
                      <Box>
                        <Typography fontWeight={600}>
                          {editingVideoId === video.id ? (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Box>
                                <TextField
                                  value={editingVideoName}
                                  onChange={e => { setEditingVideoName(e.target.value); setEditVideoError(''); }}
                                  size="small"
                                  error={!!editVideoError}
                                  helperText={editVideoError}
                                  onKeyDown={e => {
                                    if (e.key === 'Enter') handleEditSave(video);
                                    if (e.key === 'Escape') handleEditCancel();
                                  }}
                                  autoFocus
                                  sx={{ minWidth: 120 }}
                                />
                              </Box>
                              <IconButton color="primary" onClick={() => handleEditSave(video)} disabled={!!editVideoError}><CheckIcon /></IconButton>
                              <IconButton color="error" onClick={handleEditCancel}><CloseIcon /></IconButton>
                            </Box>
                          ) : (
                            <span>{video.name}</span>
                          )}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {video.duration} • {video.size}
                        </Typography>
                      </Box>
                      <IconButton size="small" sx={{ ml: 1 }} onClick={() => handleEdit(video)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={(video.connectedPages ? video.connectedPages.length : 0)}
                      color="primary"
                      size="small"
                      sx={{ fontWeight: 700, mr: 1 }}
                    />
                    <Button
                      size="small"
                      endIcon={<ArrowDropDownIcon />}
                      sx={{ textTransform: 'none', color: 'primary.main', fontWeight: 600 }}
                    >
                      Pages
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Typography fontWeight={500}>{video.uploaded}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {video.uploadedTime}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip label={video.source} size="small" sx={{ bgcolor: '#f5f5f5', color: 'text.secondary', fontWeight: 500 }} />
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      size="small"
                      sx={{ textTransform: 'none', fontWeight: 600, mr: 1 }}
                      onClick={() => handleOpenDrawer(video)}
                    >
                      Manage Video
                    </Button>
                    <IconButton color="error" onClick={() => handleDelete(video.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Drawer pro správu videa */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={handleCloseDrawer}
        PaperProps={{ sx: { width: 480, maxWidth: '100vw', p: 0 } }}
      >
        {selectedVideo && (
          <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', p: 2, borderBottom: '1px solid #eee' }}>
              <Avatar src={selectedVideo.thumbnail} sx={{ width: 48, height: 48, mr: 2 }} />
              <Box sx={{ flex: 1 }}>
                <Typography fontWeight={600} fontSize={20}>{selectedVideo.name}</Typography>
                <Typography variant="body2" color="text.secondary">Last modified an hour ago</Typography>
              </Box>
              <IconButton onClick={handleCloseDrawer}>
                <CloseIcon />
              </IconButton>
            </Box>
            <Tabs value={drawerTab} onChange={(_, v) => setDrawerTab(v)} sx={{ px: 2, pt: 1 }}>
              <Tab label="Link Video to Page" />
              <Tooltip title="Ve vývoji" arrow placement="top">
                <span>
                  <Tab label="Add Interaction" disabled sx={{ color: '#bdbdbd' }} />
                </span>
              </Tooltip>
            </Tabs>
            <Divider />
            {/* Obsah první záložky */}
            {drawerTab === 0 && (
              <Box sx={{ p: 3, display: 'flex', gap: 3, flexDirection: 'column' }}>
                <Box sx={{ display: 'flex', gap: 3 }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography fontWeight={600} sx={{ mb: 1 }}>Link Video to New Page</Typography>
                    <Box sx={{ position: 'relative', mb: 3 }}>
                      <TextField
                        placeholder="Enter Page URL"
                        size="small"
                        fullWidth
                        value={pageUrl}
                        onChange={handlePageUrlChange}
                        autoComplete="off"
                      />
                      {pageUrl && (
                        <Paper sx={{ position: 'absolute', left: 0, right: 0, zIndex: 10, mt: 0.5, maxHeight: 180, overflowY: 'auto' }}>
                          {pageSearchResults.length === 0 ? (
                            <>
                              <Box sx={{ px: 2, py: 1, color: 'text.secondary' }}>No page found for input URL</Box>
                              <Button fullWidth onClick={handleCreatePage} sx={{ justifyContent: 'flex-start', pl: 2 }} disabled={!!createPageError || !pageUrl.trim()}>
                                + Create page
                              </Button>
                              {createPageError && (
                                <Box sx={{ color: 'error.main', px: 2, py: 0.5, fontSize: 13 }}>{createPageError}</Box>
                              )}
                            </>
                          ) : (
                            pageSearchResults.map(page => (
                              <Button key={page.id} fullWidth onClick={() => handleSelectPage(page)} sx={{ justifyContent: 'flex-start', pl: 2 }}>
                                {page.name} ({page.url})
                              </Button>
                            ))
                          )}
                        </Paper>
                      )}
                    </Box>
                    <Typography fontWeight={600} sx={{ mb: 1 }}>Connected Pages</Typography>
                    <Box sx={{ border: '1px solid #eee', borderRadius: 2, overflow: 'hidden' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', px: 2, py: 1, bgcolor: '#fafbfc', borderBottom: '1px solid #eee' }}>
                        <Typography variant="caption" sx={{ flex: 1, fontWeight: 700 }}>LINKED TO</Typography>
                        <Typography variant="caption" sx={{ fontWeight: 700 }}>ACTION</Typography>
                      </Box>
                      {pendingConnectedPages.map((page, idx) => (
                        <Box key={idx} sx={{ display: 'flex', alignItems: 'center', px: 2, py: 1, borderBottom: idx === pendingConnectedPages.length - 1 ? 'none' : '1px solid #eee' }}>
                          <Box sx={{ flex: 1 }}>
                            <Typography fontWeight={500}>{page.name}</Typography>
                            <Typography variant="body2" color="primary.main" sx={{ fontSize: 13 }}>
                              <a href={page.url} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>{page.url}</a>
                            </Typography>
                          </Box>
                          <IconButton color="error" size="small">
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      ))}
                    </Box>
                    <Button color="error" size="small" sx={{ mt: 1, textTransform: 'none' }}>Remove All</Button>
                  </Box>
                  <Box>
                    <Paper elevation={1} sx={{ width: 180, height: 240, borderRadius: 2, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <img src={selectedVideo.thumbnail} alt="video" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </Paper>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                  <Button variant="contained" onClick={handleSave} sx={{ borderRadius: 2, textTransform: 'none' }}>Uložit</Button>
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