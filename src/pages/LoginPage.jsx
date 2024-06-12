import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  Snackbar,
} from "@mui/material";
import { login } from "../actions/userActions";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [openToast, setOpenToast] = useState(false);
  const [toastText, setToastText] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo, error } = userLogin;

  const handleClose = () => {
    setOpenToast(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (username.trim() === "" || password.trim() === "") {
      setToastText("Please enter your credentials");
      setOpenToast(true);
      return;
    }
    dispatch(login(username, password));
  };

  useEffect(() => {
    if (userInfo?.status === "success") {
      navigate("/app/chat");
    } else if (error) {
      setToastText(error);
      setOpenToast(true);
    }
  }, [userInfo, error, navigate]);

  return (
    <Box
      sx={{
        display: "flex",
        backgroundImage: "url('images/legal_login.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        height: "100vh",
      }}
    >
      <Box
        sx={{
          display: "flex",
          width: { xs: "100%", md: "50%" },
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
        component="form"
        onSubmit={handleSubmit}
      >
        <Box
          sx={{
            display: "flex",
            width: "50%",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: "2rem",
            borderRadius: 2,
            position: "relative",
            backgroundColor: "white",
            transition: "transform 0.3s ease-in-out",
            "&:hover": {
              transform: "scale(1.05)",
            },
          }}
        >
          <Typography
            variant="h5"
            sx={{
              textAlign: "center",
              color: "#003D78",
              fontWeight: "bold",
              mb: "1rem",
            }}
          >
            LawGPT
          </Typography>
          <TextField
            fullWidth
            label="Username"
            variant="outlined"
            margin="normal"
            InputLabelProps={{ shrink: true }}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            helperText="Please input username"
          />
          <TextField
            fullWidth
            label="Password"
            variant="outlined"
            margin="normal"
            type="password"
            InputLabelProps={{ shrink: true }}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            helperText="Please input password"
          />
          <Button
            size="large"
            sx={{
              display: "flex",
              fontWeight: "bold",
              backgroundColor: "#003D78",
              marginTop: "0.5rem",
              textTransform: "none",
              "&:hover": { backgroundColor: "#040235" },
              transition: "background-color 0.3s ease-in-out",
            }}
            variant="contained"
            type="submit"
          >
            Sign In
          </Button>
        </Box>
        <Box display="flex">
          <footer
            style={{
              display: "flex",
              marginTop: "2rem",
              color: "#6C6C6C",
              fontWeight: "bold",
              gap: "0.3rem",
              cursor: "pointer",
              marginLeft: "25px",
            }}
          >
            <Typography color="white" variant="subtitle2">
              Powered By:
            </Typography>
            <a href="https://digifloat.com/" rel="noreferrer" target="_blank">
              <img
                style={{ width: "90px", height: "23px" }}
                src="/images/df_logo1.png"
                alt="df-logo"
              />
            </a>
          </footer>
        </Box>
      </Box>
      {(error || openToast) && (
        <Snackbar
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          open={openToast}
          autoHideDuration={3000}
          onClose={handleClose}
        >
          <Alert
            sx={{ width: "100%" }}
            severity="error"
            variant="filled"
            color="error"
            onClose={handleClose}
          >
            {toastText}
          </Alert>
        </Snackbar>
      )}
    </Box>
  );
}

export default LoginPage;
