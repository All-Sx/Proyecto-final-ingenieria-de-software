import React, { useState } from "react";
import { diasPorMes, formatearFecha } from "../../helpers/fechas";

const meses = [
    { value: 1, label: "Enero" },
    { value: 2, label: "Febrero" },
    { value: 3, label: "Marzo" },
    { value: 4, label: "Abril" },
    { value: 5, label: "Mayo" },
    { value: 6, label: "Junio" },
    { value: 7, label: "Julio" },
    { value: 8, label: "Agosto" },
    { value: 9, label: "Septiembre" },
    { value: 10, label: "Octubre" },
    { value: 11, label: "Noviembre" },
    { value: 12, label: "Diciembre" },
];

export default function ModalCrearPeriodo({ onClose, onCrear, darkMode }) {
    const hoy = new Date();

    const añoActual = hoy.getFullYear();
    const añosDisponibles = [añoActual, añoActual + 1];

    const [año, setAño] = useState(añoActual);
    const [semestre, setSemestre] = useState("");
    const [inicio, setInicio] = useState({ mes: "", dia: "" });
    const [fin, setFin] = useState({ mes: "", dia: "" });
    const [error, setError] = useState("");

    const selectBaseClasses = `
        w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500
        ${darkMode
            ? "bg-gray-800 border-gray-700 text-gray-100"
            : "bg-white border-gray-300 text-gray-900"}
    `;

    const crearPeriodo = () => {
        if (!inicio.mes || !inicio.dia || !fin.mes || !fin.dia) {
            return setError("Completa todas las fechas");
        }

        const fechaInicio = new Date(año, inicio.mes - 1, inicio.dia);
        const fechaFin = new Date(año, fin.mes - 1, fin.dia);

        if (fechaInicio < hoy) {
            return setError("La fecha de inicio no puede ser anterior a hoy");
        }

        if (fechaFin <= fechaInicio) {
            return setError("La fecha de término debe ser posterior a la de inicio");
        }

        const nombrePeriodo = `${año}-${semestre}`;

        onCrear({
            nombre: nombrePeriodo,
            fecha_inicio: formatearFecha(fechaInicio),
            fecha_fin: formatearFecha(fechaFin),
        });
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className={`rounded-2xl p-8 w-full max-w-lg ${darkMode ? "bg-gray-900" : "bg-white"}`} >
                <h2 className="text-xl font-bold mb-6">Abrir período de inscripción</h2>

                {/* AÑO Y SEMESTRE */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                        <label className="block text-sm font-medium mb-1">Año</label>
                        <select
                            className={selectBaseClasses}
                            value={año}
                            onChange={(e) => setAño(+e.target.value)}
                        >
                            {añosDisponibles.map((a) => (
                                <option key={a} value={a}>{a}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Semestre</label>
                        <select
                            className={selectBaseClasses}
                            value={semestre}
                            onChange={(e) => setSemestre(e.target.value)}
                        >
                            <option value="">Seleccionar</option>
                            <option value="1">Semestre 1</option>
                            <option value="2">Semestre 2</option>
                        </select>
                    </div>
                </div>
                
                {/* FECHA INICIO */}
                <div className="mb-4">
                    <h3 className="font-semibold mb-2">Fecha de inicio</h3>
                    <div className="flex gap-3">
                        <select
                            className={selectBaseClasses}
                            onChange={e => setInicio({ mes: +e.target.value, dia: "" })}
                        >
                            <option value="">Mes</option>
                            {meses.map(m => (
                                <option key={m.value} value={m.value}>
                                    {m.label}
                                </option>
                            ))}
                        </select>

                        <select
                            className={`${selectBaseClasses} ${!inicio.mes && "opacity-50 cursor-not-allowed"}`}
                            disabled={!inicio.mes}
                            onChange={e => setInicio({ ...inicio, dia: +e.target.value })}
                        >
                            <option value="">Día</option>
                            {diasPorMes(inicio.mes).map(d => (
                                <option key={d} value={d}>{d}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* FECHA FIN */}
                <div className="mb-4">
                    <h3 className="font-semibold mb-2">Fecha de término</h3>
                    <div className="flex gap-3">
                        <select
                            className={selectBaseClasses}
                            onChange={e => setFin({ mes: +e.target.value, dia: "" })}
                        >
                            <option value="">Mes</option>
                            {meses.map(m => (
                                <option key={m.value} value={m.value}>
                                    {m.label}
                                </option>
                            ))}
                        </select>

                        <select
                            className={`${selectBaseClasses} ${!fin.mes && "opacity-50 cursor-not-allowed"}`}
                            disabled={!fin.mes}
                            onChange={e => setFin({ ...fin, dia: +e.target.value })}
                        >
                            <option value="">Día</option>
                            {diasPorMes(fin.mes).map(d => (
                                <option key={d} value={d}>{d}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

                <div className="flex justify-end gap-3">
                    <button onClick={onClose}>Cancelar</button>
                    <button
                        onClick={crearPeriodo}
                        className="bg-purple-600 text-white px-4 py-2 rounded-xl"
                    >
                        Abrir período
                    </button>
                </div>
            </div>
        </div>
    );
}
