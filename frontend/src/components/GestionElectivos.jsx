import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
    ArrowLeft,
    Search,
    Filter,
    CheckCircle,
    XCircle,
    Clock,
    BookOpen,
    Users,
    GraduationCap,
    Calendar,
    Eye,
} from "lucide-react";

// Componente de Gestión de Electivos para el Jefe de Carrera
export default function GestionElectivos() {
    const navigate = useNavigate();
    
    // Estados para filtros
    const [filtroCarrera, setFiltroCarrera] = useState("todas");
    const [filtroEstado, setFiltroEstado] = useState("todos");
    const [filtroSemestre, setFiltroSemestre] = useState("todos");
    const [busqueda, setBusqueda] = useState("");
    const [electroSeleccionado, setElectroSeleccionado] = useState(null);

    // Datos de ejemplo de electivos propuestos
    const [electivos, setElectivos] = useState([
        {
            id: 1,
            nombre: "Inteligencia Artificial Aplicada",
            profesor: "Dr. Carlos Mendoza",
            carrera: "Ingeniería Civil Informática",
            semestre: "2025-1",
            creditos: 3,
            cuposDisponibles: 30,
            estado: "pendiente", // pendiente, aprobado, rechazado
            descripcion: "Curso enfocado en técnicas modernas de IA, incluyendo machine learning y redes neuronales.",
            requisitos: "Programación avanzada, Matemáticas discretas",
    
        },
        {
            id: 2,
            nombre: "Desarrollo de Videojuegos",
            profesor: "Mg. Ana Torres",
            carrera: "Ingeniería de Ejecución en Computación e Informática",
            semestre: "2025-1",
            creditos: 2,
            cuposDisponibles: 25,
            estado: "pendiente",
            descripcion: "Diseño y desarrollo de videojuegos usando Unity y C#.",
            requisitos: "Programación orientada a objetos",
        },
        {
            id: 3,
            nombre: "Blockchain y Criptomonedas",
            profesor: "Dr. Roberto Silva",
            carrera: "Ingeniería Civil Informática",
            semestre: "2025-2",
            creditos: 3,
            cuposDisponibles: 20,
            estado: "aprobado",
            descripcion: "Fundamentos de blockchain, contratos inteligentes y aplicaciones descentralizadas.",
            requisitos: "Estructuras de datos, Criptografía",
        },
        {
            id: 4,
            nombre: "Computación Cuántica",
            profesor: "Dra. Patricia López",
            carrera: "Ingeniería Civil Informática",
            semestre: "2025-1",
            creditos: 3,
            cuposDisponibles: 15,
            estado: "rechazado",
            descripcion: "Introducción a los principios de la computación cuántica.",
        },
        {
            id: 5,
            nombre: "Desarrollo Web Full Stack",
            profesor: "Ing. Mario Vargas",
            carrera: "Ingeniería de Ejecución en Computación e Informática",
            semestre: "2025-1",
            creditos: 2,
            cuposDisponibles: 35,
            estado: "pendiente",
            descripcion: "Desarrollo completo de aplicaciones web con React, Node.js y MongoDB.",
            requisitos: "Programación web básica",
        },
        {
            id: 6,
            nombre: "IoT y Sistemas Embebidos",
            profesor: "Dr. Juan Ramírez",
            carrera: "Ingeniería Civil Informática",
            semestre: "2025-2",
            creditos: 3,
            cuposDisponibles: 20,
            estado: "pendiente",
            descripcion: "Diseño e implementación de sistemas IoT con Arduino y Raspberry Pi.",
            requisitos: "Sistemas operativos, Redes",
        },
    ]);

    // Lista de carreras disponibles para filtrado
    const carreras = [
        "Ingeniería Civil Informática",
        "Ingeniería de Ejecución en Computación e Informática",
    ];

    // Aprobar electivo: cambia estado y cierra modal
    const aprobarElectivo = (id) => {
        setElectivos(electivos.map((e) => e.id === id ? { ...e, estado: "aprobado" } : e));
        setElectroSeleccionado(null);
    };

    // Rechazar electivo: cambia estado y cierra modal
    const rechazarElectivo = (id) => {
        setElectivos(electivos.map((e) => e.id === id ? { ...e, estado: "rechazado" } : e));
        setElectroSeleccionado(null);
    };

    // Filtrado de electivos según todos los criterios
    const electivosFiltrados = electivos.filter((e) => {
        const matchCarrera = filtroCarrera === "todas" || e.carrera === filtroCarrera;
        const matchEstado = filtroEstado === "todos" || e.estado === filtroEstado;
        const matchSemestre = filtroSemestre === "todos" || e.semestre === filtroSemestre;
        const matchBusqueda =
            e.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
            e.profesor.toLowerCase().includes(busqueda.toLowerCase());
        
        return matchCarrera && matchEstado && matchSemestre && matchBusqueda;
    });

    // Estadísticas calculadas dinámicamente
    const stats = {
        total: electivos.length,
        pendientes: electivos.filter((e) => e.estado === "pendiente").length,
        aprobados: electivos.filter((e) => e.estado === "aprobado").length,
        rechazados: electivos.filter((e) => e.estado === "rechazado").length,
    };

    return (
        <div className="min-h-screen p-8 bg-gray-100 text-gray-900">
            {/* Encabezado */}
            <div className="mb-6">
                <button
                    onClick={() => navigate("/dashboard")}
                    className="flex items-center gap-2 mb-4 transition text-gray-600 hover:text-gray-900"
                >
                    <ArrowLeft size={20} />
                    Volver al Dashboard
                </button>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Gestión de Electivos</h1>
                    <p className="mt-2 text-gray-600">Revisa, valida y aprueba las propuestas de electivos</p>
                </div>
            </div>

            {/* Estadísticas */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-6 rounded-2xl shadow-md bg-white"
                >
                    <div className="flex items-center gap-3">
                        <BookOpen className="text-blue-600" size={24} />
                        <div>
                            <p className="text-sm text-gray-500">Total Electivos</p>
                            <h3 className="text-2xl font-bold">{stats.total}</h3>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="p-6 rounded-2xl shadow-md bg-white"
                >
                    <div className="flex items-center gap-3">
                        <Clock className="text-yellow-600" size={24} />
                        <div>
                            <p className="text-sm text-gray-500">Pendientes</p>
                            <h3 className="text-2xl font-bold">{stats.pendientes}</h3>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="p-6 rounded-2xl shadow-md bg-white"
                >
                    <div className="flex items-center gap-3">
                        <CheckCircle className="text-green-600" size={24} />
                        <div>
                            <p className="text-sm text-gray-500">Aprobados</p>
                            <h3 className="text-2xl font-bold">{stats.aprobados}</h3>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="p-6 rounded-2xl shadow-md bg-white"
                >
                    <div className="flex items-center gap-3">
                        <XCircle className="text-red-600" size={24} />
                        <div>
                            <p className="text-sm text-gray-500">Rechazados</p>
                            <h3 className="text-2xl font-bold">{stats.rechazados}</h3>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Filtros y búsqueda */}
            <div className="p-6 rounded-2xl shadow-md mb-6 bg-white">
                <div className="flex items-center gap-2 mb-4">
                    <Filter size={20} className="text-gray-600" />
                    <h2 className="text-lg font-semibold">Filtros</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Búsqueda por texto */}
                    <div className="relative">
                        <Search className="absolute left-3 top-3 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Buscar por nombre o profesor..."
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                            className="w-full pl-10 pr-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                        />
                    </div>

                    {/* Filtro por carrera */}
                    <select
                        value={filtroCarrera}
                        onChange={(e) => setFiltroCarrera(e.target.value)}
                        className="border rounded-xl py-2 px-3 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white border-gray-300 text-gray-900"
                    >
                        <option value="todas">Todas las carreras</option>
                        {carreras.map((carrera) => (
                            <option key={carrera} value={carrera}>
                                {carrera}
                            </option>
                        ))}
                    </select>

                    {/* Filtro por estado */}
                    <select
                        value={filtroEstado}
                        onChange={(e) => setFiltroEstado(e.target.value)}
                        className="border rounded-xl py-2 px-3 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white border-gray-300 text-gray-900"
                    >
                        <option value="todos">Todos los estados</option>
                        <option value="pendiente">Pendientes</option>
                        <option value="aprobado">Aprobados</option>
                        <option value="rechazado">Rechazados</option>
                    </select>

                    {/* Filtro por semestre */}
                    <select
                        value={filtroSemestre}
                        onChange={(e) => setFiltroSemestre(e.target.value)}
                        className="border rounded-xl py-2 px-3 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white border-gray-300 text-gray-900"
                    >
                        <option value="todos">Todos los semestres</option>
                        <option value="2025-1">2025-1</option>
                        <option value="2025-2">2025-2</option>
                    </select>
                </div>
            </div>

            {/* Lista de electivos */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {electivosFiltrados.map((electivo) => (
                    <motion.div
                        key={electivo.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="rounded-2xl shadow-md p-6 hover:shadow-lg transition bg-white"
                    >
                        {/* Encabezado del electivo */}
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex-1">
                                <h3 className="text-xl font-semibold text-purple-600 mb-1">
                                    {electivo.nombre}
                                </h3>
                                <p className="text-sm text-gray-600">
                                    👨‍🏫 {electivo.profesor}
                                </p>
                            </div>
                            <span
                                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                    electivo.estado === "pendiente"
                                        ? "bg-yellow-100 text-yellow-700"
                                        : electivo.estado === "aprobado"
                                        ? "bg-green-100 text-green-700"
                                        : "bg-red-100 text-red-700"
                                }`}
                            >
                                {electivo.estado === "pendiente"
                                    ? "⏳ Pendiente"
                                    : electivo.estado === "aprobado"
                                    ? "✓ Aprobado"
                                    : "✗ Rechazado"}
                            </span>
                        </div>

                        {/* Información del electivo */}
                        <div className="space-y-2 mb-4">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <GraduationCap size={16} />
                                <span>{electivo.carrera}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Calendar size={16} />
                                <span>Semestre {electivo.semestre}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <BookOpen size={16} />
                                <span>{electivo.creditos} créditos</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Users size={16} />
                                <span>{electivo.cuposDisponibles} cupos disponibles</span>
                            </div>
                        </div>
                        {/* Botones de acción */}
                        <div className="flex gap-2">
                            <button
                                onClick={() => setElectroSeleccionado(electivo)}
                                className="flex-1 flex items-center justify-center gap-2 bg-purple-100 text-purple-700 py-2 rounded-xl font-medium hover:bg-purple-200 transition"
                            >
                                <Eye size={18} />
                                Ver detalles
                            </button>
                            
                            {electivo.estado === "pendiente" && (
                                <>
                                    <button
                                        onClick={() => aprobarElectivo(electivo.id)}
                                        className="flex items-center justify-center gap-1 bg-green-600 text-white px-4 py-2 rounded-xl font-medium hover:bg-green-700 transition"
                                    >
                                        <CheckCircle size={18} />
                                        Aprobar
                                    </button>
                                    <button
                                        onClick={() => rechazarElectivo(electivo.id)}
                                        className="flex items-center justify-center gap-1 bg-red-600 text-white px-4 py-2 rounded-xl font-medium hover:bg-red-700 transition"
                                    >
                                        <XCircle size={18} />
                                        Rechazar
                                    </button>
                                </>
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Modal de detalles */}
            {electroSeleccionado && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto bg-white text-gray-900"
                    >
                        <h2 className="text-2xl font-bold text-purple-600 mb-4">
                            {electroSeleccionado.nombre}
                        </h2>
                        
                        <div className="space-y-4 mb-6">
                            <div>
                                <h3 className="font-semibold mb-1 text-gray-700">Profesor</h3>
                                <p className="text-gray-600">{electroSeleccionado.profesor}</p>
                            </div>

                            <div>
                                <h3 className="font-semibold mb-1 text-gray-700">Descripción</h3>
                                <p className="text-gray-600">{electroSeleccionado.descripcion}</p>
                            </div>

                            <div>
                                <h3 className="font-semibold mb-1 text-gray-700">Carrera</h3>
                                <p className="text-gray-600">{electroSeleccionado.carrera}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <h3 className="font-semibold mb-1 text-gray-700">Semestre</h3>
                                    <p className="text-gray-600">{electroSeleccionado.semestre}</p>
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-1 text-gray-700">Créditos</h3>
                                    <p className="text-gray-600">{electroSeleccionado.creditos}</p>
                                </div>
                            </div>

                            <div>
                                <h3 className="font-semibold mb-1 text-gray-700">Cupos Disponibles</h3>
                                <p className="text-gray-600">{electroSeleccionado.cuposDisponibles}</p>
                            </div>

                            <div>
                                <h3 className="font-semibold mb-1 text-gray-700">Requisitos</h3>
                                <p className="text-gray-600">{electroSeleccionado.requisitos}</p>
                            </div>

                            <div>
                                <h3 className="font-semibold mb-1 text-gray-700">Estado</h3>
                                <span
                                    className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                                        electroSeleccionado.estado === "pendiente"
                                            ? "bg-yellow-100 text-yellow-700"
                                            : electroSeleccionado.estado === "aprobado"
                                            ? "bg-green-100 text-green-700"
                                            : "bg-red-100 text-red-700"
                                    }`}
                                >
                                    {electroSeleccionado.estado === "pendiente"
                                        ? "⏳ Pendiente"
                                        : electroSeleccionado.estado === "aprobado"
                                        ? "✓ Aprobado"
                                        : "✗ Rechazado"}
                                </span>
                            </div>
                        </div>

                        {/* Botones de acción en el modal */}
                        <div className="flex gap-3">
                            {electroSeleccionado.estado === "pendiente" && (
                                <>
                                    <button
                                        onClick={() => aprobarElectivo(electroSeleccionado.id)}
                                        className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded-xl font-medium hover:bg-green-700 transition"
                                    >
                                        <CheckCircle size={20} />
                                        Aprobar Electivo
                                    </button>
                                    <button
                                        onClick={() => rechazarElectivo(electroSeleccionado.id)}
                                        className="flex-1 flex items-center justify-center gap-2 bg-red-600 text-white py-3 rounded-xl font-medium hover:bg-red-700 transition"
                                    >
                                        <XCircle size={20} />
                                        Rechazar Electivo
                                    </button>
                                </>
                            )}
                            <button
                                onClick={() => setElectroSeleccionado(null)}
                                className={`${electroSeleccionado.estado === "pendiente" ? "flex-1" : "w-full"} py-3 rounded-xl font-medium transition bg-gray-200 text-gray-700 hover:bg-gray-300`}
                            >
                                Cerrar
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
