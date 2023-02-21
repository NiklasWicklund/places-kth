import { promises as fs } from 'fs';
import roomData from './rooms-campus.json'

export default async function handler(req, res) {
    const {date} = req.query;

    const startTime = '07:00:00'
    const endTime = '21:00:00'
    const startDateTime = new Date(`${date}T${startTime}`);
    const endDateTime = new Date(`${date}T${endTime}`);
    if (isNaN(startDateTime) || isNaN(endDateTime) || startDateTime >= endDateTime) {
        return res.status(400).json({ error: 'Invalid date or time parameters' });
    }

    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    

    const stringStart = startDateTime.toLocaleString('sv-SE', { timeZone }).replace(' ','T');
    const stringEnd = endDateTime.toLocaleString('sv-SE', { timeZone }).replace(' ','T');

    const apiUrl = `http://www.kth.se/api/timetable/v1/reservations/search?start=${stringStart}&end=${stringEnd}`;
    try {
        
        // Make a GET request to the API URL using the `fetch` function
        const response = await fetch(apiUrl);

        if (!response.ok) {
        // Handle non-200 HTTP responses as errors
        const error = await response.text();
        throw new Error(`HTTP error ${response.status}: ${error}`);
        }

        // Parse the JSON response from the API and return the data to the client
        const data = await response.json();

        // Assume the bookings are stored in an array called "bookings"
        const availableTimeSlots = {};

        // Initialize the available time slots object
        data.forEach(booking => {
        booking.locations.forEach(location => {
            const roomId = location.id;
            if (!availableTimeSlots[roomId]) {
            availableTimeSlots[roomId] = [{start: "07:00:00", end: "21:00:00"}];
            }
        });
        });

        // Remove booked time slots from the available time slots object
        data.forEach(booking => {
        booking.locations.forEach(location => {
            const roomId = location.id;
            const startTime = new Date(booking.start).toLocaleTimeString("sv-SE", {timeZone: "Europe/Stockholm"});
            const endTime = new Date(booking.end).toLocaleTimeString("sv-SE", {timeZone: "Europe/Stockholm"});
            const newTimeSlots = [];
            availableTimeSlots[roomId].forEach(timeSlot => {
            if (timeSlot.end <= startTime || timeSlot.start >= endTime) {
                // Time slot is available, add it to the new array
                newTimeSlots.push(timeSlot);
            } else {
                // Time slot overlaps with booking, split it into two or three parts
                if (timeSlot.start < startTime) {
                newTimeSlots.push({start: timeSlot.start, end: startTime});
                }
                if (timeSlot.end > endTime) {
                newTimeSlots.push({start: endTime, end: timeSlot.end});
                }
            }
            });
            availableTimeSlots[roomId] = newTimeSlots;
        });
        });

        // At this point, availableTimeSlots contains the available time slots for each room

        // Create a new object that maps room IDs to their corresponding room data
        roomData.forEach(room => {
            const roomId = room.id;
            const timeSlots = availableTimeSlots[roomId];
            
            if (timeSlots) {
              room.timeSlots = timeSlots;
            } else {
              // If the room is not in the availableTimeSlots object, assume it's free the whole day
              room.timeSlots = [{ start: "07:00:00", end: "21:00:00" }];
            }
        });

        // Remove rooms if they aren't in the asked for in the api request.
        return res.status(200).json(roomData);
    } catch (error) {
        // Handle errors that occur during the API request or response parsing
        return res.status(500).json({ error: error.message, startDateTime: stringStart,endDateTime: stringEnd });
    }
}


