import React, { useState, useEffect } from "react";
import "../styles/LoginModal.css";
import { Link, useNavigate } from "react-router-dom";
import config from "http://172.20.158.193/inventario_navesoft//backend/config/configuration.php";
//import BeatLoader from "react-spinners/BeatLoader";
import Alert from "@mui/material/Alert";
import { useAuth } from "../AutoContext";
import OlvidoPasswordInterno from "./OlvidoPasswordInterno";

const LoginInterno = () => {
  const [nit, setNit] = useState("");
  const [password, setPassword] = useState("");
  const { loginInterno, internalUser } = useAuth();
  const [responseMessage, setResponseMessage] = useState();
  const [loginButton, setloginButton] = useState(true);
  const [isPasswordResetOpen, setIsPasswordResetOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (internalUser) {
      navigate("/panel-navemar");
    }
  }, [internalUser, navigate]);

  useEffect(() => {
    const handlePopState = () => {
      navigate("/login-navemar");
    };

    window.history.pushState(null, null, window.location.pathname);
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [navigate]);

  const handleLogin = async (event) => {
    event.preventDefault();
    setResponseMessage("");
    setloginButton(false);
    try {
      const response = await fetch(`${config.apiUrlInterno}/login-navemar-interno`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: nit, password: password }),
        credentials: "omit",
      });
      const data = await response.json();
      if (data.status === "success") {
        loginInterno(
          {
            nombreCliente: data.nombre,

            perfil: data.perfil,
            proceso: data.proceso,
            email: data.email,
            id_usuario: data.id_usuario,
            cod_oficina: data.cod_oficina,
            lineas: data.cod_linea,
          },
          data.authToken,
          data.expiration
        );
        navigate("/panel-navemar");
        setNit("");
        setPassword("");
      } else {
        setResponseMessage(data.message);
        setloginButton(true);
      }
    } catch (error) {
      setResponseMessage("Login error: " + error);
      setloginButton(true);
    }
  };

  const handlePasswordResetClick = () => {
    setIsPasswordResetOpen(true);
  };

  return (
    <div className="div-login">
      <div className="modal-container">
        <div className="modal-margin">
          <h1 className="modal-title my-4">Iniciar sesión</h1>
          {responseMessage && <Alert severity="error">{responseMessage}</Alert>}
          <form className="login-form" onSubmit={handleLogin}>
            <input
              type="text"
              className="input-field form-control"
              id="ptweb_nit"
              name="ptweb_nit"
              placeholder="Correo o Usuario*"
              value={nit}
              onChange={(e) => setNit(e.target.value)}
              maxLength={100}
              autoComplete="off"
              required
            />
            <input
              type="password"
              className="password-field form-control"
              id="ptweb_clave"
              name="ptweb_clave"
              placeholder="Contraseña*"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              maxLength={8}
              required
            />
            {loginButton ? (
              <button type="submit" className="login-button mb-2">
                Entrar
              </button>
            ) : (
              //<BeatLoader color="#0082c6" size={15} margin={20} />
            )}
            <Link onClick={handlePasswordResetClick} className="forgot-password mb-4">
              ¿Olvidó la contraseña?
            </Link>
          </form>
          <div className="register-section">
            <span className="titulo-registro">
              ¿No tiene cuenta?
              <Link to="/registrese-navemar" className="ms-3 register-link">
                Regístrese ahora
              </Link>{" "}
            </span>
          </div>
        </div>
        <div className="alternative-login">
          <span className="">
            Para ingresar al sitio web de Navemar
            <br />
            <Link to="/" target="_top" className="company-link">
              haga clic aquí
            </Link>
          </span>
        </div>
      </div>
      <OlvidoPasswordInterno isOpen={isPasswordResetOpen} onClose={() => setIsPasswordResetOpen(false)} />
    </div>
  );
};

export default LoginInterno;
