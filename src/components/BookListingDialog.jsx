import * as React from "react";
import PropTypes from "prop-types";
//import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
//import FormControl from "@mui/material/FormControl";
//import InputLabel from "@mui/material/InputLabel";
//import MenuItem from "@mui/material/MenuItem";
//import Select from "@mui/material/Select";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import config from "../config/api";

export default function BookListingDialog({
  open,
  handleClose,
  handleBookChange,
}) {
  const [selectedBook, setSelectedBook] = React.useState(null);
  const [books, setBooks] = React.useState([]);

  const handleChange = (event, value) => {
    setSelectedBook(value);
  };

  const handleSelect = () => {
    handleBookChange(selectedBook);
    handleClose();
  };

  const capitalizeEachWord = (str) => {
    return str
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const fetchBooks = React.useCallback(async () => {
    const endpoint = `${config.apiUrl}/get_book_mapping`;
    try {
      const response = await fetch(endpoint, { method: "GET" });
      const data = await response.json();
      setBooks(data);
    } catch (error) {
      console.log(error);
    }
  }, []);

  React.useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
      }}
    >
      <DialogTitle>Select Book</DialogTitle>
      <DialogContent sx={{ width: { xs: 400, sm: 500 } }}>
        <DialogContentText sx={{ marginBottom: 1 }}>
          Search for a Book
        </DialogContentText>
        <Autocomplete
          options={books}
          getOptionLabel={(option) => capitalizeEachWord(option.full_name)}
          renderInput={(params) => <TextField {...params} />}
          onChange={handleChange}
          value={selectedBook}
        />
        {/* <Select
              sx={{ textTransform: "capitalize" }}
              autoFocus
              value={selectedBook}
              onChange={handleChange}
              label="Select Book"
              MenuProps={{ PaperProps: { style: { maxHeight: "40vh" } } }}
            >
              {books &&
                books.map((book) => (
                  <MenuItem
                    key={book.code}
                    value={book.full_name}
                    sx={{ textTransform: "capitalize" }}
                  >
                    {capitalizeEachWord(book.full_name)}
                  </MenuItem>
                ))}
            </Select> */}
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          sx={{ marginRight: "15px" }}
          disabled={!selectedBook}
          onClick={handleSelect}
        >
          Select
        </Button>
      </DialogActions>
    </Dialog>
  );
}

BookListingDialog.propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.func,
  handleBookChange: PropTypes.func,
};
