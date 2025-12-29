import { useState, useCallback } from "react";

let toastId = 0;

export function useToast() {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((mensaje, tipo = "info", duracion = 4000) => {
    const id = toastId++;
    
    setToasts((prev) => [...prev, { id, mensaje, tipo, duracion }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const success = useCallback((mensaje, duracion) => {
    addToast(mensaje, "success", duracion);
  }, [addToast]);

  const error = useCallback((mensaje, duracion) => {
    addToast(mensaje, "error", duracion);
  }, [addToast]);

  const warning = useCallback((mensaje, duracion) => {
    addToast(mensaje, "warning", duracion);
  }, [addToast]);

  const info = useCallback((mensaje, duracion) => {
    addToast(mensaje, "info", duracion);
  }, [addToast]);

  return {
    toasts,
    removeToast,
    addToast,
    success,
    error,
    warning,
    info
  };
}
