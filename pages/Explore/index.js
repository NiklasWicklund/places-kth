import styles from '../../styles/Explore.module.css'
import Room from '../../components/Room';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Grid, TextField,FormControl,InputLabel,Select,MenuItem,Typography,FormControlLabel,Checkbox} from '@mui/material';
import Loading from '../../components/Loading';
import Map from '../../components/Map';

function Explore() {

  const [selectedBuildings, setSelectedBuildings] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));
  const [selectedStartTime, setSelectedStartTime] = useState('07:00:00');
  const [selectedEndTime, setSelectedEndTime] = useState('21:00:00');
  const [rooms, setRooms] = useState([]);
  const [filteredRooms,setFilteredRooms] = useState([]);
  const [fetchingRooms,setFetchingRooms] = useState(false);
  const [fetchingBuildings,setFetchingBuildings] = useState(false);
  const [buildings,setBuildings] = useState([]);
  const [specificTime,setSpecificTime] = useState(false);

  const [selectedRoom,setSelectedRoom] = useState(null);

  useEffect(() => {
    setRooms([])
    setFetchingRooms(true);
    async function fetchData() {
      const response = await axios.get('../api/rooms', {
        params: {
          building: selectedBuildings.join(','),
          date: selectedDate,
          startTime: selectedStartTime,
          endTime: selectedEndTime,
        },
      });
      setFetchingRooms(false);
      setRooms(response.data);
    }
    fetchData();
  }, [selectedDate]);

  useEffect(() => {
    let result = []

    // Buildings
    if (selectedBuildings.length == 0){
      result = rooms;
      
    }else{
      result = rooms.filter(room => selectedBuildings.includes(room.building));
    }


    //Time
    if(specificTime){
      result = result.filter((room) => {
        const free = room.timeSlots.filter(
          (timeSlot) =>
            timeSlot.start <= selectedStartTime &&
            timeSlot.end >= selectedEndTime
        );
        return free.length > 0;
      });
    }
    
    
    setFilteredRooms(result);
  },[rooms,selectedBuildings,selectedStartTime,selectedEndTime,specificTime])



  useEffect(() => {
    setBuildings([])
    setFetchingBuildings(true);
    async function fetchData() {
      const response = await axios.get('../api/buildings');
      setFetchingBuildings(false);
      setBuildings(response.data);
    }
    fetchData();
  }, []);


  return (
    <div className={styles.main}>

    {fetchingBuildings ? <Loading /> :
      <Container maxWidth="md">
      <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel id="building-label">Building</InputLabel>
              <Select
                labelId="building-label"
                id="building"
                multiple
                value={selectedBuildings}
                onChange={(event) => setSelectedBuildings(event.target.value)}
                renderValue={(selected) => selected.join(', ')}
              >
                <MenuItem key="clear-all" onClick={() => setSelectedBuildings([])}>
                  Clear all
                </MenuItem>
                {buildings.map((building) => (
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
              value={selectedDate}
              onChange={(event) => setSelectedDate(event.target.value)}
            />
          </Grid>
          
          <Grid item xs={2}>
            <InputLabel id="specificTime-label">Specific time</InputLabel>
            <Checkbox
              checked={specificTime}
              onChange={(event) => setSpecificTime(event.target.checked)}
              labelId="specificTime-label"
            />
            
          </Grid>
          <Grid item xs={5}>
              <TextField
                fullWidth
                disabled={!specificTime}
                label="Start time"
                variant="outlined"
                type="time"
                value={selectedStartTime}
                onChange={(event) => setSelectedStartTime(event.target.value)}
              />
          </Grid>
          <Grid item xs={5}>
              <TextField
                fullWidth
                disabled={!specificTime}
                label="End time"
                variant="outlined"
                type="time"
                value={selectedEndTime}
                onChange={(event) => setSelectedEndTime(event.target.value)}
              />
          </Grid>
          
        </Grid>
        <Typography variant="subtitle1" color="textSecondary">
          {filteredRooms.length} available rooms
        </Typography>
          {/*fetchingRooms ? <Loading /> : 
          
          filteredRooms.map(room => 
          <Room key = {room.id} room = {room} />
          )*/}

      <Map rooms = {filteredRooms} setSelectedRoom={setSelectedRoom}/>
      {selectedRoom && <Room room={selectedRoom} />}
      </Container>

    }
    </div>
  );
}

export default Explore;