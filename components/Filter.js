import { Container, Grid, TextField,FormControl,InputLabel,Select,MenuItem,Typography,ListItemButton,ListItem,FormControlLabel,Checkbox, Paper,List ,ListItemSecondaryAction, IconButton, ListItemText,ListSubheader, ListItemIcon, Accordion, AccordionSummary, AccordionDetails, Button} from '@mui/material';
import { ExpandMore,Clear } from '@mui/icons-material';
import { useState } from 'react';

const Filter = (props) => {
    const [expandFilter,setExpandFilter] = useState(false);

    return (
        <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel id="building-label">Building</InputLabel>
            <Select
              labelId="building-label"
              id="building"
              multiple
              value={props.filter.buildings}
              onChange={(event) => props.updateFilter('buildings',event.target.value)}
              renderValue={(selected) => selected.join(', ')}
            >
              <MenuItem key="clear-all" onClick={() => props.updateFilter('buildings',[])}>
                Clear all
              </MenuItem>
              {props.buildings.map((building) => (
                <MenuItem key={building.short} value={building.building}>
                  {building.building} ({building.short})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Date"
            variant="outlined"
            type="date"
            value={props.selectedDate}
            onChange={(event) => props.setSelectedDate(event.target.value)}
          />
        </Grid>
        
        <Grid item xs={12} sm = {2}>
          <InputLabel id="specificTime-label">Specific time</InputLabel>
          <Checkbox
            checked={props.filter.useTime}
            onChange={(event) => props.updateFilter('useTime',event.target.checked)}
            labelId="specificTime-label"
          />
          
        </Grid>
        <Grid item xs = {12} sm={5}>
            <TextField
              fullWidth
              disabled={!props.filter.useTime}
              label="Start time"
              ampm={false}
              variant="outlined"
              type="time"
              value={props.filter.startTime}
              onChange={(event) => props.updateFilter('startTime',event.target.value)}
            />
        </Grid>
        <Grid item xs = {12} sm={5}>
            <TextField
              fullWidth
              disabled={!props.filter.useTime}
              label="End time"
              ampm={false}
              variant="outlined"
              type="time"
              value={props.filter.endTime}
              onChange={(event) => props.updateFilter('endTime',event.target.value)}
            />
        </Grid>
        
      </Grid>
    );
  };
  
  export default Filter;