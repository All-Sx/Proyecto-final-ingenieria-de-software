export default function PeriodoCerrado({ darkMode }) {
    return (
        <div className={`border rounded-2xl p-10 text-center ${darkMode ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900"}`}>
            <div className="mb-4">
                <svg 
                    className="w-16 h-16 mx-auto text-yellow-500"
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                >
                    <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" 
                    />
                </svg>
            </div>
            <h2 className="text-2xl font-semibold mb-4">
                Período de inscripción cerrado
            </h2>
            <p className={`mb-6 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                El período de inscripción de electivos se encuentra cerrado en este momento.
            </p>
            <p className={`${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                Por favor, contacta con tu jefe de carrera para más información.
            </p>
        </div>
    );
}
