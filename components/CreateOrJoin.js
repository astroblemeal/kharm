import styles from "../styles/CreateOrJoin.module.css";
import btnStyles from "../styles/Buttons.module.css";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import LionSVG from "../icons/LionSVG";
import OwlSVG from "../icons/OwlSVG";
import CreateSessionModal from "./CreateSessionModal";
import { Button } from "@material-ui/core";

function CreateOrJoin() {
  const dispatch = useDispatch();
  const { account } = useSelector((state) => state.auth);
  const notLoggedIn = () => {
    dispatch({ type: "TOAST", payload: { txt: "Please login", type: "error" } });
  };

  const [modal, setModal] = useState(false);
  const toggleModal = () => setModal((prev) => !prev);

  return (
    <section className={styles.container}>
      <div className={styles.lionBg}>
        <div className={styles.lionFg}>
          <div className={styles.lionWrap}>
            <LionSVG />
            <h3>Create a Session</h3>
            <p>It takes courage to ask others for help</p>

            <Button
              className={btnStyles.blueRadient}
              style={{ marginTop: "11px" }}
              onClick={account ? toggleModal : notLoggedIn}>
              Create
            </Button>
          </div>
        </div>
      </div>

      {modal && <CreateSessionModal toggleModal={toggleModal} />}

      <div className={styles.owlBg}>
        <div className={styles.owlFg}>
          <div className={styles.owlWrap}>
            <OwlSVG />
            <h3>Join a Session</h3>
            <p>Share your wisdom and help others</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CreateOrJoin;
