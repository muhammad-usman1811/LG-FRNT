import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, Stack } from "@mui/system";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import { logout } from "../../actions/userActions";
import AppBar from "@mui/material/AppBar";
import { Link } from "react-router-dom";

const Header = () => {
  const [anchorEl, setAnchorEl] = useState(null);

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const dispatch = useDispatch();

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    dispatch(logout());
  };

  return (
    <AppBar
      position="sticky"
      sx={{
        backgroundColor: "#003D78",
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <Link to="/app/chat">
            <Avatar
              sx={{
                width: "50px",
                height: "auto",
                objectFit: "cover",
              }}
              alt="product logo"
              src="/images/legal26.png"
            />
          </Link>
          <Typography variant="h5">LawGPT</Typography>
        </Box>

        <Stack direction="row" paddingRight="0">
          <Typography
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            {userInfo?.name}
          </Typography>
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            color="inherit"
            sx={{ paddingRight: 0 }}
          >
            <Avatar
              sx={{ width: "40px", height: "40px" }}
              alt="user"
              src="/images/userPhoto.jpg"
            />
          </IconButton>
        </Stack>
      </Toolbar>
      <Menu
        sx={{ marginTop: 5 }}
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
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
    </AppBar>
  );
};

export default Header;
