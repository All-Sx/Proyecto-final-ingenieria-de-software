import React, { useState, useEffect } from "react";
import SinPeriodo from "../components/SinPeriodo";
import PeriodoVigente from "../components/PeriodoVigente";
import HistorialPeriodos from "../components/HistorialPeriodos";
import ModalCrearPeriodo from "../components/ModalCrearPeriodo";
import ModalGestionarPeriodo from "../components/ModalGestionarPeriodo";
import { isJefe } from "../helpers/roles";
import {
    obtenerPeriodoActual,
    crearPeriodo,
    actualizarPeriodo,
    obtenerHistorialPeriodos
} from "../services/periodos.service"
import { normalizarPeriodo, formatearFecha } from "../helpers/fechas";

export default function InscripcionesPage({ user, darkMode }) {
    if (!isJefe(user.rol)) {
        return <p className="text-center mt-10">Acceso restringido</p>;
    }

    const [periodo, setPeriodo] = useState(null);
    const [historial, setHistorial] = useState([]);
    const [mostrarModal, setMostrarModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [mostrarGestion, setMostrarGestion] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        cargarPeriodo();
        cargarHistorial();
    }, []);

    const cargarPeriodo = async () => {
        try {
            const res = await obtenerPeriodoActual();

            setPeriodo(normalizarPeriodo(res.data.data));
        } catch (error) {
            console.error("Error al obtener periodo actual:", error);
            setPeriodo(null);
        } finally {
            setLoading(false);
        }
    };

    const cargarHistorial = async () => {
        try {
            const res = await obtenerHistorialPeriodos();
            setHistorial(res.data.data || []);
        } catch (error) {
            console.error("Error al obtener historial:", error);
            setHistorial([]);
        }
    };

    const handleCrearPeriodo = async (periodoData) => {
        try {
            setError(null);
            const response = await crearPeriodo(periodoData);
            setPeriodo(normalizarPeriodo(response.data.data));
            setMostrarModal(false);
            await cargarHistorial(); 
        } catch (error) {
            const mensaje = error.response?.data?.message || "Error al crear período";
            setError(mensaje);
            // Mantener el modal abierto para que el usuario vea el error
            console.error("Error al crear periodo:", error);
        }
    };

    const handleGuardarGestion = async ({
        nombre,
        fechaInicio,
        fechaFin,
        estado
    }) => {

        console.log(" FRONT envia:", {
            nombre,
            fecha_inicio: formatearFecha(fechaInicio),
            fecha_fin: formatearFecha(fechaFin),
            estado
        });

        try {
            await actualizarPeriodo(periodo.id, {
                nombre,
                fecha_inicio: formatearFecha(fechaInicio),
                fecha_fin: formatearFecha(fechaFin),
                estado
            });

            // Cerrar el modal primero
            setMostrarGestion(false);
            
            // Recargar los datos
            await cargarPeriodo();
            await cargarHistorial();

        } catch (error) {
            console.error(" Error FRONT:", error);
            alert(error.response?.data?.message || "Error al actualizar período");
        }
    };


    if (loading) {
        return <p className="text-center mt-10">Cargando...</p>;
    }

    return (
        <div className="p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-6">Períodos de Inscripción</h1>
                
                {/* Botón de acción */}
                <button
                    onClick={() => setMostrarModal(true)}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-medium transition"
                >
                    Crear período
                </button>
            </div>

            {/* Período Activo */}
            {periodo ? (
                <div className="mb-8">
                    <h2 className={`text-xl font-semibold mb-4 ${darkMode ? "text-gray-200" : "text-gray-700"}`}>
                        Período Activo
                    </h2>
                    <PeriodoVigente
                        periodo={periodo}
                        darkMode={darkMode}
                        onGestionar={() => setMostrarGestion(true)}
                    />
                </div>
            ) : (
                <div className="mb-8">
                    <SinPeriodo onAbrir={() => setMostrarModal(true)} darkMode={darkMode} />
                </div>
            )}

            {/* Historial de Períodos */}
            <div>
                <h2 className={`text-xl font-semibold mb-4 ${darkMode ? "text-gray-200" : "text-gray-700"}`}>
                    Historial de Períodos
                </h2>
                <HistorialPeriodos periodos={historial} darkMode={darkMode} />
            </div>

            {mostrarModal && (
                <ModalCrearPeriodo
                    onClose={() => {
                        setMostrarModal(false);
                        setError(null);
                    }}
                    onCrear={handleCrearPeriodo}
                    darkMode={darkMode}
                    errorServidor={error}
                />
            )}

            {mostrarGestion && (
                <ModalGestionarPeriodo
                    periodo={periodo}
                    onClose={() => setMostrarGestion(false)}
                    onGuardar={handleGuardarGestion}
                    darkMode={darkMode}
                />
            )}
        </div>
    );
}
