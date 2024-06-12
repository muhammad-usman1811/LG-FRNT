import config from "../config/api";

export const checkServerStatus = () => async (dispatch) => {
  try {
    const endpoint = `${config.apiUrl}/`;
    const result = await fetch(endpoint, {
      method: "GET",
    });
    if (result.status === 200) {
      dispatch({
        type: "SET_SERVER_STATUS",
        payload: true,
      });
    } else {
      dispatch({
        type: "SET_SERVER_STATUS",
        payload: false,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

export const getChatHistory = (userId, chatId) => async (dispatch) => {
  try {
    dispatch({
      type: "CHAT_HISTORY_REQUEST",
    });
    const endpoint = `${config.apiUrl}/get_chat_history?user_id=${userId}&chat_id=${chatId}`;
    const response = await fetch(endpoint, {
      method: "GET",
    });

    if (response.ok) {
      const responseData = await response.json();
      dispatch({
        type: "CHAT_HISTORY_SUCCESS",
        payload: responseData,
      });
    } else {
      console.log("Chat history not found");
    }
  } catch (error) {
    dispatch({
      type: "CHAT_HISTORY_FAIL",
      payload: error.response?.data?.message ?? error.message,
    });
  }
};

export const editChatTitle = (userId, chatId, newTitle) => async (dispatch) => {
  try {
    dispatch({
      type: "EDIT_TITLE_REQUEST",
    });
    const endpoint = `${config.apiUrl}/edit_chat_title?user_id=${userId}&chat_id=${chatId}&new_chat_title=${newTitle}`;
    const response = await fetch(endpoint, {
      method: "GET",
    });
    if (response.ok) {
      const responseData = await response.json();
      dispatch({
        type: "EDIT_TITLE_SUCCESS",
        payload: responseData.message,
      });
      console.log("Title updated");
    } else {
      console.log("Title not found");
    }
  } catch (error) {
    dispatch({
      type: "EDIT_TITLE_FAIL",
      payload: error.response?.data?.message ?? error.message,
    });
  }
};

export const deleteChat = (userId, chatId) => async (dispatch) => {
  try {
    dispatch({
      type: "DELETE_CHAT_REQUEST",
    });
    const endpoint = `${config.apiUrl}/delete_chat_history?user_id=${userId}&chat_id=${chatId}`;
    const headers = new Headers();
    headers.append("ngrok-skip-browser-warning", "true");
    const response = await fetch(endpoint, {
      method: "GET",
      headers,
    });
    if (response.ok) {
      const responseData = await response.json();
      dispatch({
        type: "DELETE_CHAT_SUCCESS",
        payload: responseData.message,
      });
      console.log("Chat deleted");
    } else {
      console.log("Chat not found");
    }
  } catch (error) {
    dispatch({
      type: "DELETE_CHAT_FAIL",
      payload: error.response?.data?.message ?? error.message,
    });
  }
};

export const getChatTitles = (userId) => async (dispatch) => {
  try {
    dispatch({
      type: "GET_CHAT_TITLES_REQUEST",
    });
    const endpoint = `${config.apiUrl}/get_init_info?user_id=${userId}`;

    const response = await fetch(endpoint, {
      method: "GET",
    });
    if (response.ok) {
      const responseData = await response.json();
      dispatch({
        type: "GET_CHAT_TITLES_SUCCESS",
        payload: responseData,
      });
    }
  } catch (error) {
    dispatch({
      type: "GET_CHAT_TITLES_FAIL",
      payload: "Failed to fetch chat titles.",
    });
  }
};
