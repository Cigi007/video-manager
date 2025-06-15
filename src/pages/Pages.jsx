import { useState, useContext } from 'react';
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

function Pages() {
  const { pages, setPages, videos, setVideos } = useContext(AppDataContext);
  const [search, setSearch] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedPage, setSelectedPage] = useState(null);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [menuPageId, setMenuPageId] = useState(null);
  const [videoToAdd, setVideoToAdd] = useState('');
  const [editingPageId, setEditingPageId] = useState(null);
  const [editingPageName, setEditingPageName] = useState('');
  const [editPageError, setEditPageError] = useState('');
  const navigate = useNavigate();

  const handleOpenDrawer = (page) => {
    setSelectedPage(page);
    setDrawerOpen(true);
    setVideoToAdd('');
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
  const handleDelete = (id) => {
    setPages(pages.filter((p) => p.id !== id));
  };
  // Přidání videa do stránky (obousměrně)
  const handleAddVideo = () => {
    if (!videoToAdd) return;
    // Najdi video
    const videoObj = videos.find(v => v.id === parseInt(videoToAdd));
    if (!videoObj) return;
    // Přidej video do stránky
    setPages(pages.map(page =>
      page.id === selectedPage.id
        ? { ...page, videos: [...page.videos, videoObj] }
        : page
    ));
    setSelectedPage({
      ...selectedPage,
      videos: [...selectedPage.videos, videoObj],
    });
    // Přidej stránku do connectedPages videa
    setVideos(videos.map(v =>
      v.id === videoObj.id
        ? {
            ...v,
            connectedPages: [
              ...(v.connectedPages || []),
              { name: selectedPage.name, url: selectedPage.url },
            ],
          }
        : v
    ));
    setVideoToAdd('');
  };
  // Odebrání videa ze stránky (obousměrně)
  const handleRemoveVideo = (videoId) => {
    setPages(pages.map(page =>
      page.id === selectedPage.id
        ? { ...page, videos: page.videos.filter(v => v.id !== videoId) }
        : page
    ));
    setSelectedPage({
      ...selectedPage,
      videos: selectedPage.videos.filter(v => v.id !== videoId),
    });
    // Odeber stránku z connectedPages videa
    setVideos(videos.map(v =>
      v.id === videoId
        ? {
            ...v,
            connectedPages: (v.connectedPages || []).filter(cp => normalizeUrl(cp.url) !== normalizeUrl(selectedPage.url)),
          }
        : v
    ));
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
  const handleEditPageSave = (page) => {
    const trimmed = editingPageName.trim();
    if (!trimmed) {
      setEditPageError('Název nesmí být prázdný.');
      return;
    }
    if (pages.some(p => p.id !== page.id && p.name.trim().toLowerCase() === trimmed.toLowerCase())) {
      setEditPageError('Stránka s tímto názvem už existuje.');
      return;
    }
    setPages(pages.map(p => p.id === page.id ? { ...p, name: trimmed } : p));
    setEditingPageId(null);
    setEditingPageName('');
    setEditPageError('');
  };

  function normalizeUrl(url) {
    return url
      .replace(/^https?:\/\//, '')
      .replace(/^www\./, '')
      .replace(/\/$/, '')
      .toLowerCase();
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Manage Pages
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
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
        <Button variant="contained" sx={{ borderRadius: 2, fontWeight: 600, textTransform: 'none' }}>+ Add New Page</Button>
      </Box>
      <Paper sx={{ borderRadius: 3, p: 2 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ background: '#fafbfc' }}>
                <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>Page</TableCell>
                <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>Linked Videos</TableCell>
                <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>A/B Testing</TableCell>
                <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pages
                .filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
                .map((page) => (
                <TableRow key={page.id} hover sx={{ verticalAlign: 'middle' }}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {editingPageId === page.id ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Box>
                            <TextField
                              value={editingPageName}
                              onChange={e => { setEditingPageName(e.target.value); setEditPageError(''); }}
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
                          </Box>
                          <IconButton color="primary" onClick={() => handleEditPageSave(page)} disabled={!!editPageError}><CheckIcon /></IconButton>
                          <IconButton color="error" onClick={handleEditPageCancel}><CloseIcon /></IconButton>
                        </Box>
                      ) : (
                        <Typography fontWeight={600}>{page.name}</Typography>
                      )}
                      <Tooltip title="Open page" arrow>
                        <IconButton size="small" href={`//${page.url}`} target="_blank">
                          <OpenInNewIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit page" arrow>
                        <IconButton size="small" onClick={() => handleEditPage(page)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={videos.filter(v => (v.connectedPages || []).some(cp => normalizeUrl(cp.url) === normalizeUrl(page.url))).length}
                      color="primary"
                      size="small"
                      sx={{ fontWeight: 700, mr: 1 }}
                    />
                    <Button
                      size="small"
                      endIcon={<ArrowDropDownIcon />}
                      sx={{ textTransform: 'none', color: 'primary.main', fontWeight: 600 }}
                    >
                      Videos
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Typography>{page.abTesting}</Typography>
                  </TableCell>
                  <TableCell>
                    {/* <Button
                      variant="outlined"
                      size="small"
                      sx={{ textTransform: 'none', fontWeight: 600, mr: 1 }}
                      onClick={() => handleOpenDrawer(page)}
                    >
                      Manage Page
                    </Button> */}
                    <Button
                      variant="outlined"
                      size="small"
                      sx={{ textTransform: 'none', fontWeight: 600, mr: 1 }}
                    >
                      Share URL
                    </Button>
                    <IconButton color="error" onClick={() => handleDelete(page.id)}>
                      <DeleteIcon />
                    </IconButton>
                    <Button
                      variant="outlined"
                      size="small"
                      sx={{ textTransform: 'none', fontWeight: 600, ml: 1 }}
                      endIcon={<ArrowDropDownIcon />}
                      onClick={e => handleMenuOpen(e, page.id)}
                    >
                      Manage Page
                    </Button>
                    <Menu
                      anchorEl={menuAnchor}
                      open={Boolean(menuAnchor) && menuPageId === page.id}
                      onClose={handleMenuClose}
                    >
                      <MenuItem onClick={() => { navigate('/customization'); handleMenuClose(); }}>Customize Page</MenuItem>
                      <MenuItem onClick={() => { handleOpenDrawer(page); handleMenuClose(); }}>Connect Videos</MenuItem>
                      <Tooltip title="Ve vývoji" arrow placement="left">
                        <span>
                          <MenuItem disabled sx={{ color: '#bdbdbd' }}>Set up Creative A/B Test</MenuItem>
                        </span>
                      </Tooltip>
                    </Menu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Drawer pro správu stránky */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={handleCloseDrawer}
        PaperProps={{ sx: { width: 600, maxWidth: '100vw', p: 0 } }}
      >
        {selectedPage && (
          <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', p: 2, borderBottom: '1px solid #eee' }}>
              <Typography fontWeight={600} fontSize={24} sx={{ flex: 1 }}>{selectedPage.name}</Typography>
              <IconButton onClick={handleCloseDrawer}>
                <CloseIcon />
              </IconButton>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ px: 3, pt: 1, pb: 2 }}>
              Last modified 20 hours ago
            </Typography>
            <Box sx={{ display: 'flex', gap: 4, px: 3, pb: 3 }}>
              {/* Page Details */}
              <Box sx={{ flex: 1 }}>
                <Typography fontWeight={600} sx={{ mb: 1 }}>Page Details</Typography>
                <TextField
                  label="Url"
                  value={selectedPage.url}
                  size="small"
                  fullWidth
                  sx={{ mb: 3 }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <LinkIcon fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                />
                <Button variant="outlined" color="error" fullWidth sx={{ mt: 8, borderRadius: 2 }}>
                  Delete Page
                </Button>
              </Box>
              {/* Connect Videos */}
              <Box sx={{ flex: 1 }}>
                <Typography fontWeight={600} sx={{ mb: 1 }}>Connect Videos</Typography>
                <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                  <InputLabel>Select video to connect</InputLabel>
                  <Select
                    value={videoToAdd}
                    label="Select video to connect"
                    onChange={e => setVideoToAdd(e.target.value)}
                  >
                    <MenuItem value=""><em>None</em></MenuItem>
                    {videos.filter(v => !selectedPage.videos.some(vid => vid.id === v.id)).map(video => (
                      <MenuItem key={video.id} value={video.id}>{video.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Button
                  variant="contained"
                  size="small"
                  sx={{ mb: 2, borderRadius: 2, textTransform: 'none' }}
                  onClick={handleAddVideo}
                  disabled={!videoToAdd}
                >
                  Add Video
                </Button>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Note: Unlinking video will also disable Page A/B test functionality, if it's enabled.
                </Typography>
                <Paper variant="outlined" sx={{ borderRadius: 2, mt: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', px: 2, py: 1, bgcolor: '#fafbfc', borderBottom: '1px solid #eee' }}>
                    <Typography variant="caption" sx={{ flex: 1, fontWeight: 700 }}>VIDEO ORDER</Typography>
                    <Typography variant="caption" sx={{ fontWeight: 700 }}>ACTION</Typography>
                  </Box>
                  {selectedPage.videos.map((video, idx) => (
                    <Box key={video.id} sx={{ display: 'flex', alignItems: 'center', px: 2, py: 1, borderBottom: idx === selectedPage.videos.length - 1 ? 'none' : '1px solid #eee' }}>
                      <Avatar src={video.thumbnail} variant="rounded" sx={{ width: 40, height: 28, mr: 2 }} />
                      <Box sx={{ flex: 1 }}>
                        <Typography fontWeight={500}>{video.name}</Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13 }}>
                          Last modified {video.modified}
                        </Typography>
                      </Box>
                      <IconButton color="error" size="small" onClick={() => handleRemoveVideo(video.id)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  ))}
                </Paper>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', px: 3, pb: 3 }}>
              <Button variant="contained" sx={{ borderRadius: 2, textTransform: 'none' }}>Save Changes</Button>
            </Box>
          </Box>
        )}
      </Drawer>
    </Box>
  );
}

export default Pages; 