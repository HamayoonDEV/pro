import React from "react";
import styles from "./Login.module.css";
import InputText from "../InputText/InputText";
import { useFormik } from "formik";
import LoginSchema from "../../Schemas/LoginSchema";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { login } from "../../api/internal";
import { setUser } from "../../store/userSlice";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const { values, touched, handleBlur, handleChange, errors } = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: LoginSchema,
  });
  const handleLogin = async () => {
    const data = {
      username: values.username,
      password: values.password,
    };
    try {
      const response = await login(data);
      if (response.status === 200) {
        const user = {
          _id: response.data.user._id,
          username: response.data.user.username,
          email: response.data.user.email,
          password: response.data.user.password,
          auth: response.data.auth,
        };
        dispatch(setUser(user));
        navigate("/");
      } else if (response.code === `ERR_BAD_REQUREST`) {
        setError(response.response.data.errorMessage);
      }
    } catch (error) {}
  };
  return (
    <div className={styles.login}>
      <h1>Login page</h1>
      <div className={styles.input}></div>
      <InputText
        className={styles.text}
        type="text"
        name="username"
        placeholder="username"
        value={values.username}
        onBlur={handleBlur}
        onChange={handleChange}
        error={errors.username && touched.username ? 1 : undefined}
        errormessage={errors.username}
      />
      <InputText
        className={styles.text2}
        type="password"
        name="password"
        placeholder="password"
        value={values.password}
        onBlur={handleBlur}
        onChange={handleChange}
        error={errors.password && touched.password ? 1 : undefined}
        errormessage={errors.password}
      />
      <div className={styles.button}>
        <button onClick={handleLogin}>Login</button>
        <span>
          Don't have an account?<button>Register</button>
        </span>
      </div>
      <p>{error}</p>
    </div>
  );
};

export default Login;
