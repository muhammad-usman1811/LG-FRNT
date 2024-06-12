import { configureStore } from "@reduxjs/toolkit";
import thunk from "redux-thunk";
import { userLoginReducer } from "./reducers/userReducers";
import {
  chatHistoryReducer,
  chatTitlesReducer,
  checkServerReducer,
  deleteChatReducer,
  editTitleReducer,
  newChatReducer,
} from "./reducers/chatReducers";

const reducer = {
  userLogin: userLoginReducer,
  chatTitles: chatTitlesReducer,
  newChat: newChatReducer,
  chatHistory: chatHistoryReducer,
  editChat: editTitleReducer,
  deleteChat: deleteChatReducer,
  serverStatus: checkServerReducer,
};
const middleware = [thunk];

const userInfoFromStorage = localStorage.getItem("userInfo")
  ? JSON.parse(localStorage.getItem("userInfo"))
  : null;

const preloadedState = {
  userLogin: { userInfo: userInfoFromStorage },
};

const store = configureStore({
  reducer,
  middleware,
  preloadedState,
});

export default store;
