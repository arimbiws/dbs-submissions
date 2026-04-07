import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import useInput from "../hooks/useInput";
import { register } from "../utils/network-data";
import { LocaleContext } from "../contexts/LocaleContext";

function Register() {
  const [name, onNameChange] = useInput("");
  const [email, onEmailChange] = useInput("");
  const [password, onPasswordChange] = useInput("");
  const [confirmPassword, onConfirmPasswordChange] = useInput("");
  const navigate = useNavigate();
  const { locale } = useContext(LocaleContext);

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      alert(locale === "id" ? "Password dan konfirmasi password tidak cocok!" : "Password and confirm password do not match!");
      return;
    }

    const { error } = await register({ name, email, password });
    if (!error) {
      alert(locale === "id" ? "Pendaftaran berhasil! Silakan login." : "Sign Up successful! Please login.");
      navigate("/"); 
    }
  };

  return (
    <section className="auth-page">
      <h2>{locale === "id" ? "Buat Akun Baru!" : "Create a New Account!"}</h2>
      <p>{locale === "id" ? "Isi form data untuk memulai" : "Filled the form to start"}</p>

      <form onSubmit={onSubmitHandler} className="input-login">
        <label htmlFor="name">{locale === "id" ? "Nama" : "Name"}</label>
        <input type="text" id="name" value={name} onChange={onNameChange} required />

        <label htmlFor="email">Email</label>
        <input type="email" id="email" value={email} onChange={onEmailChange} required />

        <label htmlFor="password">Password</label>
        <input type="password" id="password" value={password} onChange={onPasswordChange} required />

        <label htmlFor="confirmPassword">{locale === "id" ? "Konfirmasi Password" : "Confirm Password"}</label>
        <input type="password" id="confirmPassword" value={confirmPassword} onChange={onConfirmPasswordChange} required />

        <button type="submit">{locale === "id" ? "Daftar" : "Sign Up"}</button>
      </form>
      <p>
        {locale === "id" ? "Sudah punya akun?" : "Already have an account?"} <Link to="/">{locale === "id" ? "Login di sini" : "Login here"}</Link>
      </p>
    </section>
  );
}

export default Register;
