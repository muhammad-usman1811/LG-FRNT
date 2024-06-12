import React, { useState, useRef, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useQuery } from "react-query";
import PropTypes from "prop-types";
import {
  Box,
  Avatar,
  TextField,
  IconButton,
  Button,
  Tooltip,
  Typography,
  CircularProgress,
  ToggleButton,
  ToggleButtonGroup,
  Skeleton,
  Chip,
} from "@mui/material";
import Zoom from "@mui/material/Zoom";
import { Stack } from "@mui/system";
import CachedIcon from "@mui/icons-material/Cached";
import MenuIcon from "@mui/icons-material/Menu";
import IosShareIcon from "@mui/icons-material/IosShare";
import FormatAlignLeftIcon from "@mui/icons-material/FormatAlignLeft";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import SendIcon from "@mui/icons-material/Send";
import ChangeCircleIcon from "@mui/icons-material/ChangeCircle";
import ThumbDownOffAltIcon from "@mui/icons-material/ThumbDownOffAlt";
import { v4 as uuidv4 } from "uuid";
import { saveAs } from "file-saver";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import config from "../config/api";
import { getChatTitles } from "../actions/chatActions";
import BookListingDialog from "./BookListingDialog";
import ResizablePreview from "./ResizeablePreview";
import AlertDialog from "./AlertDialog";
import Feedback from "./Feedback";

const simplifyResponse = async (userId, chatId) => {
  const endpoint = `${config.apiUrl}/simplify_last_response?user_id=${userId}&chat_id=${chatId}`;
  const response = await fetch(endpoint, { method: "GET" });
  if (!response.ok) {
    throw new Error("Failed to simplify");
  }
  return await response.json();
};

const regenerateResponse = async (userId, chatId) => {
  const endpoint = `${config.apiUrl}/regenerate_last_response?user_id=${userId}&chat_id=${chatId}`;
  const response = await fetch(endpoint, {
    method: "GET",
  });
  if (!response.ok) {
    throw new Error("Failed to regenerate");
  }
  return await response.json();
};

