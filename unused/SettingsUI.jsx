import React from "react";
import { Link } from "react-router-dom";
import {
  List,
  ListItem,
  ListItemText,
  Divider,
  ListItemIcon,
  IconButton,
} from "@mui/material";

import axios from "axios";

import { MdOutlinePerson, MdOutlineNotificationsActive } from "react-icons/md";
import { TbHeadphones } from "react-icons/tb";
import { RiQuestionLine } from "react-icons/ri";
import { FaLanguage } from "react-icons/fa";
import { IoIosArrowBack } from "react-icons/io";

function Settings() {
  const someFunction = async () => {
    try {
      const params = {
        lat: 1.30290492,
        lon: 103.822247475,
      };

      const response = await axios.get("http://127.0.0.1:5000/find", {
        params,
      });
      console.log("Response:", response.data);

      // Handle the response as needed
    } catch (error) {
      console.error("Error:", error);
      // Handle error appropriately
    }
  };

  const settingsSections = [
    {
      title: "Account",
      description: "Manage your account settings",
      icon: <MdOutlinePerson size={30} />,
      onClick: someFunction(),
    },
    {
      title: "Language",
      description: "Change your preferred language",
      icon: <FaLanguage size={30} />,
    },
    {
      title: "Notifications",
      description: "Customize your notification preferences",
      icon: <MdOutlineNotificationsActive size={30} />,
    },
    {
      title: "Help and Support",
      description: "Get assistance and support",
      icon: <TbHeadphones size={30} />,
    },
    {
      title: "About",
      description: "More information",
      icon: <RiQuestionLine size={30} />,
    },
  ];

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
      <List>
        {settingsSections.map((section, index) => (
          <React.Fragment key={section.title}>
            <ListItem button>
              <ListItemIcon>{section.icon}</ListItemIcon>
              <ListItemText
                primary={section.title}
                secondary={section.description}
              />
            </ListItem>
            {index < settingsSections.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </List>
    </div>
  );
}

export default Settings;
