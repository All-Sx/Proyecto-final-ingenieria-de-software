export default function SinPeriodo({ onAbrir, darkMode }) {
    return (
        <div className={`border rounded-2xl p-10 text-center ${darkMode ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900"}`}>
            <h2 className="text-2xl font-semibold mb-4">
                No existe período de inscripción vigente
            </h2>
            <p className={`mb-6 text-gray-700 ${darkMode ? "text-white" : "text-gray-900"}`}>
                Debes abrir un período para que los profesores puedan registrar electivos.
            </p>
            <button
                onClick={onAbrir}
                className="bg-purple-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium"
            >
                Abrir nuevo período
            </button>
        </div>
    );
}
