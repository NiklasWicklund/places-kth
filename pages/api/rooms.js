import { promises as fs } from 'fs';
import roomData from './rooms-campus.json'
//Import time zone conversion fro date-fns
import { formatInTimeZone } from 'date-fns-tz';

export default async function handler(req, res) {
    const {date} = req.query;

    const startTime = '08:00:00'
    const endTime = '21:00:00'

    var unformattedStart = new Date(date + 'T' + '08:00:00')
    var unformattedEnd = new Date(date + 'T' + '21:00:00')

    
    if (isNaN(unformattedStart) || isNaN(unformattedEnd) || unformattedStart >= unformattedEnd) {
        return res.status(400).json({ error: 'Invalid date or time parameters' });
    }
    console.log("Okey")
    const ISOStart = date + 'T' + '08:00:00'
    const ISOEnd = date + 'T' + '21:00:00'
    const temp_test = formatInTimeZone(ISOStart, 'Europe/Stockholm', 'yyyy-MM-dd HH:mm:ssXXX').replace(' ', 'T')
    const temp_test_date = new Date(temp_test)
    const startDateTime = new Date(formatInTimeZone(ISOStart, 'Europe/Stockholm', 'yyyy-MM-dd HH:mm:ssXXX').replace(' ', 'T'))
    const endDateTime = new Date(formatInTimeZone(ISOEnd, 'Europe/Stockholm', 'yyyy-MM-dd HH:mm:ssXXX').replace(' ', 'T'))
    console.log(temp_test)
    console.log(temp_test_date)


    const stringStart = date + 'T' + startTime;
    const stringEnd = date + 'T' + endTime;

    const apiUrl = `https://api.kth.se/api/timetable/v1/reservations/search?start=${stringStart}&end=${stringEnd}`;

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
            availableTimeSlots[roomId] = [{start: startDateTime, end: endDateTime}];
            }
        });
        });
        
        //toLocaleTimeString("sv-SE", {timeZone: "Europe/Stockholm"});
        // Remove booked time slots from the available time slots object
        data.forEach(booking => {
        booking.locations.forEach(location => {
            const roomId = location.id;
            const ISOStart = date + 'T' + booking.start
            const ISOEnd = date + 'T' + booking.end
            const startTime = new Date(formatInTimeZone(ISOStart, 'Europe/Stockholm', 'yyyy-MM-dd HH:mm:ssXXX').replace(' ', 'T'))
            const endTime = new Date(formatInTimeZone(ISOEnd, 'Europe/Stockholm', 'yyyy-MM-dd HH:mm:ssXXX').replace(' ', 'T'))
            const newTimeSlots = [];
            availableTimeSlots[roomId].forEach(timeSlot => {
            if (timeSlot.end.getTime() <= startTime.getTime() || timeSlot.start.getTime() >= endTime.getTime()) {
                // Time slot is available, add it to the new array
                newTimeSlots.push(timeSlot);
            } else {
                // Time slot overlaps with booking, split it into two or three parts
                if (timeSlot.start.getTime() < startTime.getTime()) {
                newTimeSlots.push({start: timeSlot.start, end: startTime});
                }
                if (timeSlot.end.getTime() > endTime.getTime()) {
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
              room.timeSlots = [{ start: startDateTime, end: endDateTime }];
            }
        });

        // Remove rooms if they aren't in the asked for in the api request.
        return res.status(200).json([temp_test,temp_test_date,roomData]);
    } catch (error) {
        // Handle errors that occur during the API request or response parsing
        return res.status(500).json({ error: error.message, startDateTime: stringStart,endDateTime: stringEnd });
    }
}


