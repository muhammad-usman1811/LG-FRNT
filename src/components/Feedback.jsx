import * as React from "react";
import { useSelector } from "react-redux";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Box, Stack } from "@mui/system";
import { Divider, IconButton } from "@mui/material";
import Chip from "@mui/material/Chip";
import TextField from "@mui/material/TextField";
import CloseIcon from "@mui/icons-material/Close";
import Snackbar from "@mui/material/Snackbar";

export default function Feedback({
  open,
  modelResponse,
  handleClose,
  messageIndex,
  feedbackGiven,
}) {
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const [selectedOption, setSelectedOption] = React.useState(null);
  const [userFeedback, setUserFeedback] = React.useState("");
  const [openSnackbar, setOpenSnackbar] = React.useState(false);

  const handleClickChip = (label) => {
    setSelectedOption(label === selectedOption ? null : label);
  };
  const isChipSelected = (label) => selectedOption === label;

  const handleCloseDialog = () => {
    handleClose();
    setSelectedOption(null);
    setUserFeedback("");
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  const handleSubmitFeedback = async () => {
    try {
      const response = await fetch("/api/users/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify({
          response: modelResponse,
          option: selectedOption,
          feedback: userFeedback,
        }),
      });
      if (response.ok) {
        feedbackGiven(messageIndex);
        setOpenSnackbar(true);
        handleClose();
        setSelectedOption(null);
        setUserFeedback("");
      } else {
        throw new Error("Something went wrong.");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Dialog open={open} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <Box
          sx={{
            display: "flex",
            marginTop: "5px",
          }}
        >
          <DialogTitle>Provide Feedback</DialogTitle>
          <IconButton
            sx={{ position: "absolute", right: 8, top: 14 }}
            onClick={handleCloseDialog}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        <Divider />
        <DialogContent>
          <Stack
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: 2,
              flexWrap: "wrap",
            }}
          >
            {[
              "Not factually correct",
              "Outdated info",
              "References are irrelevant",
              "Unclear response",
              "Other",
            ].map((label) => (
              <Chip
                sx={{
                  cursor: "pointer",
                  bgcolor: isChipSelected(label) ? "primary.main" : "default",
                  color: isChipSelected(label) ? "white" : "default",
                  "&:hover": {
                    bgcolor: isChipSelected(label)
                      ? "primary.main"
                      : "action.hover",
                  },
                }}
                key={label}
                label={label}
                variant={isChipSelected(label) ? "filled" : "outlined"}
                onClick={() => handleClickChip(label)}
              />
            ))}
          </Stack>
          <TextField
            sx={{
              marginTop: "25px",
              "& .MuiOutlinedInput-root": {
                borderRadius: "10px",
              },
            }}
            fullWidth
            placeholder="(Optional) Feel free to add specific details"
            id="outlined-size-small"
            size="small"
            value={userFeedback}
            onChange={(e) => setUserFeedback(e.target.value)}
          />
        </DialogContent>
        <DialogActions
          sx={{
            display: "flex",
            justifyContent: "right",
            marginBottom: "5px",
            padding: "0 24px 15px 24px ",
          }}
        >
          <Button
            variant="outlined"
            sx={{
              textTransform: "none",
              borderRadius: "20px",
              "&.Mui-disabled": {
                color: "white",
                backgroundColor: "gray",
              },
            }}
            disabled={!selectedOption && !userFeedback}
            onClick={handleSubmitFeedback}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        message="Thank you for the feedback!"
      />
    </>
  );
}
