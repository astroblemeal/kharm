import styles from "../styles/Feed.module.css";
import btnStyles from "../styles/Buttons.module.css";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import moment from "moment";
import Axios from "../config/axios";
import { Button, CircularProgress } from "@material-ui/core";
import PeopleAltRoundedIcon from "@material-ui/icons/PeopleAltRounded";

function JoinSession({ session }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const { account, token } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const body = { session_id: session._id };

  const timeDiff = Date.now() - new Date(session.date_and_time);
  const isHost = session.host === account?._id;
  const isJoined = session.participants.includes(account?._id);
  const isStart = timeDiff >= 0 && timeDiff <= 300000 && (isJoined || isHost);
  const isFull = session.participants.length === 5 && !isJoined && !isHost;
  const notLoggedIn = () => {
    dispatch({ type: "TOAST", payload: { txt: "Please login", type: "error" } });
  };

  const [, setRender] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setRender((prev) => (prev += 1));
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const clickJoin = async () => {
    setLoading(true);
    dispatch({ type: "TOAST", payload: { txt: "Sending payload...", type: "loading" } });
    try {
      const response = await Axios(token).post("/api/session/join", body);
      dispatch({ type: "SESSION_UPDATED", payload: response.data.session });
      dispatch({ type: "ACCOUNT_UPDATED", payload: response.data.account });
      dispatch({ type: "TOAST", payload: { txt: response.data.message, type: "success" } });
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

  const clickUnjoin = async () => {
    setLoading(true);
    dispatch({ type: "TOAST", payload: { txt: "Sending payload...", type: "loading" } });
    try {
      const response = await Axios(token).post("/api/session/unjoin", body);
      dispatch({ type: "SESSION_UPDATED", payload: response.data.session });
      dispatch({ type: "ACCOUNT_UPDATED", payload: response.data.account });
      dispatch({ type: "TOAST", payload: { txt: response.data.message, type: "success" } });
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

  const clickHostKill = async () => {
    setLoading(true);
    dispatch({ type: "TOAST", payload: { txt: "Sending payload...", type: "loading" } });
    try {
      const response = await Axios(token).post("/api/session/uncreate", body);
      dispatch({ type: "SESSION_DELETED", payload: response.data.sessionId });
      dispatch({ type: "ACCOUNT_UPDATED", payload: response.data.account });
      dispatch({ type: "TOAST", payload: { txt: response.data.message, type: "success" } });
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

  const clickStart = () => {
    if (process.env.NODE_ENV === "production") {
      dispatch({ type: "TOAST", payload: { txt: "Under Development", type: "error" } });
    } else {
      router.push(`/session/${session._id}`);
    }
  };

  return (
    <article className={styles.session}>
      <table>
        <thead>
          <tr className={styles.row1}>
            <th>Time</th>
            <th>Topic</th>
          </tr>
        </thead>
        <tbody>
          <tr className={styles.row2}>
            <td>{moment(new Date(session.date_and_time)).format("H:mm")}</td>
            <td>{session.main_category}</td>
          </tr>
          <tr className={styles.row3}>
            <td>
              <PeopleAltRoundedIcon fontSize='small' />
              {session.participants.length + 1}/6
            </td>
            <td>{session.sub_category}</td>
          </tr>
        </tbody>
      </table>

      {loading ? (
        <CircularProgress color='secondary' />
      ) : isFull ? (
        <Button className={btnStyles.joinSess} disabled={true}>
          FULL
        </Button>
      ) : isStart ? (
        <Button className={btnStyles.joinSess} onClick={clickStart}>
          START
        </Button>
      ) : isHost ? (
        <Button className={btnStyles.unjoinSess} onClick={clickHostKill}>
          KILL
        </Button>
      ) : isJoined ? (
        <Button className={btnStyles.unjoinSess} onClick={clickUnjoin}>
          EXIT
        </Button>
      ) : (
        <Button className={btnStyles.joinSess} onClick={account ? clickJoin : notLoggedIn}>
          JOIN
        </Button>
      )}
    </article>
  );
}

export default JoinSession;
