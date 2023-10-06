import React from "react";
import styles from "./InputText.module.css";
const InputText = (props) => {
  return (
    <div className={styles.input}>
      <input {...props} />
      {props.error && <p>{props.errormessage}</p>}
    </div>
  );
};

export default InputText;
