import React from 'react';
import { Link } from 'react-router-dom';
import '../styling/DateEvent.css'

function DateEvent(props) {
    const { id, title, location, scheduled_time } = props.date;

    return (
        <div>
            <h3>{title}</h3>
            <p>{location}</p>
            <p>{scheduled_time}</p>
            <Link to={`/dates/${id}`}>View Details</Link>
        </div>
    );
}

export default DateEvent;
