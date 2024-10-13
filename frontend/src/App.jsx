import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import logo from "./logo.svg";
import "./App.css";
import Navigation from "./pages/navigation.jsx";
import LandingPage from "./pages/landingpage.jsx";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/navigation" element={<Navigation />} />
          <Route path="/" element={<LandingPage />} />
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