// Default Function Component
const ChatInterface = ({ toggleSidebar }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [chatTitle, setChatTitle] = useState("");
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [finalChatId, setFinalChatId] = useState("");
  const [openListingDialog, setOpenListingDialog] = useState(false);
  const [showhyperlinkContent, setShowHyperlinkContent] = useState([]);
  const [hyperlinkContent, setHyperlinkContent] = useState([]);
  const [alignment, setAlignment] = useState("balanced");
  const [selectedBook, setSelectedBook] = useState(null);
  const [documentSrc, setDocumentSrc] = useState("");
  const [textToHighlight, setTextToHighlight] = useState("");
  const [openAlertDialog, setOpenAlertDialog] = useState(false);
  const [openFeedbackDialog, setOpenFeedbackDialog] = useState(false);
  const [response, setResponse] = useState("");
  const [feedbackGiven, setFeedbackGiven] = useState({});
  const [messageIndex, setMessageIndex] = useState("");

  const chatContentRef = useRef(null);
  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const chatHistory = useSelector((state) => state.chatHistory);
  const { history } = chatHistory;

  const newChat = useSelector((state) => state.newChat);
  const { isClicked } = newChat;

  const editChat = useSelector((state) => state.editChat);
  const { success: successEdit } = editChat;

  const deleteChat = useSelector((state) => state.deleteChat);
  const { success: successDelete } = deleteChat;

  const {
    data: simplifyData,
    error: errorSimplify,
    refetch: refetchSimplify,
  } = useQuery(
    ["simplify", userInfo?._id, finalChatId],
    () => simplifyResponse(userInfo?._id, finalChatId),
    {
      enabled: false,
    }
  );

  const {
    data: regenerateData,
    error: errorRegenerate,
    refetch: refetchRegenerate,
  } = useQuery(
    ["regenerate", userInfo?._id, finalChatId],
    () => regenerateResponse(userInfo?._id, finalChatId),
    {
      enabled: false,
    }
  );

  const handleCloseAlertDialog = () => {
    setOpenAlertDialog(false);
  };

  const handleClosePreview = () => {
    setDocumentSrc(null);
  };

  const handleCloseListingDialog = () => {
    setOpenListingDialog(false);
  };

  const handleInputChange = (event) => {
    setInputMessage(event.target.value);
  };

  const handleFeedbackGiven = (messageIndex) => {
    setFeedbackGiven({ ...feedbackGiven, [messageIndex]: true });
  };

  const handleSendMessage = async () => {
    // Ignore empty messages
    // if (inputMessage.trim() === "") return;
    // if (messages?.length > 1) {
    //   setOpenAlertDialog(true);
    //   return;
    // }
    if (alignment === "precise") {
      const inputPattern1 = /^[0-9]{2}[A-Z]\.\d\.[a-z]$/;
      const inputPattern2 = /\d+(\.\d+)?/g;
      if (
        !inputPattern1.test(inputMessage) &&
        !inputPattern2.test(inputMessage)
      ) {
        toast.error("Invalid input format", { position: "top-right" });
        return;
      }
      var articleNumber =
        inputMessage.match(inputPattern1) || inputMessage.match(inputPattern2);

      if (!articleNumber) {
        toast.error("Invalid input format", { position: "top-right" });
        return;
      }
      var query = `search ${selectedBook?.code} ${articleNumber}`;
      var prompt = `${selectedBook?.full_name}: ${articleNumber}`;
    }
    // Add user message to the chat
    const newMessages = [
      ...(messages || []),
      { text: { response: prompt || inputMessage }, isUser: true },
    ];
    setMessages(newMessages);
    setInputMessage("");

    // Simulate a response from the chatbot (you can replace this with your actual logic)
    const chatbotResponse = await generateChatbotResponse(
      query || inputMessage
    );
    // const chatbotResponse = {
    //   response: "This is a system generated response",
    //   role: "model",
    // };
    if (chatbotResponse) {
      const updatedMessages = [
        ...newMessages,
        {
          text: chatbotResponse,
          isUser: false,
        },
      ];
      setMessages(updatedMessages);
    }
    if (messages.length <= 1) {
      dispatch(getChatTitles(userInfo?._id));
      updateChatTitle();
    }
    // Clear the input field
    //setInputMessage("");
  };

  const generateChatbotResponse = async (userMessage) => {
    let keyword;
    if (alignment === "balanced") {
      keyword = "balanced";
    }
    if (alignment === "precise") {
      keyword = "precise";
    }
    const endpoint = `${config.apiUrl}/${keyword}?query=${userMessage}&user_id=${userInfo._id}&chat_id=${finalChatId}`;
    try {
      setIsLoading(true);
      const response = await fetch(endpoint, {
        method: "GET",
      });
      console.log(response);
      if (!response.ok) {
        throw new Error("Failed to response");
      }
      return await response.json();
    } catch (error) {
      toast.error("Something went wrong. Please try again later.", {
        position: "top-right",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateChatTitle = useCallback(async () => {
    const endpoint = `${config.apiUrl}/get_chat_title?user_id=${userInfo?._id}&chat_id=${finalChatId}`;
    const response = await fetch(endpoint, {
      method: "GET",
    });
    if (response.ok) {
      let title = await response.json();
      setChatTitle(title);
    }
  }, [userInfo, finalChatId]);

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSendMessage();
    }
  };

  const handleCopyClick = (responseText) => {
    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(responseText)
        .then(() => {
          console.log("copied");
        })
        .catch((err) => {
          console.log("Error copying text to clipboard", err);
        });
    } else {
      console.log("Clipboard API is not available");
    }
  };

  const handleExportChat = () => {
    const chatText = messages
      .map((message) => {
        return message.isUser
          ? `User: ${message.text}`
          : `Document Chat: ${message.text}`;
      })
      .join("\n");

    const blob = new Blob([chatText], { type: "text/plain" });

    saveAs(blob, `${chatTitle}.txt`);
  };

  const handleSimplify = async () => {
    try {
      setIsLoading(true);
      await refetchSimplify();
      if (errorSimplify) {
        toast.error(errorSimplify.message, {
          position: "top-right",
        });
      } else {
        if (simplifyData?.status === "failure") {
          toast.error("Cannot simplify as no last response found", {
            position: "top-right",
          });
        } else {
          const updatedMessages = [
            ...messages,
            { text: simplifyData, isUser: false },
          ];
          setMessages(updatedMessages);
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerate = async () => {
    try {
      setIsLoading(true);
      await refetchRegenerate();
      if (errorRegenerate) {
        toast.error(errorRegenerate.message, {
          position: "top-right",
        });
      } else {
        if (regenerateData?.status === "failure") {
          toast.error("Cannot regenerate as no last response found", {
            position: "top-right",
          });
        } else {
          const updatedMessages = [
            ...messages,
            { text: regenerateData, isUser: false },
          ];
          setMessages(updatedMessages);
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreciseChat = (event) => {
    setOpenListingDialog(true);
  };

  const handleToggleContent = (content, index) => {
    setHyperlinkContent((prevState) => {
      const newState = [...prevState];
      newState[index] = content;
      return newState;
    });
    setShowHyperlinkContent((prevState) => {
      const newState = [...prevState];
      newState[index] = !newState[index];
      return newState;
    });
  };

  const handleDocumentSrc = async (event, url, text) => {
    event.preventDefault();
    setDocumentSrc(url);
    const modifiedText = text.replace("Section text: ", "").trim();
    const words = modifiedText.split(" ");
    const sixWords = words.splice(0, 6).join(" ");
    setTextToHighlight(sixWords);
  };

  const updateSelectedBook = (book) => {
    setSelectedBook(book);
  };

  const handleChangeChat = (event, newAlignment) => {
    if (newAlignment !== null) {
      setAlignment(newAlignment);
    }
    if (alignment === "balanced") {
      setSelectedBook(null);
    }
  };

  const handleCloseFeedbackDialog = () => {
    setOpenFeedbackDialog(false);
  };

  const handleFeedbackClick = (response, index) => {
    setResponse(response);
    setOpenFeedbackDialog(true);
    setMessageIndex(index);
  };

  useEffect(() => {
    if (successEdit) {
      updateChatTitle();
      dispatch({ type: "EDIT_TITLE_RESET" });
    }
  }, [successEdit, finalChatId, userInfo, dispatch, updateChatTitle]);

  useEffect(() => {
    chatContentRef.current.scrollTop = chatContentRef.current.scrollHeight;
    if (isClicked || successDelete || !history) {
      setMessages([]);
      setChatTitle("");
      setSelectedBook(null);
      setDocumentSrc("");
      dispatch({ type: "DELETE_CHAT_RESET" });
      dispatch({ type: "NEW_CHAT_RESET" });
    }
  }, [chatContentRef, dispatch, isClicked, successDelete, history]);

  useEffect(() => {
    //Add history to chat interface
    if (history) {
      dispatch({ type: "NEW_CHAT_RESET" });
      setChatTitle(history.chat_title);
      setFinalChatId(history.chat_id);
      setAlignment("balanced");
      setSelectedBook(null);
      setDocumentSrc("");
      const historyMessages = history.messages;
      // const historyMessages = [
      //   {
      //     response: "This is a system generated query response.",
      //     role: "user",
      //   },
      // ];
      if (historyMessages.length > 0) {
        const firstContent = historyMessages[0].content;
        if (firstContent.startsWith("search")) {
          setAlignment("precise");
          setSelectedBook({
            code: "COP",
            format:
              'For article 63A, clause 1 sub-clause a, the search query would be "63A.1.a"',
            full_name: "THE CONSTITUTION OF THE ISLAMIC REPUBLIC OF PAKISTAN",
          });
        }
      }
      const mappedMessages =
        historyMessages?.length > 0 &&
        historyMessages.map((message) => {
          return {
            text: {
              response: message.response || message.content,
              references: message.references,
            },
            isUser: message.role === "user",
          };
        });
      setMessages(mappedMessages);
    }
  }, [history, dispatch]);

  useEffect(() => {
    const newChatId = uuidv4();

    if (!history) {
      setFinalChatId(newChatId);
      setSelectedBook(null);
      setAlignment("balanced");
    }
  }, [history, dispatch, isClicked]);

  return (
    <>
      <Box flex={5} p={2}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid #ccc",
            width: "100%",
            minHeight: "50px",
          }}
        >
          <IconButton
            sx={{ display: { xs: "flex", sm: "none" } }}
            onClick={toggleSidebar}
          >
            <MenuIcon />
          </IconButton>
          <Box
            sx={{
              display: "flex",
              gap: "0.5rem",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography variant="h6" sx={{ marginLeft: "2rem" }}>
              {chatTitle}
            </Typography>
            {history && (
              <Chip
                label={alignment}
                variant="outlined"
                size="small"
                color="primary"
              />
            )}
          </Box>
          {history && (
            <Tooltip title="Export Chat">
              <IconButton variant="contained" onClick={handleExportChat}>
                <IosShareIcon />
              </IconButton>
            </Tooltip>
          )}
        </Box>
        <AlertDialog
          open={openAlertDialog}
          handleClose={handleCloseAlertDialog}
        />
        <Feedback
          open={openFeedbackDialog}
          modelResponse={response}
          handleClose={handleCloseFeedbackDialog}
          messageIndex={messageIndex}
          feedbackGiven={handleFeedbackGiven}
        />
        <Box
          ref={chatContentRef}
          sx={{
            minHeight: "62.5vh",
            maxHeight: "62.5vh",
            overflowY: "auto",
            flex: 1,
          }}
        >
          {messages.length > 0 &&
            messages.map((message, index) => (
              <Box
                key={uuidv4()}
                sx={{
                  padding: "0.5rem",
                  marginBottom: "0.2rem",
                  display: "flex",
                  alignItems: "flex-start",
                  backgroundColor: message.isUser ? "#fff" : "#f5f5f5",
                  width: "95%",
                  whiteSpace: "pre-line",
                  transition: "opacity 0.3s, transform 0.3s",
                  transform: "scale(0.95)",
                  counterIncrement: "item",
                  content: 'counter(item) ". "',
                  borderRadius: "10px",
                }}
              >
                {message.isUser ? (
                  <Avatar
                    variant="circle"
                    sx={{
                      marginRight: "8px",
                      mt: 1,
                      ml: 4,
                      border: "1px solid #ccc",
                    }}
                    src="/images/userPhoto.jpg"
                  />
                ) : (
                  <Avatar
                    variant="circle"
                    sx={{
                      marginRight: "8px",
                      mt: 1,
                      ml: 4,
                    }}
                  >
                    M
                  </Avatar>
                )}
                <Typography
                  variant="body1"
                  textAlign="justify"
                  sx={{
                    padding: "1rem",
                    color: "#565454",
                    //marginBottom: "0.5rem",
                  }}
                >
                  {message.text.response}
                  {message.text.references && (
                    <Typography sx={{ fontWeight: "bold", marginTop: "1rem" }}>
                      References:
                    </Typography>
                  )}
                  {message.text?.references?.map((ref, index) => (
                    <Box
                      key={uuidv4()}
                      sx={{
                        display: "flex",
                        margin: "0.5rem",
                        flexDirection: "column",
                      }}
                    >
                      <Stack display="flex" flexDirection="row" padding="0">
                        <IconButton
                          sx={{ "&:hover": { backgroundColor: "transparent" } }}
                          onClick={() =>
                            handleToggleContent(ref.content, index)
                          }
                        >
                          {showhyperlinkContent[index] ? (
                            <RemoveCircleOutlineIcon fontSize="small" />
                          ) : (
                            <AddCircleOutlineIcon fontSize="small" />
                          )}
                        </IconButton>
                        <a
                          style={{
                            color: "#007bff",
                            textDecoration: "none",
                            padding: "0.25rem",
                            border: "1px solid #616161",
                            borderRadius: "4px",
                            transition: "background-color 0.3s",
                          }}
                          onClick={(e) =>
                            handleDocumentSrc(e, ref.url, ref.content)
                          }
                          onMouseEnter={(e) => {
                            e.target.style.backgroundColor = "#ffffff";
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.backgroundColor = "transparent";
                          }}
                          href={ref.url}
                        >
                          {ref.label}
                        </a>
                      </Stack>
                      {showhyperlinkContent[index] && (
                        <Box sx={{ display: "flex" }}>
                          {hyperlinkContent[index]}
                        </Box>
                      )}
                    </Box>
                  ))}
                  {!message.isUser && (
                    <Stack flexDirection="row" sx={{ marginTop: "10px" }}>
                      <Tooltip title="Copy" arrow>
                        <IconButton
                          onClick={() => handleCopyClick(message.text.response)}
                        >
                          <ContentCopyIcon fontSize="medium" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Bad Response" arrow>
                        <IconButton
                          disabled={feedbackGiven[index]}
                          onClick={() =>
                            handleFeedbackClick(message.text.response, index)
                          }
                        >
                          <ThumbDownOffAltIcon fontSize="medium" />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  )}
                </Typography>
              </Box>
            ))}
          {isLoading && (
            <Box
              display="flex"
              flexDirection="column"
              marginLeft="5%"
              marginRight="5%"
            >
              <Skeleton width="85%" />
              <Skeleton width="85%" animation="wave" />
              <Skeleton width="80%" animation={false} />
            </Box>
          )}
          {/* Conditional Rendering of the Chat Toggle Buttons */}
          {messages.length === 0 && !selectedBook && (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "62.5vh",
                maxHeight: "62.5vh",
                gap: "1rem",
              }}
            >
              <Typography variant="body2">
                Choose a conversation style
              </Typography>
              <ToggleButtonGroup
                color="primary"
                exclusive
                value={alignment}
                onChange={handleChangeChat}
              >
                <ToggleButton
                  sx={{ textTransform: "none", width: "10rem" }}
                  value="balanced"
                >
                  <Tooltip
                    TransitionComponent={Zoom}
                    TransitionProps={{ timeout: 400 }}
                    title="Recommended for quick info"
                    arrow
                    placement="top"
                    PopperProps={{
                      sx: {
                        "& .MuiTooltip-tooltip": {
                          padding: "8px",
                        },
                      },
                    }}
                    slotProps={{
                      popper: {
                        modifiers: [
                          {
                            name: "offset",
                            options: {
                              offset: [0, 12],
                            },
                          },
                        ],
                      },
                    }}
                  >
                    Freeform Legal Inquiry
                  </Tooltip>
                </ToggleButton>

                <ToggleButton
                  sx={{ textTransform: "none", width: "10rem" }}
                  value="precise"
                  onClick={handlePreciseChat}
                >
                  <Tooltip
                    TransitionComponent={Zoom}
                    TransitionProps={{ timeout: 400 }}
                    title="Start a chat, useful for exact findings"
                    arrow
                    placement="top"
                    PopperProps={{
                      sx: {
                        "& .MuiTooltip-tooltip": {
                          padding: "8px",
                        },
                      },
                    }}
                    slotProps={{
                      popper: {
                        modifiers: [
                          {
                            name: "offset",
                            options: {
                              offset: [0, 12],
                            },
                          },
                        ],
                      },
                    }}
                  >
                    Structured Law Query
                  </Tooltip>
                </ToggleButton>
              </ToggleButtonGroup>
              <BookListingDialog
                open={openListingDialog}
                handleClose={handleCloseListingDialog}
                handleBookChange={updateSelectedBook}
              />
            </Box>
          )}
        </Box>
        {/* Container for the simplify & Regenerate Buttons */}
        {documentSrc ? (
          <Stack
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-end",
              width: "79.5%",
              columnGap: 1,
            }}
          >
            {/* Buttons for Resizable Preview */}
            {alignment === "balanced" && (
              <>
                <Button
                  sx={{
                    borderRadius: 2,
                    color: "#003D78",
                    textTransform: "none",
                    marginTop: "20px",
                  }}
                  variant="outlined"
                  onClick={handleSimplify}
                >
                  <FormatAlignLeftIcon fontSize="small" />
                  Simplify
                </Button>
                <Button
                  sx={{
                    borderRadius: 2,
                    color: "#003D78",
                    textTransform: "none",
                    marginTop: "20px",
                  }}
                  variant="outlined"
                  onClick={handleRegenerate}
                >
                  <CachedIcon />
                  Regenerate
                </Button>
              </>
            )}
            {alignment === "precise" && selectedBook && (
              <Button
                sx={{
                  borderRadius: 2,
                  color: "#003D78",
                  textTransform: "none",
                }}
                variant="outlined"
                onClick={handlePreciseChat}
              >
                <ChangeCircleIcon sx={{ marginRight: "0.3rem" }} />
                Change Book
              </Button>
            )}
          </Stack>
        ) : (
          <Stack
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-end",
              width: "79%",
              columnGap: 1,
            }}
          >
            {/* Buttons without Resizable Preview */}
            {alignment === "balanced" && (
              <>
                <Button
                  sx={{
                    borderRadius: 2,
                    color: "#003D78",
                    textTransform: "none",
                    marginTop: "20px",
                  }}
                  variant="outlined"
                  onClick={handleSimplify}
                >
                  <FormatAlignLeftIcon fontSize="small" />
                  Simplify
                </Button>
                <Button
                  sx={{
                    borderRadius: 2,
                    color: "#003D78",
                    textTransform: "none",
                    marginTop: "20px",
                  }}
                  variant="outlined"
                  onClick={handleRegenerate}
                >
                  <CachedIcon />
                  Regenerate
                </Button>
              </>
            )}
            {alignment === "precise" && selectedBook && (
              <Button
                sx={{
                  borderRadius: 2,
                  color: "#003D78",
                  textTransform: "none",
                }}
                variant="outlined"
                onClick={handlePreciseChat}
              >
                <ChangeCircleIcon sx={{ marginRight: "0.3rem" }} />
                Change Book
              </Button>
            )}
          </Stack>
        )}

        <BookListingDialog
          open={openListingDialog}
          handleClose={handleCloseListingDialog}
          handleBookChange={updateSelectedBook}
        />
        {/* Container for Format text and Input field */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
            gap: "0.5rem",
            marginTop: "10px",
          }}
        >
          {selectedBook && (
            <Typography
              variant="caption"
              sx={{
                display: "flex",
                width: "58%",
                borderRadius: "5px",
                paddingLeft: "0.5rem",
                backgroundColor: "#F5F5F5",
              }}
            >
              Input Format: {selectedBook?.format}
            </Typography>
          )}
          <TextField
            sx={{
              whiteSpace: "normal",
              width: "59%",
              backgroundColor: "#EDEDED",
              boxShadow: 3,
              borderRadius: 2,
              color: "#003D78",
            }}
            label={selectedBook?.full_name || "Send a message"}
            variant="outlined"
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            value={inputMessage}
            InputLabelProps={{ shrink: true }}
            InputProps={{
              sx: { borderRadius: 2 },
              endAdornment: (
                <Stack
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <IconButton
                    sx={{ color: "#003D78" }}
                    variant="contained"
                    onClick={handleSendMessage}
                  >
                    {isLoading ? (
                      <CircularProgress color="inherit" size={24} />
                    ) : (
                      <SendIcon />
                    )}
                  </IconButton>
                </Stack>
              ),
            }}
          />
        </Box>
        <ToastContainer />
      </Box>
      {documentSrc && (
        <Box sx={{ flexDirection: "column" }} display="flex" width={300}>
          <ResizablePreview
            documentSrc={documentSrc}
            text={textToHighlight}
            onClose={handleClosePreview}
          />
        </Box>
      )}
    </>
  );
};

export default ChatInterface;

ChatInterface.propTypes = {
  toggleSidebar: PropTypes.func.isRequired,
};
