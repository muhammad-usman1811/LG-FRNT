export const chatHistoryReducer = (state = {}, action) => {
  switch (action.type) {
    case "CHAT_HISTORY_REQUEST":
      return { loading: true };
    case "CHAT_HISTORY_SUCCESS":
      return { loading: false, history: action.payload, historyReset: false };
    case "CHAT_HISTORY_FAIL":
      return { loading: false, error: action.payload };
    case "CHAT_HISTORY_RESET":
      return {};
    default:
      return state;
  }
};

export const editTitleReducer = (state = {}, action) => {
  switch (action.type) {
    case "EDIT_TITLE_REQUEST":
      return { loading: true };
    case "EDIT_TITLE_SUCCESS":
      return { loading: false, message: action.payload, success: true };
    case "EDIT_TITLE_FAIL":
      return { loading: false, error: action.payload };
    case "EDIT_TITLE_RESET":
      return {};
    default:
      return state;
  }
};

export const deleteChatReducer = (state = {}, action) => {
  switch (action.type) {
    case "DELETE_CHAT_REQUEST":
      return { loading: true };
    case "DELETE_CHAT_SUCCESS":
      return { loading: false, message: action.payload, success: true };
    case "DELETE_CHAT_FAIL":
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const newChatReducer = (state = {}, action) => {
  switch (action.type) {
    case "NEW_CHAT_REQUEST":
      return { loading: true };
    case "NEW_CHAT_SUCCESS":
      return { loading: false, isClicked: true };
    case "NEW_CHAT_FAIL":
      return { loading: false, error: action.payload };
    case "NEW_CHAT_RESET":
      return {};
    default:
      return state;
  }
};

export const chatTitlesReducer = (state = [], action) => {
  switch (action.type) {
    case "GET_CHAT_TITLES_REQUEST":
      return { loading: true };
    case "GET_CHAT_TITLES_SUCCESS":
      return { loading: false, titles: action.payload };
    case "GET_CHAT_TITLES_FAIL":
      return { loading: false, error: action.payload };
    case "GET_CHAT_TITLES_RESET":
      return {};
    default:
      return state;
  }
};

export const checkServerReducer = (state = { isServerUp: true }, action) => {
  switch (action.type) {
    case "SET_SERVER_STATUS":
      return { isServerUp: action.payload };
    default:
      return state;
  }
};
