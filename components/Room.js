import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardHeader, CardContent, Typography, Accordion, AccordionSummary, AccordionDetails,IconButton} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

function Room({room}) {
  const websiteURL = 'https://www.kth.se/places/room/id/' + room.id;

  return (
        <Card>
          <CardHeader 
            title={room.name}
            action={
              <IconButton aria-label="website" href={websiteURL} target="_blank">
                <OpenInNewIcon />
              </IconButton>
            }
          />
          <CardContent>
            <Typography variant="subtitle" color="textSecondary" component="h2">
              {room.building}, Floor {room.floor}
            </Typography>
            {room.timeSlots.map(slot => (
                    <Typography 
                      key = {`Available from ${slot.start} to ${slot.end}`}
                      variant="body2" color="textSecondary" component="p"
                    >
                        {`Available from ${slot.start} to ${slot.end}`}
                    </Typography>))}
          </CardContent>
        </Card>
  );
}

export default Room;
