import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchOptionsWithJwtToken } from '../common/auth';
import '../styling/DateList.css';

function DateList() {
    const [dateList, setDateList] = useState([]);
    const [filter, setFilter] = useState('all'); // State to manage the filter (all, requested, owned)

    // Fetch the list of date events based on filter
    const fetchDateList = (selectedFilter) => {
        let options = fetchOptionsWithJwtToken();
        fetch(`http://localhost:8080/dates?filter=${selectedFilter}`, options)
            .then((response) => response.json())
            .then((data) => {
                if (data.dateEventData) {
                    setDateList(data.dateEventData);
                } else {
                    console.log("Unexpected response format:", data);
                }
            })
            .catch((error) => console.log(error));
    };

    // Fetch the list of dates when the component mounts and whenever the filter changes
    useEffect(() => {
        fetchDateList(filter);
    }, [filter]);

    // Handle filter change (e.g., user selects a different filter)
    const handleFilterChange = (event) => {
        setFilter(event.target.value);
    };

    return (
        <div className="date-list-container">
            <Link to="/" className="back-link">Back to Home</Link>
            <hr />
            <h1>Date List</h1>

            {/* Filter options */}
            <div className="filter-options">
                <label>
                    <input
                        type="radio"
                        value="all"
                        checked={filter === "all"}
                        onChange={handleFilterChange}
                    />
                    All
                </label>
                <label>
                    <input
                        type="radio"
                        value="requested"
                        checked={filter === "requested"}
                        onChange={handleFilterChange}
                    />
                    Requested
                </label>
                <label>
                    <input
                        type="radio"
                        value="owned"
                        checked={filter === "owned"}
                        onChange={handleFilterChange}
                    />
                    Owned
                </label>
            </div>

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
