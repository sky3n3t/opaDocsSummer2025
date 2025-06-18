import React from "react";
import styles from "./styles.module.css";
export default function Modal({ content, setShowModal }) {
  return (
    <div className={styles.modalBack}>
      <div className={styles.modalContainer}>
        {content}
        <button style={{ position: "fixed", alignSelf: "flex-end" }} onClick={() => setShowModal(false)}>
          Close
        </button>
      </div>
    </div>
  );
}
