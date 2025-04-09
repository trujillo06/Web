// src/utils/alertUtils.js
import Swal from "sweetalert2";

const COLORS = {
  confirmar: "#005EA0",    // Azul institucional
  cancelar: "#6C757D",     // Gris neutro
  exito: "#28A745",        // Verde éxito
  error: "#DC3545",        // Rojo error
  advertencia: "#FFA000",  // Naranja advertencia
};

export const mostrarAlertaExito = (titulo, texto = "") => {
  Swal.fire({
    icon: "success",
    title: titulo,
    text: texto,
    confirmButtonColor: COLORS.confirmar,
    heightAuto: false,
  });
};

export const mostrarAlertaError = (titulo, texto = "") => {
  Swal.fire({
    icon: "error",
    title: titulo,
    text: texto,
    confirmButtonColor: COLORS.error,
    heightAuto: false,
  });
};

export const mostrarAlertaAdvertencia = (titulo, texto = "") => {
  Swal.fire({
    icon: "warning",
    title: titulo,
    text: texto,
    confirmButtonColor: COLORS.advertencia,
    heightAuto: false,
  });
};

export const mostrarAlertaConfirmacion = ({
  titulo = "¿Estás seguro?",
  texto = "Esta acción no se puede deshacer.",
  confirmarTexto = "Sí, confirmar",
  cancelarTexto = "Cancelar",
  onConfirmar = () => {},
  esEliminacion = false, // ✅ Para usar rojo si es una eliminación
}) => {
  Swal.fire({
    icon: "warning",
    title: titulo,
    text: texto,
    showCancelButton: true,
    confirmButtonText: confirmarTexto,
    cancelButtonText: cancelarTexto,
    confirmButtonColor: esEliminacion ? COLORS.error : COLORS.confirmar,
    cancelButtonColor: COLORS.cancelar,
    heightAuto: false,
  }).then((result) => {
    if (result.isConfirmed) onConfirmar();
  });
};
