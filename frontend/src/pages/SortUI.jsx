import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { IconButton, ButtonGroup, Button } from "@mui/material";
import { IoIosArrowBack } from "react-icons/io";
import "./style.css";

const backend_url = process.env.REACT_APP_BACKEND_URL;

function Settings() {
  const [selectedOption, setSelectedOption] = useState(() => {
    return localStorage.getItem("sortPreference") || "location";
  });

  const sortDescriptions = {
    location:
      "The default search option, perfect for when you need to park quickly or prefer minimal walking distance.",
    price:
      "Finds the best parking prices near you, ideal for budget-conscious drivers. This option priorities carparks with price information",
    lots: "Shows the carparks with most vacancies, useful for peak hours or busy areas.  This option priorities carparks with vacancy information",
  };
  useEffect(() => {
    // Only fetch if there's no stored preference
    if (!localStorage.getItem("sortPreference")) {
      fetch(`${backend_url}/sort`)
        .then((response) => response.json())
        .then((data) => {
          if (data.sort_type) {
            const sortType = data.sort_type.toLowerCase();
            setSelectedOption(sortType);
            localStorage.setItem("sortPreference", sortType);
          }
        })
        .catch((error) => {
          console.error("Error fetching sort type:", error);
        });
    }
  }, []);

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    // Store the selection in localStorage
    localStorage.setItem("sortPreference", option);

    fetch(`${backend_url}/sort?sort_type=${option}`, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Sort type updated successfully:", data);
      })
      .catch((error) => {
        console.error("Error updating sort type:", error);
      });
  };

  return (
    <div className="page">
      <div
        className="top-bar"
        style={{
          boxShadow: "none",
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
        <h1>Settings</h1>
      </div>
      <h3> Customise your search options</h3>
      <div className="button-group">
        <ButtonGroup variant="outlined" aria-label="Basic button group">
          <Button
            className={`button-base sort-button ${selectedOption === "location" ? "selected" : ""}`}
            onClick={() => handleOptionClick("location")}
          >
            Location
          </Button>
          <Button
            className={`button-base sort-button ${selectedOption === "price" ? "selected" : ""}`}
            onClick={() => handleOptionClick("price")}
          >
            Price
          </Button>
          <Button
            className={`button-base sort-button ${selectedOption === "lots" ? "selected" : ""}`}
            onClick={() => handleOptionClick("lots")}
          >
            Lots
          </Button>
        </ButtonGroup>
      </div>

      {selectedOption && (
        <div
          style={{
            padding: "10px",
            textAlign: "center",
            maxWidth: "90%",
            margin: "20px auto",
            lineHeight: "1.5",
            fontSize: "0.9rem",
          }}
        >
          {sortDescriptions[selectedOption]}
        </div>
      )}
    </div>
  );
}

export default Settings;
