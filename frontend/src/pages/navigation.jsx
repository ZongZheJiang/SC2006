import React, { useState, useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import axios from "axios";
import "./style.css";

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;

function Navigation() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [route, setRoute] = useState(null);
  const [startPoint, setStartPoint] = useState(null);
  const [endPoint, setEndPoint] = useState(null);

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
      setEndPoint(e.result.center);
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
    <div>
      <h1>Navigation</h1>
      <div className="mapContainer" ref={mapContainer} />
    </div>
  );
}

export default Navigation;
