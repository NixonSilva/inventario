import { Modal, Button, Form } from "react-bootstrap";
import "./styles/MessageModal.css";
import check from "./assets/icons/Icono-Check-azul.svg";
import fail from "./assets/icons/Icono-error-azul.svg";
import info from "./assets/icons/Icono-informacion-azul.svg";
import warning from "./assets/icons/Icono-advertencia-Azul.svg";
import { useEffect, useState } from "react";

const MessageModal = ({
  show,
  handleClose,
  title,
  body,
  buttons,
  imageType,
  buttonAlignment = "vertical",
  showTextInput = false,
  textInputLabel = "Ingrese texto",
  textInputPlaceholder = "",
  textInputValue = "",
  onTextInputChange = () => {},
  textInputRequired = false
}) => {
  const getImageSrc = () => {
    switch (imageType) {
      case "check":
        return check;
      case "fail":
        return fail;
      case "info":
        return info;
      case "warning":
        return warning;
      default:
        return null;
    }
  };

  const imageSrc = getImageSrc();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => {
      window.removeEventListener("resize", checkIfMobile);
    };
  }, []);

  const getButtonContainerClass = () => {
    if (buttonAlignment === "modalTurnos") {
      return "d-flex justify-content-center gap-2";
    }
    return "d-flex flex-column align-items-center";
  };

  const getOrderedButtons = () => {
    if (buttonAlignment === "modalTurnos" && isMobile) {
      return [...buttons].reverse();
    }
    return buttons;
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
      className="rounded-modal"
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header className="modal-header d-flex flex-column align-items-center border-0 pt-4">
        {imageSrc && (
          <div className="d-flex align-items-center justify-content-center mb-3">
            <img src={imageSrc} alt="Icono" className="modal_imagen" />
          </div>
        )}
        <h3 className="modal-title-centered">{title}</h3>
      </Modal.Header>

      <Modal.Body className="modal-body text-center">
        {body && <div className="mensaje-modal mb-3">{body}</div>}

        {showTextInput && (
          <Form.Group className="mt-3 text-start textoModal">
            <Form.Label>
              {textInputLabel}
              {textInputRequired && <span className="text-danger"> *</span>}
            </Form.Label>
            <Form.Control
              as="input"
              placeholder={textInputPlaceholder}
              value={textInputValue}
              onChange={(e) => onTextInputChange(e.target.value)}
              className="form-control color-placeholder"
              required={textInputRequired}
            />
          </Form.Group>
        )}
      </Modal.Body>

      <Modal.Footer className={`border-0 pb-4 ${getButtonContainerClass()}`}>
        {getOrderedButtons().map((button, index) => (
          <Button key={index} onClick={button.onClick} className={button.clase}>
            {button.label}
          </Button>
        ))}
      </Modal.Footer>
    </Modal>
  );
};

export default MessageModal;
