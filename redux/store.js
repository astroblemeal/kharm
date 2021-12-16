import { createStore, applyMiddleware, combineReducers } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";
import { toastReducer } from "./reducers/toastReducer";
import { authReducer } from "./reducers/authReducer";
import { feedReducer } from "./reducers/feedReducer";

export const store = createStore(
  combineReducers({
    toast: toastReducer,
    auth: authReducer,
    feed: feedReducer,
  }),
  process.env.NODE_ENV === "production"
    ? applyMiddleware(thunk)
    : composeWithDevTools(applyMiddleware(thunk)),
);
