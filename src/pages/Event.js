import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom'; 
import { FaBookmark } from 'react-icons/fa';  // Importing the bookmark icon

function EventPage() {
  const { eventName, eventDate } = useParams(); // get URL parameters
  const [event, setEvent] = useState(null); // store the event object
  const [loading, setLoading] = useState(true); // handle loading state
  const [error, setError] = useState(null); // handle any fetch errors
  const [isSaved, setIsSaved] = useState(false);  // State for saving the event
  const [buttonText, setButtonText] = useState('Save Event');  // Track the button text

  useEffect(() => {
    // Fetch the events data from the JSON file
    fetch(`${process.env.PUBLIC_URL}/events-mock-data.json`) // Change the path accordingly
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to fetch event data. Error: ${response.status} ${response.statusText}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log('Data fetched:' ,data); // Check the fetched data structure
      const formattedEventName = decodeURIComponent(eventName).replace(/-/g, ' ');

      const foundEvent = data.events.find(
        (e) => e.eventName.toLowerCase() === formattedEventName.toLowerCase()
      );


        if (foundEvent) {
          // Find the event detail that matches the eventDate
          const foundEventDetail = foundEvent.eventDetails.find(
            (detail) => detail.date === eventDate
          );

          // If we found both the event and the event detail, update the state
          if (foundEventDetail) {
            setEvent({
              ...foundEvent,
              date: foundEventDetail.date,
              time: foundEventDetail.time,
              ticketPrices: foundEventDetail.ticketPrices,
              description: foundEvent.description,
            });
            console.log('Description:', foundEvent.description); // Log the description
          } else {
            setError('Event details not found for the specified date.');
          }
        } else {
          setError('Event not found.');
        }

        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setError('Error fetching event data.');
        setLoading(false);
      });
  }, [eventName, eventDate]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  // Handle save button click
  const handleSaveClick = () => {
    setIsSaved(!isSaved);
    setButtonText(isSaved ? 'Save Event' : 'Saved');  // Toggle between "Save Event" and "Saved"
  };

  // Handle mouse hover over the button
  const handleMouseEnter = () => {
    if (isSaved) {
      setButtonText('Unsave');  // Change to "Unsave" when hovering over a saved event
    }
  };

  // Handle mouse leaving the button
  const handleMouseLeave = () => {
    if (isSaved) {
      setButtonText('Saved');  // Change back to "Saved" when the mouse leaves the button
    } else {
      setButtonText('Save Event');  // Change back to "Save Event" when the event is not saved
    }
  };

  return (
    <div className="event-page">
      
      <h1 style={{ textTransform: 'capitalize', textAlign: 'center' }}>
        {event.eventName.replace(/-/g, ' ')}
      </h1>
      <h3>Description:</h3>
      <p>{event.description}</p>

      <h3>Date:</h3>
      <p>{event.date}</p>

      <h3>Time:</h3>
      <p>{event.time}</p>
      <h3>Ticket Prices:</h3>

      <ul>
        <li>Box: ${event.ticketPrices.box}</li>
        <li>Orchestra: ${event.ticketPrices.orchestra}</li>
        <li>Main Floor: ${event.ticketPrices.mainFloor}</li>
        <li>Balcony: ${event.ticketPrices.balcony}</li>
      </ul>

      <div style = {{ display: 'flex', justifyContent: 'center', gap: '20px'}}>
      <Link to={`/Cart/${eventName}/${eventDate}`}>
      <button 
          style = {{
            display: 'block',
            padding: '15px 30px',
            fontSize: '20px',
            fontWeight: 'bold',
            backgroundColor: '#FF6700',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          Go Back
        </button>
        </Link>

        <Link to = {`/Tickets/${eventName}/${eventDate}`}>
        <button 
          style = {{
            display: 'block',
            padding: '15px 30px',
            fontSize: '20px',
            fontWeight: 'bold',
            backgroundColor: '#FF6700',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          Buy Tickets!
        </button>
        </Link>

         {/* Save For Later button */}
         <button
            className="save-event-button"
            onClick={handleSaveClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <FaBookmark className={`save-icon ${isSaved ? 'saved' : 'unsaved'}`} />
            {buttonText}
          </button>
      </div>
    </div>

  );
}

export default EventPage;