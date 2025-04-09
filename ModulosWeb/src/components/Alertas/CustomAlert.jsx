import React, { useState } from "react";
import "./CustomAlert.css";

function CustomAlert({ type, title, message, onConfirm, onCancel }) {
  const [isExiting, setIsExiting] = useState(false);

  const handleClose = (confirmed) => {
    setIsExiting(true);
    setTimeout(() => {
      if (confirmed) {
        onConfirm();
      } else {
        onCancel();
      }
    }, 300);
  };

  const icon = {
    success: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        width="64"
        height="64"
      >
        <circle cx="12" cy="12" r="12" fill="#4CAF50" />
        <path
          d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"
          fill="#fff"
        />
      </svg>
    ),
    error: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        width="64"
        height="64"
      >
        <circle cx="12" cy="12" r="12" fill="#F44336" />
        <path
          d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
          fill="#fff"
        />
      </svg>
    ),
    confirm: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        width="64"
        height="64"
      >
        <circle cx="12" cy="12" r="12" fill="#FFA000" />
        <path
          d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"
          fill="#fff"
        />
      </svg>
    ),
    warning: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        width="64"
        height="64"
      >
        <circle cx="12" cy="12" r="12" fill="#FFC107" />
        <path
          d="M12 7v5m0 4h.01"
          stroke="#fff"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  }[type];

  const color = {
    success: "#28a745",
    error: "#dc3545",
    confirm: "#FFA000",
    warning: "#FFC107",
  }[type];

  return (
    <div className={`custom-modal-overlay ${isExiting ? "exiting" : ""}`}>
      <div
        className={`custom-modal ${type} ${isExiting ? "exiting" : ""}`}
        style={{ borderTop: `5px solid ${color}` }}
      >
        <div className="modal-icon" style={{ color }}>
          {icon}
        </div>
        <h3>{title}</h3>
        <p>{message}</p>
        <div className="modal-buttons">
          {type === "confirm" && (
            <button
              onClick={() => handleClose(false)}
              style={{ backgroundColor: "#dc3545" }}
            >
              Cancelar
            </button>
          )}
          <button
            onClick={() => handleClose(true)}
            style={{ backgroundColor: color }}
          >
            {type === "confirm" ? "Confirmar" : "Aceptar"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CustomAlert;
