import { Link, useNavigate } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import { useCookies } from "react-cookie";
import {
  List,
  ListItem,
  ListItemText,
  Divider,
  Button,
  IconButton,
} from "@mui/material";
import { DeleteOutline } from "@mui/icons-material";
import { IoNavigate } from "react-icons/io5";
import "./style.css";

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;
const backend_url = process.env.REACT_APP_BACKEND_URL;
const Bookmarks = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [bookmarks, setBookmarks] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [cookies] = useCookies(["user"]);
  const uid = cookies.user;
  const navigate = useNavigate();

  useEffect(() => {
    if (map.current) return;
    console.log("uid");
    console.log(cookies);
    console.log(uid);

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [103.8198, 1.3521],
      zoom: 11,
    });

    const geolocate = new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true,
      },
      trackUserLocation: true,
    });

    const geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl,
      placeholder: "Enter destination",
      className: "custom-geocoder",
    });

    map.current.addControl(geocoder);
    map.current.addControl(geolocate);
    map.current.addControl(new mapboxgl.NavigationControl(), "top-right");

    map.current.on("load", () => {
      geolocate.trigger();
    });

    geocoder.on("result", (e) => {
      setSelectedLocation({
        name: e.result.place_name,
        coordinates: e.result.center,
      });
    });
  }, []);

  const addBookmark = async () => {
    if (!selectedLocation) return;

    try {
      console.log(selectedLocation);
      let resp = await axios.post(backend_url + "/bookmarks/add", {
        uid: uid,
        location: selectedLocation.name,
        coordinates: selectedLocation.coordinates,
      });
      console.log(resp);
      setBookmarks((prevBookmarks) => [
        ...prevBookmarks,
        [
          selectedLocation.name,
          selectedLocation.coordinates[0],
          selectedLocation.coordinates[1],
        ],
      ]);
    } catch (error) {
      console.error("Error adding bookmark:", error);
      console.log(error.response);
    } finally {
      setSelectedLocation(null);
    }
  };

  const fetchBookmarks = async () => {
    try {
      const response = await axios.get(backend_url + "/bookmarks", {
        params: {
          uid: uid,
        },
      });
      setBookmarks(response.data);
    } catch (error) {
      console.error("Error fetching bookmarks:", error);
    }
  };

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const deleteBookmark = async (location) => {
    try {
      await axios.post(backend_url + "/bookmarks/delete", {
        location: location[0],
        uid: uid,
      });
      setBookmarks((prevBookmarks) =>
        prevBookmarks.filter((bookmark) => bookmark !== location),
      );
    } catch (error) {
      console.error("Error deleting bookmark:", error);
    }
  };

  const handleNavigate = (coordinates) => {
    navigate("/navigation", {
      state: {
        coordinates: coordinates,
        timestamp: Date.now(), // Add a timestamp to force state update
      },
      replace: true, // Use replace to enable proper back button behavior
    });
  };

  return (
    <div className="page" style={{ background: "#fcfcfc" }}>
      <div
        className="top-bar"
        style={{
          position: "relative",
        }}
      >
        <IconButton
          component={Link}
          to="/navigation"
          edge="start"
          color="inherit"
          aria-label="back"
          style={{
            position: "absolute",
            left: 10,
          }}
        >
          <IoIosArrowBack size={24} />
        </IconButton>
        <h1 style={{ textAlign: "center" }}>Bookmarks</h1>
      </div>
      <div
        className="mapContainer"
        ref={mapContainer}
        style={{ height: "300px", marginBottom: "16px" }}
      />

      <Button
        variant="contained"
        color="primary"
        onClick={addBookmark}
        disabled={!selectedLocation}
      >
        {selectedLocation
          ? `Add "${selectedLocation.name}" to Bookmarks`
          : "Search for a location with map"}
      </Button>
      <Divider style={{ margin: "16px 0" }} />
      <h3>
        <br />
        My Bookmarks
      </h3>
      <List className="bookmark-list">
        {bookmarks.map((bookmark, index) => (
          <React.Fragment key={index}>
            <ListItem button className="bookmark-box">
              <ListItemText primary={bookmark[0]} />
              <IconButton
                onClick={() => handleNavigate([bookmark[1], bookmark[2]])}
                sx={{ color: "#1976d2" }}
              >
                <IoNavigate />
              </IconButton>
              <IconButton
                edge="end"
                onClick={() => deleteBookmark(bookmark)}
                color="error"
              >
                <DeleteOutline />
              </IconButton>
            </ListItem>
          </React.Fragment>
        ))}
      </List>
    </div>
  );
};

export default Bookmarks;
