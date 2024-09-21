import { Routes, Route } from 'react-router-dom';
import Home from "./components/Home";
import DateList from './components/DateList';
import DateForm from './components/DateForm';
import DateDetails from './components/DateDetails';
import DateEvent from './components/DateEvent';
import Login from "./components/Login";
import Registration from "./components/Registration";
import Profile from "./components/Profile";
import AttendeeProfile from "./components/AttendeeProfile";

function App() {

    if(localStorage.getItem("token") === null){

    return (
            <div>
                <Routes>
                    <Route exact path="/" element={<Home />} />
                    <Route exact path="/login" element={<Login />} />
                    <Route exact path="/registration" element={<Registration />} />
                </Routes>
            </div>
        );
    }

    return (
        <div>
            <Routes>
                <Route exact path="/" element={<Home />} />
                <Route exact path="/dates" element={<DateList />} />
                <Route exact path="/new-date" element={<DateForm />} />
                <Route exact path="/dates/:id" element={<DateDetails />} />
                <Route exact path="/dates/:id/edit" element={<DateForm />} />
                <Route exact path="/dates/:id/delete" element={<DateEvent />} />
                <Route exact path="/login" element={<Login />} />
                <Route exact path="/registration" element={<Registration />} />
                <Route exact path="/profile" element={<Profile />} />
                <Route exact path="/attendee-profile" element={<AttendeeProfile />} />
            </Routes>
        </div>
    );
}

export default App;
