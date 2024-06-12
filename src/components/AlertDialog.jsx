import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { Box } from "@mui/system";

export default function AlertDialog({ open, handleClose }) {
  return (
    <Dialog open={open} onClose={handleClose}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          marginTop: "5px",
        }}
      >
        <WarningAmberIcon color="error" fontSize="large" />
      </Box>
      <DialogTitle sx={{ display: "flex", justifyContent: "center" }}>
        Message Limit Exceeded
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          You have reached the free chat limit. You can make 6 queries with free
          account.
        </DialogContentText>
      </DialogContent>
      <DialogActions
        sx={{ display: "flex", justifyContent: "center", marginBottom: "5px" }}
      >
        <Button
          variant="outlined"
          sx={{ width: "95%", textTransform: "none" }}
          onClick={handleClose}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
