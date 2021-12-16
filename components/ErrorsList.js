import { Children } from "react";
import styles from "../styles/ErrorsList.module.css";

export default function ErrorsList({ errors }) {
  // This component should receive an array of strings !
  return (
    <ul className={styles.ul}>
      {Children.toArray(errors.map((err) => <li className={styles.li}>{err}</li>))}
    </ul>
  );
}
