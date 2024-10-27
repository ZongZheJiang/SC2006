import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import logo from "./logo.svg";
import "./App.css";
import axios from "axios";
import { useCookies } from "react-cookie";
import Navigation from "./pages/navigation.jsx";
import LandingPage from "./pages/landingpage.jsx";
import Settings from "./pages/settings.jsx";
import Bookmarks from "./pages/bookmarks.jsx";

function App() { 
  const [cookies, setCookie] = useCookies(["user"]);
  const backend_url = "http://127.0.0.1:5000";
  useEffect(() => {
    let fetchData = async () => {
      try {
        await axios.get(backend_url + "/user")
          .then(res => {
            console.log('uid');
            console.log(res.data);
            setCookie('user', res.data, { path: '/', maxAge: 3155760000, sameSite: "Lax", secure: false}); // 100 years
            })
          .catch(err => console.error(err));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    if (!cookies.user) {
      fetchData();
    }
  }, [cookies.user, setCookie]);
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/navigation" element={<Navigation />} />
          <Route path="/bookmarks" element={<Bookmarks />} />
          <Route path="/settings" element={<Settings />} />
          <Route
            path="/home"
            element={
              <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <p>
                  Edit <code>src/App.js</code> and save to reload.
                </p>
                <a
                  className="App-link"
                  href="https://reactjs.org"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Learn React
                </a>
              </header>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;