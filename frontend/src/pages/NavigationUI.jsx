import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import axios from "axios";
import "./style.css";

import { Stack, Typography, Card } from "@mui/material";

import CarparkCard from "../components/CarparkCard";
import CarparkHeader from "../components/CarparkHeader";
import TopBar from "../components/Topbar";

import { motion } from "framer-motion";

const backend_url = process.env.REACT_APP_BACKEND_URL;
mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;

function Navigation() {
  let { state } = useLocation();

  const mapContainer = useRef(null);
  const map = useRef(null);
  const [route, setRoute] = useState(null);
  const [startPoint, setStartPoint] = useState(null);
  const [endPoint, setEndPoint] = useState(state?.coordinates || null);
  const [carparkData, setCarparkData] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [visibleResults, setVisibleResults] = useState(3); // Changed to 3

  const findCarparks = async (lat, long) => {
    try {
      const params = {
        lat: lat,
        lon: long,
      };
      console.log("Location data sent:", lat, long);
      const response = await axios.get(`${backend_url}/find`, {
        params,
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: false,
      });
      console.log("Carpark data received:", response.data);
      setCarparkData(response.data);
      setVisibleResults(3); // Reset to 3 initial results
      return response.data;
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleCarparkSelect = (carpark) => {
    console.log("Selected carpark:", carpark);

    if (carpark.lat && carpark.long) {
      const lat = parseFloat(carpark.lat);
      const lon = parseFloat(carpark.long);

      console.log("Setting endpoint to:", [lon, lat]);
      setEndPoint([lon, lat]);

      const markerId = `carpark-marker-${carpark.location}`;

      const markerElement = document.createElement("div");
      markerElement.id = markerId;
      markerElement.className = "marker";

      new mapboxgl.Marker(markerElement)
        .setLngLat([lon, lat])
        .setPopup(
          new mapboxgl.Popup().setHTML(`
          <h3>${carpark.address}</h3>
          ${
            carpark.lots_available && carpark.total_lots
              ? `<p>Available lots: ${carpark.lots_available}/${carpark.total_lots}</p>`
              : ""
          }
          `),
        )
        .addTo(map.current);

      setIsExpanded(false);

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
      if (state?.coordinates) {
        const [lon, lat] = state.coordinates;
        map.current.flyTo({
          center: [lon, lat],
          zoom: 15,
          essential: true,
        });
        const markerId = `carpark-marker-${state?.coordinates}`;
        const markerElement = document.createElement("div");
        markerElement.id = markerId;
        markerElement.className = "marker";
        new mapboxgl.Marker(markerElement)
          .setLngLat([lon, lat])
          .addTo(map.current);
        setEndPoint(state.coordinates);
        findCarparks(lat, lon);
      } else {
      }
    });

    geolocate.on("geolocate", (e) => {
      const lon = e.coords.longitude;
      const lat = e.coords.latitude;
      setStartPoint([lon, lat]);
      findCarparks(lat, lon);
    });

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

  const [showAll, setShowAll] = useState(false);

  const handleShowToggle = () => {
    if (showAll) {
      setVisibleResults(3);
    } else {
      setVisibleResults(carparkData.data.length);
    }
    setShowAll(!showAll);
  };

  return (
    <div className="page">
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          duration: 0.5,
          type: "spring",
          stiffness: 120,
          damping: 20,
        }}
      >
        <TopBar />
      </motion.div>

      <motion.div
        className="mapContainer"
        ref={mapContainer}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.5,
          delay: 0.2,
          ease: "easeOut",
        }}
      />

      {carparkData && carparkData.data && (
        <div className={`carpark-popup ${!isExpanded ? "collapsed" : ""}`}>
          <CarparkHeader
            isExpanded={isExpanded}
            setIsExpanded={setIsExpanded}
          />
          <div className="carpark-content">
            <div className="carpark-stack">
              <Stack
                spacing={1.5}
                sx={{
                  px: 1,
                  py: 1,
                  display: isExpanded ? "flex" : "none",
                }}
              >
                {carparkData.data
                  .slice(0, visibleResults)
                  .map((carpark, index) => (
                    <CarparkCard
                      key={index}
                      carpark={carpark}
                      onSelect={handleCarparkSelect}
                    />
                  ))}
              </Stack>
            </div>
          </div>

          {carparkData.data.length > 3 && isExpanded && (
            <div className="show-more-container">
              <Card
                sx={{
                  cursor: "pointer",
                  backgroundColor: "#1565c0",
                  textAlign: "center",
                  py: 1.8,
                  mx: "-1%",
                  mb: 1,
                  width: "91%",
                  borderRadius: 3,
                }}
                onClick={handleShowToggle}
              >
                <Typography
                  variant="button"
                  sx={{
                    color: "white",
                    fontWeight: "bold",
                  }}
                >
                  {showAll
                    ? "Show Less"
                    : `Show More Results (${carparkData.data.length - visibleResults} remaining)`}
                </Typography>
              </Card>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Navigation;
