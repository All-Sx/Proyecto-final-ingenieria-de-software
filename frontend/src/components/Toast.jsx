import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, AlertCircle, Info, X } from "lucide-react";

export default function Toast({ mensaje, tipo = "info", duracion = 4000, onClose }) {
  useEffect(() => {
    if (duracion > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duracion);
      
      return () => clearTimeout(timer);
    }
  }, [duracion, onClose]);

  const estilos = {
    success: {
      bg: "bg-green-50 dark:bg-green-900/30",
      border: "border-green-500",
      text: "text-green-800 dark:text-green-200",
      icon: <CheckCircle size={20} className="text-green-600 dark:text-green-400" />
    },
    error: {
      bg: "bg-red-50 dark:bg-red-900/30",
      border: "border-red-500",
      text: "text-red-800 dark:text-red-200",
      icon: <XCircle size={20} className="text-red-600 dark:text-red-400" />
    },
    warning: {
      bg: "bg-yellow-50 dark:bg-yellow-900/30",
      border: "border-yellow-500",
      text: "text-yellow-800 dark:text-yellow-200",
      icon: <AlertCircle size={20} className="text-yellow-600 dark:text-yellow-400" />
    },
    info: {
      bg: "bg-blue-50 dark:bg-blue-900/30",
      border: "border-blue-500",
      text: "text-blue-800 dark:text-blue-200",
      icon: <Info size={20} className="text-blue-600 dark:text-blue-400" />
    }
  };

  const estilo = estilos[tipo] || estilos.info;

  return (
    <motion.div
      initial={{ opacity: 0, y: -50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -50, scale: 0.9 }}
      className={`${estilo.bg} ${estilo.text} border-l-4 ${estilo.border} px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 min-w-[300px] max-w-md`}
    >
      {estilo.icon}
      <p className="flex-1 font-medium text-sm">{mensaje}</p>
      <button
        onClick={onClose}
        className="hover:opacity-70 transition"
      >
        <X size={18} />
      </button>
    </motion.div>
  );
}

export function ToastContainer({ toasts, removeToast }) {
  return (
    <div className="fixed top-4 right-4 z-[9999] space-y-2">
      <AnimatePresence>
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            mensaje={toast.mensaje}
            tipo={toast.tipo}
            duracion={toast.duracion}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
