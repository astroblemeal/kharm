import "../styles/globals.css";
import { Fragment, useEffect } from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import { store } from "../redux/store";
import { login } from "../redux/actions/authActions";
import ToasterNotifications from "../components/ToasterNotifications";

function MyApp({ ...props }) {
  return (
    <Provider store={store}>
      <InnerApp {...props} />
    </Provider>
  );
}

function InnerApp({ Component, pageProps }) {
  const dispatch = useDispatch();
  const { account, token, loading } = useSelector((state) => state.auth);

  // retrieve token from local storage (SSR cannot use window)
  useEffect(() => {
    if (window) dispatch({ type: "SET_TOKEN", payload: localStorage.getItem("token") ?? null });
  }, []);

  // try to login with existing token
  useEffect(() => {
    if (!account && token && !loading) dispatch(login());
  }, [token, loading]);

  return (
    <Fragment>
      <Component {...pageProps} />
      <ToasterNotifications />
    </Fragment>
  );
}

export default MyApp;
