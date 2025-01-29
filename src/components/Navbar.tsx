import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { Menu } from "@mui/icons-material";
import logo from "../assets/logo.png";
import { useState } from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MailIcon from "@mui/icons-material/Mail";
import DraftsIcon from '@mui/icons-material/Drafts';
import HomeIcon from '@mui/icons-material/Home';
import BackpackIcon from '@mui/icons-material/Backpack';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';
import FlightIcon from '@mui/icons-material/Flight';
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";

export const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [hasFlights, setHasFlights] = useState(false); // Add this state

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
      <List>
      {["Home","Travel", "Explore", "Flights"].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>
              {index === 0 ? <HomeIcon /> : index === 1 ? <BackpackIcon /> : index === 2 ? <TravelExploreIcon /> : <FlightIcon />}

              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
       
      </List>
      <Divider />
      <List>
      {[ "Send email", "Drafts"].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {index % 2 === 0 ?  <MailIcon /> : <DraftsIcon/>}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <AppBar position="fixed" sx={{ backgroundColor: 'white', color: 'black' }}>
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={toggleDrawer(!open)}
          sx={{ mr: 2 }}
        >
          <Menu />
        </IconButton>
        <img className="w-24 my-auto" src={logo} alt="google-logo" />
        <Box sx={{ flexGrow: 1 }} />
        <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
          <Typography
            variant="button"
            sx={{ mx: 2, cursor: 'pointer', '&:hover': { color: '#1976d2' } }}
          >
            Home
          </Typography>
          <Typography
            variant="button"
            sx={{ mx: 2, cursor: 'pointer', '&:hover': { color: '#1976d2' } }}
          >
            {hasFlights ? 'Flights' : 'No Flights'}
          </Typography>
          <Typography
            variant="button"
            sx={{ mx: 2, cursor: 'pointer', '&:hover': { color: '#1976d2' } }}
          >
            Explore
          </Typography>
        </Box>
        <Drawer open={open} onClose={toggleDrawer(false)}>
          {DrawerList}
        </Drawer>
      </Toolbar>
    </AppBar>
  );
};
