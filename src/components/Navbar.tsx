import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { Menu } from "@mui/icons-material";
import logo from "../assets/logo.png";
import { useState } from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
// import Button from "@mui/material/Button";
// import AppBar from "@mui/material/AppBar";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
// import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import DraftsIcon from '@mui/icons-material/Drafts';
import HomeIcon from '@mui/icons-material/Home';
import BackpackIcon from '@mui/icons-material/Backpack';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';
import FlightIcon from '@mui/icons-material/Flight';
// import Toolbar from "@mui/material/Toolbar";

export const Navbar = () => {
  const [open, setOpen] = useState(false);

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
    <nav className="flex bg-white py-4 drop-shadow-sm text-bold fixed w-full z-[999]">
      <div className="flex mx-8">
        <Menu onClick={toggleDrawer(!open)} className="my-auto" />
        <Drawer open={open} onClose={toggleDrawer(false)}>
          {DrawerList}
        </Drawer>
        <img className="w-24 ml-5 my-auto" src={logo} alt="google-logo" />
      </div>
    </nav>
    // <AppBar
    //   position="fixed"
    //   color="primary"
    //   sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
    // >
    //   <Toolbar>
    //     {" "}
    //     <div className="flex mx-8">
    //       <Menu onClick={toggleDrawer(!open)} className="my-auto" />{" "}
    //       <Drawer open={open} onClose={toggleDrawer(false)}>
    //         {DrawerList}{" "}
    //       </Drawer>
    //       <img className="w-24 ml-5 my-auto" src={logo} alt="google-logo" />{" "}
    //     </div>
    //   </Toolbar>
    // </AppBar>
  );
};
