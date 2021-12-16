import styles from "../styles/Modal.module.css";

function Modal({ children, clickClose }) {
  return (
    <div className={styles.bg}>
      <div className={styles.container}>
        <button className={styles.closeBtn} onClick={clickClose}>
          &times;
        </button>
        {children}
      </div>
    </div>
  );
}

export default Modal;
