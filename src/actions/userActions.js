import axios from "axios";

export const login = (username, password) => async (dispatch) => {
  try {
    dispatch({
      type: "USER_LOGIN_REQUEST",
    });

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const { data } = await axios.post(
      "/api/users/login",
      { username, password },
      config
    );
    localStorage.setItem("userInfo", JSON.stringify(data));
    dispatch({
      type: "USER_LOGIN_SUCCESS",
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: "USER_LOGIN_FAIL",
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const logout = () => (dispatch) => {
  localStorage.removeItem("userInfo");

  dispatch({ type: "USER_LOGOUT" });
  window.location.replace("/");
};
