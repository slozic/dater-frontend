import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchOptionsWithJwtToken } from '../common/auth'
import '../styling/DateList.css'

function DateList() {
    const [dateList, setDateList] = useState([]);

    // Fetch the list of date events on component mount
    useEffect(() => {
        let options = fetchOptionsWithJwtToken();
        fetch("http://localhost:8080/dates", options)
            .then((response) => response.json())
            .then((data) => setDateList(data))
            .catch((error) => console.log(error));
    }, []);

    return (
        <div className="date-list-container">
            <Link to="/" className="back-link">Back to Home</Link>
            <hr />
            <h1>Date List</h1>
            <ul className="date-list">
                {dateList.map((date) => (
                    <Link to={`/dates/${date.id}`} key={date.id} className="date-link">
                        <li className="date-item">
                            <h2>{date.title}</h2>
                            <p>{date.location}</p>
                        </li>
                    </Link>
                ))}
            </ul>
            <Link to="/new-date" className="add-new-date">Add New Date</Link>
        </div>
    );
}

export default DateList;
