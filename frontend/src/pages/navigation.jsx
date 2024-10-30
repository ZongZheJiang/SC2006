import React, { useState, useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import axios from "axios";
import "./style.css";

import { Link } from "react-router-dom";
import { TbSettings } from "react-icons/tb";
import { MdOutlineBookmarkBorder } from "react-icons/md";

import {
  Card,
  CardContent,
  Typography,
  Stack,
  Box,
  IconButton,
} from "@mui/material";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import PlaceIcon from "@mui/icons-material/Place";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

const backend_url = process.env.REACT_APP_BACKEND_URL;
mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;

const TopBar = () => (
  <div className="top-bar">
    <Link to="/bookmarks" className="icon-link">
      <MdOutlineBookmarkBorder size={24} />
    </Link>
    <h1>Navigation</h1>
    <Link to="/settings" className="icon-link">
      <TbSettings size={24} />
    </Link>
  </div>
);

const CarparkHeader = ({ isExpanded, setIsExpanded }) => (
  <Card
    sx={{
      mb: 2,
      backgroundColor: "#1976d2",
      borderRadius: 2,
      boxShadow: 2,
      position: "relative",
      cursor: "pointer",
    }}
    onClick={() => setIsExpanded(!isExpanded)}
  >
    <CardContent
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "12px !important",
      }}
    >
      <Typography
        variant="h6"
        sx={{
          textAlign: "center",
          color: "white",
          fontWeight: "bold",
          margin: 0,
          marginRight: 1,
        }}
      >
        Nearby Carparks
      </Typography>
      <IconButton
        size="small"
        sx={{
          color: "white",
          padding: 0,
          "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.1)" },
        }}
      >
        {isExpanded ? <KeyboardArrowDownIcon /> : <KeyboardArrowUpIcon />}
      </IconButton>
    </CardContent>
  </Card>
);

const CarparkCard = ({ carpark, onSelect }) => (
  <Card
    sx={{
      cursor: "pointer",
      "&:hover": {
        transform: "translateY(-2px)",
        boxShadow: 3,
        transition: "all 0.2s ease-in-out",
      },
    }}
    onClick={() => onSelect(carpark)}
  >
    <CardContent>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography
          variant="subtitle1"
          component="div"
          sx={{ fontWeight: "bold" }}
        >
          {carpark.location}
        </Typography>
        <IconButton size="small" color="primary">
          <PlaceIcon />
        </IconButton>
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mt: 1,
          color: "text.secondary",
        }}
      >
        <Typography variant="body2">
          {Math.round(carpark.dist)}m away
        </Typography>
        {carpark.lots_available ? (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <DirectionsCarIcon fontSize="small" />
            <Typography variant="body2">
              {carpark.lots_available}/{carpark.total_lots} lots
            </Typography>
          </Box>
        ) : (
          <Typography variant="body2" color="text.secondary">
            No lot info available
          </Typography>
        )}
      </Box>
    </CardContent>
  </Card>
);

function Navigation() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [route, setRoute] = useState(null);
  const [startPoint, setStartPoint] = useState(null);
  const [endPoint, setEndPoint] = useState(null);
  const [carparkData, setCarparkData] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const findCarparks = async (lat, long) => {
    try {
      const params = {
        lat: lat,
        lon: long,
      };
      const response = await axios.get(`${backend_url}/find`, {
        params,
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: false, // Important for CORS
      });
      console.log("Carpark data received:", response.data);
      setCarparkData(response.data);
      return response.data;
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleCarparkSelect = (carpark) => {
    // Log the carpark data to see its structure
    console.log("Selected carpark:", carpark);

    if (carpark.lat && carpark.long) {
      const lat = parseFloat(carpark.lat);
      const lon = parseFloat(carpark.long);

      console.log("Setting endpoint to:", [lon, lat]);

      // Update the endpoint
      setEndPoint([lon, lat]);

      // Add a marker for the selected carpark if it doesn't exist
      const markerId = `carpark-marker-${carpark.location}`;

      // Remove existing carpark marker if any
      const existingMarker = document.getElementById(markerId);
      if (existingMarker) {
        existingMarker.remove();
      }

      // Add new marker
      const markerElement = document.createElement("div");
      markerElement.id = markerId;
      markerElement.className = "marker";

      new mapboxgl.Marker(markerElement)
        .setLngLat([lon, lat])
        .setPopup(
          new mapboxgl.Popup().setHTML(`
          <h3>${carpark.location}</h3>
          <p>Available lots: ${carpark.lots_available}/${carpark.total_lots}</p>
        `),
        )
        .addTo(map.current);

      // Optionally collapse the carpark list
      setIsExpanded(false);

      // Fly to the selected carpark
      map.current.flyTo({
        center: [lon, lat],
        zoom: 15,
        essential: true,
      });
    } else {
      console.error("Invalid coordinates for carpark:", carpark);
    }
  };

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

    geolocate.on("geolocate", (e) => {
      const lon = e.coords.longitude;
      const lat = e.coords.latitude;
      setStartPoint([lon, lat]);
    });

    const geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl,
      placeholder: "Enter destination",
    });
    map.current.addControl(geocoder);

    geocoder.on("result", (e) => {
      const [longitude, latitude] = e.result.center;
      setEndPoint(e.result.center);
      findCarparks(latitude, longitude);
    });
  }, []);

  useEffect(() => {
    const fetchRoute = async () => {
      if (!startPoint || !endPoint) return;

      try {
        const response = await axios.get(
          `https://api.mapbox.com/directions/v5/mapbox/driving/${startPoint[0]},${startPoint[1]};${endPoint[0]},${endPoint[1]}?geometries=geojson&access_token=${mapboxgl.accessToken}`,
        );

        if (
          response.data &&
          response.data.routes &&
          response.data.routes.length > 0
        ) {
          const route = response.data.routes[0];
          setRoute(route);

          // Route functinion
          if (map.current.getSource("route")) {
            map.current.removeLayer("route");
            map.current.removeSource("route");
          }

          map.current.addSource("route", {
            type: "geojson",
            data: {
              type: "Feature",
              properties: {},
              geometry: route.geometry,
            },
          });

          map.current.addLayer({
            id: "route",
            type: "line",
            source: "route",
            layout: {
              "line-join": "round",
              "line-cap": "round",
            },
            paint: {
              "line-color": "#888",
              "line-width": 8,
            },
          });

          const bounds = new mapboxgl.LngLatBounds();
          route.geometry.coordinates.forEach((coord) => bounds.extend(coord));
          map.current.fitBounds(bounds, { padding: 50 });
        }
      } catch (error) {
        console.error("Error fetching route:", error);
      }
    };

    fetchRoute();
  }, [startPoint, endPoint]);

  return (
    <div className="page">
      <TopBar />
      <div className="mapContainer" ref={mapContainer} />

      {carparkData && carparkData.data && (
        <div className={`carpark-popup ${!isExpanded ? "collapsed" : ""}`}>
          <CarparkHeader
            isExpanded={isExpanded}
            setIsExpanded={setIsExpanded}
          />
          <Stack
            spacing={2}
            sx={{
              maxHeight: "60vh",
              overflowY: "auto",
              px: 1,
              display: isExpanded ? "flex" : "none",
            }}
          >
            {carparkData.data.map((carpark, index) => (
              <CarparkCard
                key={index}
                carpark={carpark}
                onSelect={handleCarparkSelect}
              />
            ))}
          </Stack>
        </div>
      )}
    </div>
  );
}

export default Navigation;
