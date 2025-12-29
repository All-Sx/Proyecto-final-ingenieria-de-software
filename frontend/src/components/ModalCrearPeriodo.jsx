import React, { useState } from "react";
import { diasPorMes, formatearFecha } from "../helpers/fechas";
import { MESES, getAniosDisponibles } from "../helpers/periodos";
import FechaSelector from "./FechaSelector";
import { useModal } from "../context/ModalContext";

export default function ModalCrearPeriodo({ onClose, onCrear, darkMode, errorServidor }) {
    const añosDisponibles = getAniosDisponibles();
    const { showModal } = useModal();

    const [nombre, setNombre] = useState("");

    const [inicio, setInicio] = useState({
        año: añosDisponibles[0],
        semestre: "1",
        mes: "",
        dia: ""
    });

    const [fin, setFin] = useState({
        año: añosDisponibles[0],
        semestre: "1",
        mes: "",
        dia: ""
    });

    const selectClasses = `
        w-full rounded-xl border px-3 py-2
        ${darkMode
            ? "bg-gray-800 border-gray-700 text-white"
            : "bg-white border-gray-300 text-gray-900"}
    `;

    const crearPeriodo = async () => {
        if (!nombre.trim()) {
            showModal("error", "Debe ingresar un nombre para el período.");
            return;
        }

        if (!inicio.mes || !inicio.dia || !fin.mes || !fin.dia) {
            showModal("error", "Debe completar todas las fechas.");
            return;
        }

        const fechaInicio = new Date(inicio.año, inicio.mes - 1, inicio.dia);
        const fechaFin = new Date(fin.año, fin.mes - 1, fin.dia);

        if (fechaFin <= fechaInicio) {
            showModal(
                "error",
                "La fecha de término debe ser posterior a la fecha de inicio."
            );
            return;
        }

        try {
            await onCrear({
                nombre,
                fecha_inicio: formatearFecha(fechaInicio),
                fecha_fin: formatearFecha(fechaFin),
            });

            showModal("success", "Período creado correctamente.");
            onClose();

        } catch (err) {
            const backendMessage =
                err.response?.data?.message ||
                err.response?.data?.error ||
                "Error al crear el período.";

            showModal("error", backendMessage);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className={`p-8 rounded-2xl w-full max-w-lg ${darkMode ? "bg-gray-900" : "bg-white"}`}>
                <h2 className="text-xl font-bold mb-6">Crear período</h2>
                {/* NOMBRE */}
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Nombre del período</label>
                    <input
                        className={selectClasses}
                        value={nombre}
                        onChange={e => setNombre(e.target.value)}
                        placeholder="Ej: 2025-2 → 2026-1"
                    />
                </div>
                {/* FECHA INICIO */}
                <h3 className="font-semibold mb-2">Fecha inicio</h3>
                <FechaSelector data={inicio} setData={setInicio} selectClasses={selectClasses} />
                {/* FECHA FIN */}
                <h3 className="font-semibold mt-4 mb-2">Fecha término</h3>
                <FechaSelector data={fin} setData={setFin} selectClasses={selectClasses} />

                <div className="flex justify-end gap-3 mt-6">
                    <button onClick={onClose}>Cancelar</button>
                    <button
                        onClick={crearPeriodo}
                        className="bg-purple-600 text-white px-4 py-2 rounded-xl"
                    >
                        Crear período
                    </button>
                </div>
            </div>
        </div>
    );
};




