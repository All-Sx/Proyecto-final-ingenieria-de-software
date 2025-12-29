import React, { useState } from "react";
import FechaSelector from "./FechaSelector";
import { useModal } from "../context/ModalContext";

export default function ModalGestionarPeriodo({
    periodo,
    onClose,
    onGuardar,
    darkMode
}) {
    const [nombre, setNombre] = useState(periodo.nombre);
    const [estado, setEstado] = useState(periodo.estado);

    const [inicio, setInicio] = useState({
        año: periodo.fechaInicio.getFullYear(),
        semestre: "1",
        mes: periodo.fechaInicio.getMonth() + 1,
        dia: periodo.fechaInicio.getDate()
    });

    const [fin, setFin] = useState({
        año: periodo.fechaFin.getFullYear(),
        semestre: "1",
        mes: periodo.fechaFin.getMonth() + 1,
        dia: periodo.fechaFin.getDate()
    });

    const { showModal } = useModal();

    const selectClasses = `
        w-full rounded-xl border px-3 py-2
        ${darkMode
            ? "bg-gray-800 border-gray-700 text-white"
            : "bg-white border-gray-300 text-gray-900"}
    `;

    const guardarCambios = async () => {
        if (!nombre.trim()) {
            showModal("error", "El nombre no puede estar vacío.");
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
            await onGuardar({
                nombre,
                fechaInicio,
                fechaFin,
                estado
            });

            showModal("success", "Período actualizado correctamente.");
            onClose();

        } catch (err) {
            const backendMessage =
                err.response?.data?.message ||
                err.response?.data?.error ||
                "Error al actualizar el período.";

            showModal("error", backendMessage);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className={`p-8 rounded-2xl w-full max-w-lg ${darkMode ? "bg-gray-900" : "bg-white"}`}>
                <h2 className="text-xl font-bold mb-6">Gestionar período</h2>
                {/* NOMBRE */}
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Nombre del período</label>
                    <input
                        className={selectClasses}
                        value={nombre}
                        onChange={e => setNombre(e.target.value)}
                    />
                </div>

                <h3 className="font-semibold mb-2">Fecha inicio</h3>
                <FechaSelector data={inicio} setData={setInicio} selectClasses={selectClasses} />

                <h3 className="font-semibold mt-4 mb-2">Fecha término</h3>
                <FechaSelector data={fin} setData={setFin} selectClasses={selectClasses} />

                <div className="mt-4">
                    <label className="block text-sm font-medium mb-1">Estado</label>
                    <select
                        className={selectClasses}
                        value={estado}
                        onChange={e => setEstado(e.target.value)}
                    >
                        <option value="PLANIFICACION">Planificación</option>
                        <option value="INSCRIPCION">Inscripción</option>
                        <option value="CERRADO">Cerrado</option>
                    </select>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                    <button onClick={onClose}>Cancelar</button>
                    <button
                        onClick={guardarCambios}
                        className="bg-purple-600 text-white px-4 py-2 rounded-xl"
                    >
                        Guardar cambios
                    </button>
                </div>
            </div>
        </div>
    );
}

