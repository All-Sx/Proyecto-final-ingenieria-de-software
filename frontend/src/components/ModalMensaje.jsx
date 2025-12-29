import { CheckCircle, XCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
import { useModal } from "../context/ModalContext";

export default function ModalMensaje() {
  const { darkMode } = useTheme();
  const { modal, closeModal } = useModal();

  const isSuccess = modal.tipo === "success";

  return (
    <AnimatePresence>
      {modal.visible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className={`w-full max-w-md p-6 rounded-2xl shadow-xl text-center
              ${darkMode ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900"}
            `}
          >
            <div className="flex justify-center mb-4">
              {isSuccess ? (
                <CheckCircle size={48} className="text-green-500" />
              ) : (
                <XCircle size={48} className="text-red-500" />
              )}
            </div>

            <p className="text-lg font-medium mb-6">{modal.mensaje}</p>

            <button
              onClick={closeModal}
              className={`px-6 py-2 rounded-xl font-medium transition
                ${isSuccess
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : "bg-red-600 hover:bg-red-700 text-white"}
              `}
            >
              Aceptar
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
