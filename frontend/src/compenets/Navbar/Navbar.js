import React from "react";
import styles from "./Navbar.module.css";
import { NavLink } from "react-router-dom";

const Navbar = () => {
  return (
    <div className={styles.navbar}>
      <h1>username</h1>
      <div className={styles.menu}>
        <NavLink to="/">Home</NavLink>
        <NavLink to="crypto">Crypto</NavLink>
        <NavLink to="post">Post</NavLink>
        <NavLink to="create">Create Post</NavLink>
      </div>
      <div>
        <NavLink to="login">
          <button>Login</button>
        </NavLink>
        <NavLink to="register">
          <button>Register</button>
        </NavLink>
        <button> Logout</button>
      </div>
    </div>
  );
};

export default Navbar;
