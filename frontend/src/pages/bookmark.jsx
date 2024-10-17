import { React, useState } from "react";
import axios from "axios";
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
import { useState } from "react";


function Bookmark() {
  const [bookmarks, setBookmarks] = useState([]);


  // The useEffect runs only once when the component mounts, which is the correct behavior for 
  // fetching data from an API.
  // If you were to depend on bookmarks, you'd end up in a cycle where updating bookmarks triggers the useEffect,
  // which fetches data and updates bookmarks again, causing the component to refetch the data infinitely.
  useEffect(() => {
    // const fetchBookmarks = async () => {
    //   try {
    //     const userId = 1;
    //     const response = await axios.get(`/api/bookmarks/${userId}`);
    //     setBookmarks(response.data);
    //   } catch (error) {
    //     console.error("Error fetching bookmarks:", error);
    //   }
    // };
  
    // fetchBookmarks();

  }, [])



  return (
    <Container maxWidth="md">
      <List>
        {/* {settingsSections.map((section, index) => (
          <React.Fragment key={section.title}>
            <ListItem button>
              <ListItemText
                primary={section.title}
                secondary={section.description}
              >

              </ListItemText>
            </ListItem>
            {index < settingsSections.length - 1 && <Divider />}
          </React.Fragment>
        ))} */}
      </List>
    </Container>
    );
}

export default Bookmark;
