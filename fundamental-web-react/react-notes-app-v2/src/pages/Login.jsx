import React, { useContext } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import useInput from "../hooks/useInput";
import { login } from "../utils/network-data";
import { LocaleContext } from "../contexts/LocaleContext";

function Login({ loginSuccess }) {
  const [email, onEmailChange] = useInput("");
  const [password, onPasswordChange] = useInput("");
  const { locale } = useContext(LocaleContext);

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    const { error, data } = await login({ email, password });
    if (!error) loginSuccess(data);
  };

  return (
    <section className="auth-page">
      <h2>{locale === "id" ? "Selamat Datang Kembali!" : "Welcome Back!"}</h2>
      <p>{locale === "id" ? "Masuk dengan akunmu" : "Log into your account"}</p>
      <form onSubmit={onSubmitHandler} className="input-login">
        <label htmlFor="email">Email</label>
        <input type="email" id="email" value={email} onChange={onEmailChange} required />
        <label htmlFor="password">Password</label>
        <input type="password" id="password" value={password} onChange={onPasswordChange} required />
        <button type="submit">{locale === "id" ? "Masuk" : "Login"}</button>
      </form>
      <p>
        {locale === "id" ? "Belum punya akun?" : "Don't have an account?"} <Link to="/register">{locale === "id" ? "Daftar di sini" : "Register here"}</Link>
      </p>
    </section>
  );
}

Login.propTypes = {
  loginSuccess: PropTypes.func.isRequired,
};

export default Login;
