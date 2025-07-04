import React, { useState } from "react";
import "../styles/LoginModal.css";
import { useNavigate } from "react-router-dom";
import config from "http://172.20.158.193/inventario_navesoft//backend/config/configuration.php";
import Alert from "@mui/material/Alert";
import BeatLoader from "react-spinners/BeatLoader";
import MessageModal from "../MessageModal";

const OlvidoPasswordInterno = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState("");
  const [responseMessage, setResponseMessage] = useState();
  const [resetButton, setResetButton] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);
  const navigate = useNavigate();
  const redirectToPage = () => {
    closeModal();
    onClose();
    navigate("/login-navemar");
  };

  const buttons = [{ label: "Aceptar", onClick: redirectToPage }];

  const handlePasswordReset = async (event) => {
    event.preventDefault();
    setResponseMessage("");
    setResetButton(false);
    try {
      const response = await fetch(`${config.apiUrl}/generar-token-interno`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      setResponseMessage(data.message);
      setResetButton(true);
      if (response.ok && data.message === "OK") {
        openModal();
      }
    } catch (error) {
      setResponseMessage("Error: " + error);
      setResetButton(true);
    }
  };

  const handleClose = () => {
    setResponseMessage("");
    setResetButton(true);
    setEmail("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="modal-overlay">
        <div className="modal-container-clave">
          <div className="modal-margin">
            <button className="modal-close" onClick={handleClose}>
              ×
            </button>
            <h3 className="modal-title my-4">Ingrese su correo para restablecer la contraseña</h3>
            {responseMessage && (
              <Alert severity="info" onClose={() => {}}>
                {responseMessage}
              </Alert>
            )}
            <form className="reset-form" onSubmit={handlePasswordReset}>
              <input
                type="email"
                className="input-field form-control mb-4"
                id="p_email"
                name="p_email"
                placeholder="Correo*"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                maxLength={100}
                autoComplete="off"
                required
              />
              {resetButton ? (
                <button type="submit" className="login-button">
                  Aceptar
                </button>
              ) : (
                <BeatLoader color="#0082c6" size={15} margin={5} />
              )}
              {resetButton ? (
                <button type="button" onClick={handleClose} className="login-button-cancelar mb-4">
                  Cancelar
                </button>
              ) : (
                ""
              )}
            </form>
          </div>
        </div>
      </div>
      <MessageModal
        show={showModal}
        handleClose={closeModal}
        title={"Se ha generado la solicitud"}
        body={"En breve recibirá un correo electrónico con un enlace para actualizar su contraseña"}
        buttons={buttons}
        imageType="check"
      />
    </>
  );
};

export default OlvidoPasswordInterno;
