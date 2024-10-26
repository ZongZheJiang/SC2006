import React from "react";
import { Link } from "react-router-dom";
import {
  Container,
  List,
  ListItem,
  ListItemText,
  Divider,
  ListItemIcon,
  IconButton,
  Box,
} from "@mui/material";

import { MdOutlinePerson, MdOutlineNotificationsActive } from "react-icons/md";
import { TbHeadphones } from "react-icons/tb";
import { RiQuestionLine } from "react-icons/ri";
import { FaLanguage } from "react-icons/fa";
import { IoIosArrowBack } from "react-icons/io";

function Settings() {
  const settingsSections = [
    {
      title: "Account",
      description: "Manage your account settings",
      icon: <MdOutlinePerson size={30} />,
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
    <Container maxWidth="md">
      <Box display="flex" alignItems="center" mb={2}>
        <IconButton
          component={Link}
          to="/navigation"
          edge="start"
          color="inherit"
          aria-label="back"
        >
          <IoIosArrowBack size={24} />
        </IconButton>
        <h1 style={{ marginLeft: "40%" }}>Settings</h1>
      </Box>
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
    </Container>
  );
}

export default Settings;
