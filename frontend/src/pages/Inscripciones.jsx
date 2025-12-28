import React, { useState, useEffect } from "react";
import SinPeriodo from "../components/Inscripciones/SinPeriodo";
import PeriodoVigente from "../components/Inscripciones/PeriodoVigente";
import ModalCrearPeriodo from "../components/Inscripciones/ModalCrearPeriodo";
import { isJefe } from "../helpers/roles";
import {
    obtenerPeriodoActual,
    crearPeriodo,
} from "../services/periodos.service"
import { normalizarPeriodo } from "../helpers/fechas";

export default function InscripcionesPage({ user, darkMode }) {
    if (!isJefe(user.rol)) {
        return <p className="text-center mt-10">Acceso restringido</p>;
    }

    const [periodo, setPeriodo] = useState(null);
    const [mostrarModal, setMostrarModal] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        cargarPeriodo();
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

    const handleCrearPeriodo = async (periodoData) => {
        try {
            const response = await crearPeriodo(periodoData);
            setPeriodo(normalizarPeriodo(response.data.data));
            setMostrarModal(false);
        } catch (error) {
            alert(error.response?.data?.message || "Error al crear período");
        }
    };

    if (loading) {
        return <p className="text-center mt-10">Cargando...</p>;
    }

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-6">Período de Inscripción</h1>

            {!periodo ? (
                <SinPeriodo onAbrir={() => setMostrarModal(true)} darkMode={darkMode} />
            ) : (
                <PeriodoVigente periodo={periodo} darkMode={darkMode} />
            )}

            {mostrarModal && (
                <ModalCrearPeriodo
                    onClose={() => setMostrarModal(false)}
                    onCrear={handleCrearPeriodo}
                    darkMode={darkMode}
                />
            )}
        </div>
    );
}
