import React from "react";
import { useTheme } from "../context/ThemeContext";
import { Sun, Moon } from "lucide-react";
import { motion } from "framer-motion";

export default function ModoOscuro() {
    const { darkMode, setDarkMode } = useTheme();

    return (
        <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setDarkMode(!darkMode)}
            className={`fixed bottom-6 right-6 z-50 p-3 rounded-full shadow-lg transition-colors ${darkMode
                    ? "bg-yellow-400 text-gray-900 hover:bg-yellow-300"
                    : "bg-gray-800 text-white hover:bg-gray-700"
                }`}
        >
            {darkMode ? <Sun size={22} /> : <Moon size={22} />}
        </motion.button>
    );
}