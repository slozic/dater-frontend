import React, { useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Home from "./components/Home";
import DateList from './components/DateList';
import DateForm from './components/DateForm';
import DateDetails from './components/DateDetails';
import DateEvent from './components/DateEvent';
import Login from "./components/Login";
import Registration from "./components/Registration";
import Profile from "./components/Profile";
import MyDateList from "./components/MyDateList";
import MyDateDetails from "./components/MyDateDetails";

// Custom fetch wrapper with token handling
const authenticatedFetch = async (url, options) => {
    const token = localStorage.getItem("token");
    options = options || {};
    options.withCredentials = true;
    options.credentials = 'include';
    options.headers = options.headers || new Headers(); // Ensure headers is defined
    if (token) {
        options.headers.Authorization = `Bearer ${token}`;
    }
    const response = await fetch(url, options);

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
    }

    return response.json();
};

function App() {
    const [isLoading, setIsLoading] = useState(true);
    const location = useLocation();

    useEffect(() => {

        // Check if the token is available in the local storage
        const token = localStorage.getItem("token");
        if (token || location.pathname === "/login") {
            setIsLoading(false);
            // Set the fetch function to the authenticatedFetch wrapper
            //window.fetch = authenticatedFetch;
        } else {
            setIsLoading(true);
        }
    }, [location]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <Routes>
                <Route exact path="/" element={<Home />} />
                <Route exact path="/dates" element={<DateList />} />
                <Route exact path="/my-dates" element={<MyDateList />} />
                <Route exact path="/my-dates/:id" element={<MyDateDetails />} />
                <Route exact path="/new-date" element={<DateForm />} />
                <Route exact path="/dates/:id" element={<DateDetails />} />
                <Route exact path="/dates/:id/edit" element={<DateForm />} />
                <Route exact path="/dates/:id/delete" element={<DateEvent />} />
                <Route exact path="/login" element={<Login />} />
                <Route exact path="/registration" element={<Registration />} />
                <Route exact path="/profile" element={<Profile />} />
            </Routes>
        </div>
    );
}

export default App;
