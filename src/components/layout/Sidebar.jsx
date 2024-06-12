import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import AddIcon from "@mui/icons-material/Add";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import DoneIcon from "@mui/icons-material/Done";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  editChatTitle,
  getChatHistory,
  deleteChat,
  getChatTitles,
} from "../../actions/chatActions";

const Sidebar = ({ isVisible }) => {
  const dispatch = useDispatch();

  const [selectedChat, setSelectedChat] = useState(-1);
  const [chatTitlesList, setChatTitlesList] = useState([]);
  const [newTitle, setNewTitle] = useState("");

  const chatTitles = useSelector((state) => state.chatTitles);
  const { titles, error } = chatTitles;

  const [isEditing, setIsEditing] = useState(titles?.map(() => false));

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const chatHistory = useSelector((state) => state.chatHistory);
  const { history } = chatHistory;

  const editChat = useSelector((state) => state.editChat);
  const { success: successEdit } = editChat;

  const deleteChatStatus = useSelector((state) => state.deleteChat);
  const { success: successDelete } = deleteChatStatus;

  const handleListItemClick = (index, chatId) => {
    setSelectedChat(index);
    dispatch(getChatHistory(userInfo._id, chatId));
  };

  const handleNewChatClick = () => {
    setSelectedChat(-1);
    dispatch({ type: "CHAT_HISTORY_RESET" });
    dispatch({ type: "NEW_CHAT_SUCCESS" });
  };

  const handleEditTitle = async (index) => {
    setNewTitle(chatTitlesList[index].chat_title);
    setIsEditing((prevState) => {
      const newEditingState = [...prevState];
      newEditingState[index] = true;
      return newEditingState;
    });
  };

  const handleSaveEdit = (index) => {
    dispatch(editChatTitle(userInfo._id, history.chat_id, newTitle));
    setNewTitle("");
    setIsEditing((prevState) => {
      const newEditingState = [...prevState];
      newEditingState[index] = false;
      return newEditingState;
    });
  };

  const handleCancelEdit = (index) => {
    setNewTitle("");
    setIsEditing((prevState) => {
      const newEditingState = [...prevState];
      newEditingState[index] = false;
      return newEditingState;
    });
  };

  const handleDeleteChat = (event) => {
    event.stopPropagation();
    const userConfirmed = window.confirm(
      "Are you sure you want to delete this chat?"
    );
    if (userConfirmed) {
      dispatch(deleteChat(userInfo._id, history.chat_id));
      dispatch({ type: "CHAT_HISTORY_RESET" });
      setSelectedChat(-1);
    }
  };

  useEffect(() => {
    if (titles) {
      setChatTitlesList(titles);
      const initialEditingState = titles.map(() => false);
      setIsEditing(initialEditingState);
    }
    if (error) {
      toast.error(error, { position: "top-right" });
    }
  }, [titles, error, dispatch]);

  useEffect(() => {
    dispatch(getChatTitles(userInfo?._id));
  }, [successEdit, successDelete, userInfo, dispatch]);

  return (
    <Box
      sx={{
        display: { xs: isVisible ? "flex" : "none", sm: "flex" },
        flexDirection: "column",
        flex: 1,
        p: 2,
        bgcolor: "#F5F5F5",
        borderRight: "1px solid #ccc",
      }}
    >
      <Button
        fullWidth
        variant="outlined"
        startIcon={<AddIcon />}
        sx={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "2px",
          color: "#003D78",
          textTransform: "none",
        }}
        onClick={handleNewChatClick}
      >
        New Chat
      </Button>
      <List sx={{ overflowY: "auto" }}>
        {chatTitlesList?.map((title, index) => (
          <ListItem key={index} disablePadding>
            <ListItemButton
              sx={{ borderRadius: "8px" }}
              selected={selectedChat === index}
              onClick={() => handleListItemClick(index, title.chat_id)}
            >
              <ListItemIcon>
                <ChatBubbleOutlineIcon fontSize="small" />
              </ListItemIcon>
              {isEditing[index] ? (
                <Stack direction="row">
                  <input
                    style={{ width: "90%", marginLeft: "-25px" }}
                    type="text"
                    autoFocus
                    value={newTitle}
                    onChange={(e) => {
                      e.stopPropagation();
                      setNewTitle(e.target.value);
                    }}
                  />
                  <IconButton
                    edge="end"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSaveEdit(index);
                    }}
                  >
                    <DoneIcon fontSize="small" />{" "}
                  </IconButton>
                  <IconButton
                    edge="end"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCancelEdit(index);
                    }}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Stack>
              ) : (
                <>
                  <Typography
                    variant="subtitle2"
                    sx={{ marginLeft: -3, textAlign: "left", width: "80%" }}
                  >
                    {title.chat_title}
                  </Typography>
                  {selectedChat === index && (
                    <Stack
                      width="20%"
                      direction="row"
                      display="flex"
                      justifyContent="flex-end"
                    >
                      <IconButton
                        edge="end"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditTitle(index);
                        }}
                      >
                        <EditIcon fontSize="small" />{" "}
                      </IconButton>
                      <IconButton
                        edge="end"
                        onClick={(e) => handleDeleteChat(e)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Stack>
                  )}
                </>
              )}
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Box display="flex" marginTop="auto">
        <footer
          style={{
            display: "flex",
            color: "#6C6C6C",
            fontWeight: "bold",
            gap: "10px",
            cursor: "pointer",
            marginLeft: "25px",
          }}
        >
          <Typography variant="subtitle2">Powered By:</Typography>
          <a href="https://digifloat.com/" rel="noreferrer" target="_blank">
            <img
              style={{ width: "90px", height: "23px" }}
              src="/images/df_logo.png"
              alt="df-logo"
            />
          </a>
        </footer>
      </Box>
      <ToastContainer />
    </Box>
  );
};

export default Sidebar;
