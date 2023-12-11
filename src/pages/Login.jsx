import { useState } from "react";
import styles from "./Login.module.css";
import PageNav from "../components/PageNav";

function Login() {
  const [email, setEmail] = useState("serdar@mail.com");
  const [password, setPassword] = useState("1234");
  return (
    <main className={styles.login}>
      <PageNav />
      <form className={styles.form}>
        <div className={styles.row}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className={styles.row}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className={styles.row}>
          <button>Login</button>
        </div>
      </form>
    </main>
  );
}

export default Login;
