import Image from "next/image";

import { signOut, useSession } from "next-auth/react";

import { useState } from "react";

import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  Toolbar,
  Typography,
  Stack,
  MenuItem,
  Menu,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";

import ResponsiveDrawerItem from "./ResponsiveDrawerItem";

const drawerWidth = 230;

interface Props {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window?: () => Window;
}

export default function ResponsiveDrawer(props: Props) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = useState(false);

  const { data: sessionData } = useSession();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const container = window !== undefined ? () => window().document.body : undefined;

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box
      sx={{
        display: "flex",
      }}
    >
      <AppBar
        position="fixed"
        sx={{
          width: { md: "100vw" },
          pl: 2,
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{
              flexGrow: 1,
            }}
          >
            ICT Inventory System
          </Typography>

          {sessionData && (
            <Stack
              direction="row"
              gap={2}
              my={2}
              sx={{
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Box>
                <Image
                  src={sessionData.user?.image as string}
                  alt=""
                  width={33}
                  height={33}
                  onClick={handleMenu}
                  style={{
                    borderRadius: "50%",
                  }}
                />

                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  {/* <MenuItem onClick={handleClose}>Profile</MenuItem>
                  <MenuItem onClick={handleClose}>Settings</MenuItem> */}
                  <MenuItem
                    onClick={() => {
                      signOut();
                    }}
                  >
                    Sign Out
                  </MenuItem>
                </Menu>
              </Box>
            </Stack>
          )}
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
        aria-label="mailbox folders"
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "block", md: "none" },
            "& .MuiDrawer-paper": {
              color: "regular.white",
              bgcolor: "primary.main",
              boxSizing: "border-box",
              width: drawerWidth,
            },

            "& .MuiListItem-root": {
              "&:hover": {
                bgcolor: "primary.light",
              },
            },

            "& .MuiSvgIcon-root": {
              color: "regular.white",
            },
          }}
        >
          <ResponsiveDrawerItem />
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "none", md: "block" },

            "& .MuiDrawer-paper": {
              color: "regular.white",
              bgcolor: "primary.main",
              boxSizing: "border-box",
              width: drawerWidth,
            },

            "& .MuiListItem-root": {
              "&:hover": {
                bgcolor: "primary.light",
              },
            },

            "& .MuiSvgIcon-root": {
              color: "regular.white",
            },
          }}
          open
        >
          <ResponsiveDrawerItem />
        </Drawer>
      </Box>
    </Box>
  );
}
