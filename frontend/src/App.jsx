import logo from './logo.svg';
import './App.css';
import {useCookies} from 'react-cookie';
import React, { useEffect } from 'react';

const backend_url = "http://127.0.0.1:5000"

function App() {
  const [cookies, setCookie] = useCookies(["user"]);
    useEffect(() => {
      const fetchData = async () => {
        try {
          const res = await fetch(backend_url+"/user", {
            method: "GET"
          });
          if (!res.ok) {
            throw new Error('Network response was not ok');
          }
          const data = await res.json();
          setCookie('user', data, { path: '/', maxAge: 3155760000 }); // 100 years
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
      if (!cookies.user) {
        fetchData();
      }
    }, [cookies.user, setCookie]);

  const insertClick = async (location) => {
    try {
       const loc = {
         location: location,
         uid: cookies.user
       };

       const response = await fetch(backend_url + '/bookmarks/add', {
           method: 'POST',
           headers: {
               'Content-Type': 'application/json'
           },
           body: JSON.stringify(loc)
       });
    } catch (error) {
      console.error('Error sending data:', error);
    }
  }

  const deleteClick = async (location) => {
    try {
       const loc = {
         location: location,
         uid: cookies.user
       };

       const response = await fetch('http://127.0.0.1:5000/bookmarks/delete', {
           method: 'POST',
           headers: {
               'Content-Type': 'application/json'
           },
           body: JSON.stringify(loc)
       });
    } catch (error) {
      console.error('Error sending data:', error);
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.jsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          <button onClick={() => insertClick("testering")}>Add</button>
          <button onClick={() => deleteClick("testering")}>Delete</button>
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
