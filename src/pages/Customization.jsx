import { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Tabs,
  Tab,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  Divider,
  Grid,
  ToggleButton,
  ToggleButtonGroup,
  Slider,
  Checkbox,
  FormControlLabel,
  TextField,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { ChromePicker } from 'react-color';

const sections = [
  { label: 'Layout' },
  { label: 'Preview State' },
  { label: 'Open State' },
  { label: 'Closed State' },
  { label: 'Position' },
  { label: 'Colors' },
  { label: 'Text' },
];

function Customization() {
  const [tabValue, setTabValue] = useState(0);
  // oddělený stav pro Desktop a Mobile
  const [expandedDesktop, setExpandedDesktop] = useState('Layout');
  const [expandedMobile, setExpandedMobile] = useState('Layout');
  // Desktop stavy (pouze pro ukázku, můžeš rozšířit pro Mobile obdobně)
  const [playerStyleDesktop, setPlayerStyleDesktop] = useState('overlay');
  const [startingStateDesktop, setStartingStateDesktop] = useState('muted');
  const [orientationDesktop, setOrientationDesktop] = useState('portrait');
  const [sizeDesktop, setSizeDesktop] = useState(30);
  const [cornerDesktop, setCornerDesktop] = useState(0);
  const [addBorderDesktop, setAddBorderDesktop] = useState(false);
  const [borderColorDesktop, setBorderColorDesktop] = useState('#000000');
  // Mobile stavy (kopie pro mobile)
  const [playerStyleMobile, setPlayerStyleMobile] = useState('overlay');
  const [startingStateMobile, setStartingStateMobile] = useState('muted');
  const [orientationMobile, setOrientationMobile] = useState('portrait');
  const [sizeMobile, setSizeMobile] = useState(30);
  const [cornerMobile, setCornerMobile] = useState(0);
  const [addBorderMobile, setAddBorderMobile] = useState(false);
  const [borderColorMobile, setBorderColorMobile] = useState('#000000');

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleAccordionChangeDesktop = (panel) => (event, isExpanded) => {
    setExpandedDesktop(isExpanded ? panel : false);
  };
  const handleAccordionChangeMobile = (panel) => (event, isExpanded) => {
    setExpandedMobile(isExpanded ? panel : false);
  };

  // Helper pro vykreslení sekcí (používá props pro oddělení Desktop/Mobile)
  const renderSections = (prefix) => {
    const expanded = prefix === 'desktop' ? expandedDesktop : expandedMobile;
    const handleAccordionChange = prefix === 'desktop' ? handleAccordionChangeDesktop : handleAccordionChangeMobile;
    const playerStyle = prefix === 'desktop' ? playerStyleDesktop : playerStyleMobile;
    const setPlayerStyle = prefix === 'desktop' ? setPlayerStyleDesktop : setPlayerStyleMobile;
    const startingState = prefix === 'desktop' ? startingStateDesktop : startingStateMobile;
    const setStartingState = prefix === 'desktop' ? setStartingStateDesktop : setStartingStateMobile;
    const orientation = prefix === 'desktop' ? orientationDesktop : orientationMobile;
    const setOrientation = prefix === 'desktop' ? setOrientationDesktop : setOrientationMobile;
    const size = prefix === 'desktop' ? sizeDesktop : sizeMobile;
    const setSize = prefix === 'desktop' ? setSizeDesktop : setSizeMobile;
    const corner = prefix === 'desktop' ? cornerDesktop : cornerMobile;
    const setCorner = prefix === 'desktop' ? setCornerDesktop : setCornerMobile;
    const addBorder = prefix === 'desktop' ? addBorderDesktop : addBorderMobile;
    const setAddBorder = prefix === 'desktop' ? setAddBorderDesktop : setAddBorderMobile;
    const borderColor = prefix === 'desktop' ? borderColorDesktop : borderColorMobile;
    const setBorderColor = prefix === 'desktop' ? setBorderColorDesktop : setBorderColorMobile;
    return (
      <Box sx={{ p: 0 }}>
        {/* Layout sekce */}
        <Accordion
          expanded={expanded === 'Layout'}
          onChange={handleAccordionChange('Layout')}
          disableGutters
          square
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography fontWeight={600}>Layout</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography sx={{ mb: 1 }}>Player Style</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Box
                      onClick={() => setPlayerStyle('overlay')}
                      sx={{
                        border: playerStyle === 'overlay' ? '2px solid #1976d2' : '2px solid #e0e0e0',
                        borderRadius: 2,
                        p: 2,
                        cursor: 'pointer',
                        backgroundColor: playerStyle === 'overlay' ? 'rgba(25, 118, 210, 0.08)' : '#fafbfc',
                        textAlign: 'center',
                      }}
                    >
                      <Box sx={{ width: 40, height: 60, bgcolor: '#f5f5f5', mx: 'auto', mb: 1, borderRadius: 1, position: 'relative' }}>
                        <Box sx={{ width: 16, height: 16, bgcolor: '#1976d2', borderRadius: '50%', position: 'absolute', left: '50%', bottom: 8, transform: 'translateX(-50%)' }} />
                      </Box>
                      <Typography>Overlay</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box
                      sx={{
                        border: '2px solid #e0e0e0',
                        borderRadius: 2,
                        p: 2,
                        backgroundColor: '#f5f5f5',
                        color: '#bdbdbd',
                        textAlign: 'center',
                        cursor: 'not-allowed',
                        opacity: 0.7,
                      }}
                    >
                      <Box sx={{ width: 40, height: 60, bgcolor: '#f0f0f0', mx: 'auto', mb: 1, borderRadius: 1, position: 'relative' }}>
                        <Box sx={{ width: 32, height: 8, bgcolor: '#e0e0e0', borderRadius: 1, position: 'absolute', left: '50%', bottom: 8, transform: 'translateX(-50%)' }} />
                      </Box>
                      <Typography>Embedded</Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
        {/* Preview State sekce */}
        <Accordion
          expanded={expanded === 'Preview State'}
          onChange={handleAccordionChange('Preview State')}
          disableGutters
          square
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography fontWeight={600}>Preview State</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ mb: 2 }}>
              <Typography sx={{ mb: 1 }}>Starting State</Typography>
              <ToggleButtonGroup
                value={startingState}
                exclusive
                onChange={(_, v) => v && setStartingState(v)}
                sx={{ mb: 2 }}
              >
                <ToggleButton value="muted">Muted GIF</ToggleButton>
                <ToggleButton value="open">Open State</ToggleButton>
              </ToggleButtonGroup>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography sx={{ mb: 1 }}>Orientation</Typography>
              <ToggleButtonGroup
                value={orientation}
                exclusive
                onChange={(_, v) => v && setOrientation(v)}
                sx={{ mb: 2 }}
              >
                <ToggleButton value="portrait">Portrait/Landscape</ToggleButton>
                <ToggleButton value="square">Square/Circle</ToggleButton>
              </ToggleButtonGroup>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography sx={{ mb: 1 }}>Size</Typography>
              <Slider
                value={size}
                min={0}
                max={100}
                onChange={(_, v) => setSize(v)}
                sx={{ width: 180 }}
              />
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography sx={{ mb: 1 }}>Corner Style</Typography>
              <Slider
                value={corner}
                min={0}
                max={100}
                onChange={(_, v) => setCorner(v)}
                sx={{ width: 180 }}
              />
            </Box>
            <Box sx={{ mb: 2 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={addBorder}
                    onChange={e => setAddBorder(e.target.checked)}
                  />
                }
                label="Add Border"
              />
              {addBorder && (
                <TextField
                  type="color"
                  value={borderColor}
                  onChange={e => setBorderColor(e.target.value)}
                  size="small"
                  sx={{ width: 60, ml: 2, verticalAlign: 'middle' }}
                />
              )}
            </Box>
            <Box>
              <FormControlLabel
                control={<Checkbox disabled />} label="Include Border Padding" />
            </Box>
          </AccordionDetails>
        </Accordion>
        {/* Open State sekce */}
        <Accordion
          expanded={expanded === 'Open State'}
          onChange={handleAccordionChange('Open State')}
          disableGutters
          square
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography fontWeight={600}>Open State</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ mb: 2 }}>
              <Typography sx={{ mb: 1 }}>Open State</Typography>
              <ToggleButtonGroup
                value={''}
                exclusive
                sx={{ mb: 2 }}
              >
                <ToggleButton value="fullscreen">Full Screen</ToggleButton>
                <ToggleButton value="overlay" selected>Overlay</ToggleButton>
              </ToggleButtonGroup>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography sx={{ mb: 1 }}>Visible Videos (in Full Screen Mode)</Typography>
              <ToggleButtonGroup
                value={''}
                exclusive
                sx={{ mb: 2 }}
              >
                <ToggleButton value="all">All Videos</ToggleButton>
                <ToggleButton value="connected" selected>Connected Videos</ToggleButton>
              </ToggleButtonGroup>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography sx={{ mb: 1 }}>Size</Typography>
              <Slider
                value={30}
                min={0}
                max={100}
                sx={{ width: 180 }}
              />
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography sx={{ mb: 1 }}>Display Gander Branding</Typography>
              <ToggleButtonGroup value={''} exclusive sx={{ mb: 2 }}>
                <ToggleButton value="show" disabled>Show</ToggleButton>
                <ToggleButton value="hide" disabled>Hide</ToggleButton>
              </ToggleButtonGroup>
            </Box>
          </AccordionDetails>
        </Accordion>
        {/* Closed State sekce */}
        <Accordion
          expanded={expanded === 'Closed State'}
          onChange={handleAccordionChange('Closed State')}
          disableGutters
          square
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography fontWeight={600}>Closed State</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ mb: 2 }}>
              <Typography sx={{ mb: 1 }}>Corner Style</Typography>
              <Slider
                value={0}
                min={0}
                max={100}
                sx={{ width: 180 }}
              />
            </Box>
            <Box sx={{ mb: 2 }}>
              <FormControlLabel
                control={<Checkbox />}
                label="Add Border"
              />
              <TextField
                type="color"
                value="#000000"
                size="small"
                sx={{ width: 60, ml: 2, verticalAlign: 'middle' }}
              />
            </Box>
            <Box>
              <FormControlLabel
                control={<Checkbox disabled />} label="Include Border Padding" />
            </Box>
          </AccordionDetails>
        </Accordion>
        {/* Position sekce */}
        <Accordion
          expanded={expanded === 'Position'}
          onChange={handleAccordionChange('Position')}
          disableGutters
          square
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography fontWeight={600}>Position</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ mb: 2 }}>
              <Typography sx={{ mb: 1 }}>Horizontal Position</Typography>
              <Slider
                value={0}
                min={0}
                max={100}
                sx={{ width: 180 }}
              />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', width: 180 }}>
                <Typography variant="caption">Left</Typography>
                <Typography variant="caption">Right</Typography>
              </Box>
            </Box>
            <Box>
              <Typography sx={{ mb: 1 }}>Vertical Position</Typography>
              <Slider
                value={100}
                min={0}
                max={100}
                sx={{ width: 180 }}
              />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', width: 180 }}>
                <Typography variant="caption">Top</Typography>
                <Typography variant="caption">Bottom</Typography>
              </Box>
            </Box>
          </AccordionDetails>
        </Accordion>
        {/* Colors sekce */}
        <Accordion
          expanded={expanded === 'Colors'}
          onChange={handleAccordionChange('Colors')}
          disableGutters
          square
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography fontWeight={600}>Colors</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ mb: 2 }}>
              <Typography sx={{ mb: 1 }}>Text Color</Typography>
              <ChromePicker
                color={'#ffffff'}
                onChange={() => {}}
                disableAlpha={false}
                styles={{ default: { picker: { width: '100%' } } }}
              />
            </Box>
            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              <TextField label="Hex" value="FFFFFF" size="small" sx={{ width: 100 }} />
              <TextField label="R" value={255} size="small" sx={{ width: 70 }} />
              <TextField label="G" value={255} size="small" sx={{ width: 70 }} />
              <TextField label="B" value={255} size="small" sx={{ width: 70 }} />
            </Box>
          </AccordionDetails>
        </Accordion>
        {/* Text sekce */}
        <Accordion
          expanded={expanded === 'Text'}
          onChange={handleAccordionChange('Text')}
          disableGutters
          square
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography fontWeight={600}>Text</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ mb: 2 }}>
              <Typography sx={{ mb: 1 }}>Overlay Text</Typography>
              <TextField fullWidth value="See reviews" size="small" />
            </Box>
            <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography>Font Size</Typography>
              <TextField value={10} size="small" sx={{ width: 80, mx: 1 }} />
              <Typography>px</Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography sx={{ mb: 1 }}>Alignment</Typography>
              <ToggleButtonGroup value={"left"} exclusive>
                <ToggleButton value="left">Left</ToggleButton>
                <ToggleButton value="center">Center</ToggleButton>
                <ToggleButton value="right">Right</ToggleButton>
              </ToggleButtonGroup>
            </Box>
            <Box>
              <Typography sx={{ mb: 1 }}>Other Text</Typography>
              <FormControlLabel control={<Checkbox defaultChecked />} label="Show Video Duration" />
              <FormControlLabel control={<Checkbox />} label="Show Number of Views" />
            </Box>
          </AccordionDetails>
        </Accordion>
      </Box>
    );
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h4" gutterBottom>
        Přizpůsobení
      </Typography>
      <Paper sx={{ flex: 1, display: 'flex', minHeight: 600 }}>
        {/* Levý panel */}
        <Box sx={{ width: 320, borderRight: 1, borderColor: 'divider', p: 0 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
            sx={{ borderBottom: 1, borderColor: 'divider' }}
          >
            <Tab label="Desktop" />
            <Tab label="Mobile" />
          </Tabs>
          <Divider />
          {tabValue === 0 ? renderSections('desktop') : renderSections('mobile')}
        </Box>
        {/* Pravý panel */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', bgcolor: '#f7f8fa' }}>
          {tabValue === 0 ? (
            // Desktop náhled
            <Paper elevation={2} sx={{ width: '80%', minHeight: 400, display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}>
              <Box sx={{ width: '90%', height: 320, bgcolor: '#fff', borderRadius: 2, boxShadow: 1, display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end', p: 2 }}>
                <Box sx={{ width: 80, height: 110, bgcolor: '#e3e3e3', borderRadius: 2, boxShadow: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                  <Box sx={{ width: 60, height: 60, bgcolor: '#bdbdbd', borderRadius: '50%', mb: 1 }} />
                  <Typography variant="caption" sx={{ position: 'absolute', bottom: 8, left: 0, right: 0, textAlign: 'center' }}>00:18</Typography>
                </Box>
              </Box>
            </Paper>
          ) : (
            // Mobile náhled
            <Paper elevation={2} sx={{ width: 320, minHeight: 600, borderRadius: 4, overflow: 'hidden', position: 'relative', bgcolor: '#fff', display: 'flex', flexDirection: 'column' }}>
              {/* Horní lišta */}
              <Box sx={{ height: 40, bgcolor: '#fafafa', borderBottom: '1px solid #eee', display: 'flex', alignItems: 'center', px: 2, justifyContent: 'space-between' }}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>9:41</Typography>
                <Typography variant="body2" sx={{ color: '#888' }}><span role="img" aria-label="lock">🔒</span> google.com</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Box sx={{ width: 18, height: 8, bgcolor: '#bbb', borderRadius: 2 }} />
                  <Box sx={{ width: 6, height: 6, bgcolor: '#bbb', borderRadius: '50%' }} />
                  <Box sx={{ width: 12, height: 8, bgcolor: '#bbb', borderRadius: 2 }} />
                </Box>
              </Box>
              {/* Tělo mobilu */}
              <Box sx={{ flex: 1, position: 'relative', bgcolor: '#f7f8fa' }}>
                {/* Video vpravo dole */}
                <Box sx={{ position: 'absolute', right: 24, bottom: 24 }}>
                  <Box sx={{ width: 80, height: 110, bgcolor: '#e3e3e3', borderRadius: 2, boxShadow: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                    <Box sx={{ width: 60, height: 60, bgcolor: '#bdbdbd', borderRadius: '50%', mb: 1 }} />
                    <Typography variant="caption" sx={{ position: 'absolute', bottom: 8, left: 0, right: 0, textAlign: 'center' }}>00:18</Typography>
                  </Box>
                </Box>
              </Box>
            </Paper>
          )}
        </Box>
      </Paper>
      {/* Spodní tlačítka */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, gap: 2 }}>
        <Button variant="outlined">Discard</Button>
        <Button variant="contained">Save Changes</Button>
      </Box>
    </Box>
  );
}

export default Customization; 