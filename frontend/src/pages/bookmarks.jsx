import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import {
  Container,
  List,
  ListItem,
  ListItemText,
  Divider,
  Button,
} from "@mui/material";

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;

const Bookmarks = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [bookmarks, setBookmarks] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);

  useEffect(() => {
    if (map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [103.8198, 1.3521],
      zoom: 11,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), "top-right");

    const geolocate = new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true,
      },
      trackUserLocation: true,
    });
    map.current.addControl(geolocate);

    map.current.on("load", () => {
      geolocate.trigger();
    });

    const geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl,
      placeholder: "Enter destination",
    });
    map.current.addControl(geocoder);

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
      const response = await axios.post("/bookmarks/add", {
        location: selectedLocation.name,
        coordinates: selectedLocation.coordinates,
      });
      setBookmarks((prevBookmarks) => [
        ...prevBookmarks,
        selectedLocation.name,
      ]);
      setSelectedLocation(null);
    } catch (error) {
      console.error("Error adding bookmark:", error);
    }
  };

  const fetchBookmarks = async () => {
    try {
      const response = await axios.get("/bookmarks");
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
      await axios.post("/bookmarks/delete", { location });
      setBookmarks((prevBookmarks) =>
        prevBookmarks.filter((bookmark) => bookmark !== location)
      );
    } catch (error) {
      console.error("Error deleting bookmark:", error);
    }
  };

  return (
    <Container>
      <div className="page">
        <div className="top-bar" style={{alignContent: "center"}}>
          <h1>Bookmarks</h1>
        </div>

        <div className="mapContainer" ref={mapContainer} style={{ height: "300px", marginBottom: "16px" }} />

        <Button
          variant="contained"
          color="primary"
          onClick={addBookmark}
          disabled={!selectedLocation}
        >
          {selectedLocation ? `Add "${selectedLocation.name}" to Bookmarks` : "Search for a location"}
        </Button>

        <Divider style={{ margin: "16px 0" }} />

        <h3>My Bookmarks</h3>
        <List>
          {bookmarks.map((bookmark, index) => (
            <ListItem key={index}>
              <ListItemText primary={bookmark} />
              <Button color="secondary" onClick={() => deleteBookmark(bookmark)}>
                Delete
              </Button>
            </ListItem>
          ))}
        </List>
      </div>
    </Container>
  );
};

export default Bookmarks;
