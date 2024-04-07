
import Head from 'next/head';
import styles from '../styles/Explore.module.css'
import Room from '../components/Room';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Grid, TextField,FormControl,InputLabel,Select,MenuItem,Typography,ListItemButton,ListItem,FormControlLabel,Checkbox, Paper,List ,ListItemSecondaryAction, IconButton, ListItemText,ListSubheader, ListItemIcon, Accordion, AccordionSummary, AccordionDetails, Button} from '@mui/material';
import Loading from '../components/Loading';
import Map from '../components/Map';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { fontWeight } from '@mui/system';
import { ExpandMore,Clear } from '@mui/icons-material';
import Filter from '../components/Filter';
function Home() {

  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));
  const [rooms, setRooms] = useState([]);
  const [filteredRooms,setFilteredRooms] = useState([]);
  const [fetchingRooms,setFetchingRooms] = useState(false);
  const [fetchingBuildings,setFetchingBuildings] = useState(false);
  const [buildings,setBuildings] = useState([]);

  const [roomsByBuilding,setRoomsByBuilding] = useState(null);

  const [filter,setFilter] = useState({
    startTime: '08:00:00',
    endTime: '21:00:00',
    useTime: false,
    buildings: [],
    query: ''
  })

  const updateFilter = (key,value) => {
    setFilter(prev => ({
      ...prev,
      [key]:value
    }))
  }
  useEffect(() => {
    setRooms([])
    setFetchingRooms(true);
    async function fetchData() {
      const response = await axios.get('../api/rooms', {
        params: {
          date: selectedDate
        },
      });
      
      console.log(response.data)
      setFetchingRooms(false);
      setRooms(response.data);
    }
    fetchData();
  }, [selectedDate]);

  useEffect(() => {
    let result = []

    // Buildings
    if (filter.buildings.length == 0){
      result = rooms;
      
    }else{
      result = rooms.filter(room => filter.buildings.includes(room.building));
    }


    //Time
    if(filter.useTime){
      result = result.filter((room) => {
        const free = room.timeSlots.filter(
          (timeSlot) =>
            timeSlot.start <= filter.startTime &&
            timeSlot.end >= filter.endTime
        );
        return free.length > 0;
      });
    }
    
    if(filter.query.length > 0){
      result = result.filter((room) => 
        room.name.toLowerCase().includes(filter.query.toLowerCase())
        || room.building.includes(filter.query.toLowerCase()))
    }
    result = result.sort((r1,r2) => r1.building > r2.building)
    setFilteredRooms(result);
  },[rooms,filter])


  useEffect(()=>{
    let res = buildings.map((building) => {
      const buildingRooms = filteredRooms.filter((room) => room.building === building.building);
      return {
        ...building,
        rooms: buildingRooms
      };
    });
    res = res.filter((building) => building.rooms.length > 0)
    setRoomsByBuilding(res);
  },[filteredRooms,buildings])

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

  const toHourMinute = (date) => {
    return date.slice(0,5)
  }


  return (<>
  
    <Head>
        <title>KTH places</title>
        <meta name="description" content="Look up free rooms at KTH Campus" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
    </Head>
    <div className={styles.main}>

    {fetchingBuildings ? <Loading /> :
      <Container >
        <Filter buildings={buildings} updateFilter={updateFilter} filter={filter} setSelectedDate={setSelectedDate} selectedDate = {selectedDate}/>
        <Grid container spacing={3}>
          <Grid item xs = {12} >
            <Typography variant="subtitle1" color="textSecondary">
              Showing {filteredRooms.length} rooms
            </Typography>
          </Grid>
          <Grid item sm = {12} md={8}>
            <Map rooms = {filteredRooms} roomsByBuildings={roomsByBuilding}/>
          </Grid>
          <Grid item sm = {12} md={4}>
            <Paper style={{maxHeight: '60vh', overflow: 'auto'}}>
              <List>
                {roomsByBuilding?.map((building) => (
                  <li key={building.short}>
                    <ul>
                      <ListSubheader 
                        key={building.short}
                        sx={{
                          fontSize: '1.2rem',
                          fontWeight: 'bold',
                          backgroundColor: '#F0F0F0'
                        }}
                      >
                        {`${building.building}`}
                      </ListSubheader>
                      {building.rooms.map((room) => (
                        <ListItemButton key={room.id} onClick={() => window.open('https://www.kth.se/places/room/id/' + room.id,'_blank')}>
                          <ListItemText 
                            primary={room.name}
                            secondary={room.timeSlots.length === 0 
                              ? "No available times" 
                              : room.timeSlots.map(slot => (
                                  <Typography 
                                    key={`${room.name}${slot.start}-${slot.end}`}
                                    variant="body2" color="textSecondary" component="p"
                                  >
                                      {`${toHourMinute(slot.start)}-${toHourMinute(slot.end)}`}
                                  </Typography>
                                ))}
                          />
                          <ListItemSecondaryAction>
                            <OpenInNewIcon/>
                          </ListItemSecondaryAction>
                          
                        </ListItemButton>
                      ))}
                    </ul>
                  </li>
                ))}
              </List>
            </Paper>
          
          </Grid>
          
        </Grid>
        {fetchingRooms && <Loading />}
        
      </Container>
      

    }
    </div>
    </>
  );
}

export default Home;
