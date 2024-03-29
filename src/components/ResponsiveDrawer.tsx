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

import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";

import ResponsiveDrawerItem from "./ResponsiveDrawerItem";
import { useQrCart } from "../context/QrCartContext";

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

  const { openCart, cartQuantity } = useQrCart();

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
            sx={{ display: { md: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            noWrap
            component="div"
            sx={{
              flexGrow: 1,
              fontWeight: "medium",
              fontSize: { md: 24, xs: 14 },
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
              <IconButton
                onClick={() => {
                  openCart();
                }}
                size="small"
                sx={{
                  // color: "white",
                  bgcolor: "white",
                  border: 4,

                  "&:hover": {
                    bgcolor: "grey.300",
                  },
                }}
              >
                <QrCodeScannerIcon />
                <Typography
                  sx={{
                    position: "absolute",
                    p: 0.2,
                    borderRadius: "50%",
                    bgcolor: "red",
                    color: "white",
                    fontSize: 12,
                    bottom: -10,
                    right: -3,
                  }}
                >
                  {cartQuantity > 99 ? "99+" : cartQuantity}
                </Typography>
              </IconButton>
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
              color: "black",
              bgcolor: "#f4f4f4",
              boxSizing: "border-box",
              width: drawerWidth,
            },

            "& .MuiListItem-root": {
              "&:hover": {
                bgcolor: "grey.200",
              },
            },

            "& .MuiSvgIcon-root": {
              color: "primary.main",
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
              color: "black",
              bgcolor: "f4f4f4",
              boxSizing: "border-box",
              width: drawerWidth,
            },

            "& .MuiListItem-root": {
              "&:hover": {
                bgcolor: "grey.200",
              },
            },

            "& .MuiSvgIcon-root": {
              color: "primary.main",
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
