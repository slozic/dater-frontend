import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchOptionsWithJwtToken } from '../common/auth'
import '../styling/DateList.css'

function MyDateList() {
    const [datesICreated, setDatesICreated] = useState([]);
    const [datesIRequested, setDatesIRequested] = useState([]);

    // Fetch the list of date events on component mount
    useEffect(() => {
        let options = fetchOptionsWithJwtToken();
        fetch("http://localhost:8080/dates/user/date", options)
            .then((response) => response.json())
            .then((data) => {
                setDatesICreated(data.filter(date => date.dateCreator));
                setDatesIRequested(data.filter(date => !date.dateCreator));
            })
            .catch((error) => console.log(error));
    }, []);

    return (
        <div className="date-list-container">
            <Link to="/" className="back-link">Back to Home</Link>
            <hr />
            <h1>My dates</h1>

            <div className="dates-section">
                <h2>Dates I created</h2>
                <ul className="date-list">
                    {datesICreated.map((date) => (
                        <Link to={`/my-dates/${date.id}`} key={date.id} className="date-link">
                            <li className="date-item">
                                <h2>{date.title}</h2>
                                <p>{date.location}</p>
                            </li>
                        </Link>
                    ))}
                </ul>
            </div>

            <div className="dates-section">
                <h2>Dates I requested to join</h2>
                <ul className="date-list">
                    {datesIRequested.map((date) => (
                        <Link to={`/dates/${date.id}`} key={date.id} className="date-link">
                            <li className="date-item">
                                <h2>{date.title}</h2>
                                <p>{date.location}</p>
                            </li>
                        </Link>
                    ))}
                </ul>
            </div>

            <Link to="/new-date" className="add-new-date">Add New Date</Link>
        </div>
    );
}

export default MyDateList;
