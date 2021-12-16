import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import Axios from "../../config/axios";
import Head from "next/head";
import Header from "../../components/Header";
import Session from "../../components/Session";
import { CircularProgress } from "@material-ui/core";

export default function SessionPage() {
  const router = useRouter();
  const session_id = router.query.session_id;
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState({});

  const fetchSession = async () => {
    setLoading(true);
    try {
      const response = await Axios(token).get("/api/session/" + session_id);
      setSession(response.data.session);
    } catch (error) {
      console.error(error.message);
      if (error?.response?.data?.error) {
        dispatch({ type: "TOAST", payload: { txt: error.response.data.message, type: "error" } });
      } else {
        dispatch({ type: "TOAST", payload: { txt: error.message, type: "error" } });
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    if (session_id) fetchSession();
  }, [session_id, token]);

  return (
    <div className={`page`}>
      <Head>
        <title>Session || Karmic</title>
        <meta name='description' content='Karmic' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Header />

      {loading ? (
        <center>
          <CircularProgress />
        </center>
      ) : (
        <Session session={session} />
      )}
    </div>
  );
}
