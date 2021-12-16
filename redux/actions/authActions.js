import Axios from "../../config/axios";

export const register = (body) => async (dispatch, getState) => {
  dispatch({ type: "AUTH_REQUEST" });
  dispatch({ type: "TOAST", payload: { txt: "Signing up...", type: "loading" } });

  try {
    const response = await Axios().post("/api/auth/register", body);

    dispatch({
      type: "AUTH_SUCCESS",
      payload: { account: response.data.account, token: response.data.token },
    });
    dispatch({ type: "TOAST", payload: { txt: "Signed up!", type: "success" } });
  } catch (error) {
    dispatch({ type: "LOGOUT" });
    dispatch({ type: "TOAST", payload: { txt: error.message, type: "error" } });
    if (error?.response?.data?.error) {
      dispatch({ type: "AUTH_ERROR", error: error.response.data.message });
    }
  }
};

export const login = (body) => async (dispatch, getState) => {
  dispatch({ type: "AUTH_REQUEST" });
  dispatch({ type: "TOAST", payload: { txt: "Signing in...", type: "loading" } });

  try {
    const response = body
      ? await Axios().post("/api/auth/login", body)
      : await Axios(getState().auth.token).get("/api/auth/login");

    dispatch({
      type: "AUTH_SUCCESS",
      payload: { account: response.data.account, token: response.data.token },
    });
    dispatch({ type: "TOAST", payload: { txt: "Signed in!", type: "success" } });
  } catch (error) {
    dispatch({ type: "LOGOUT" });
    dispatch({ type: "TOAST", payload: { txt: error.message, type: "error" } });
    if (error?.response?.data?.error) {
      dispatch({ type: "AUTH_ERROR", error: error.response.data.message });
    }
  }
};

export const logout = () => async (dispatch, getState) => {
  dispatch({ type: "TOAST", payload: { txt: "Signing out...", type: "loading" } });
  dispatch({ type: "LOGOUT" });
  dispatch({ type: "TOAST", payload: { txt: "Signed out!", type: "success" } });
};
