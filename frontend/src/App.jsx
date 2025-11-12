import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthForm from "./components/AuthForm";
import Dashboard from "./components/Dashboard";
import ElectivoForm from "./components/ElectivoForm";
import GestionElectivos from "./components/GestionElectivos"; // NUEVO: Componente de gestión de electivos

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Ruta principal - Formulario de autenticación */}
        <Route path="/" element={<AuthForm />} />
        
        {/* Ruta alternativa /login (apunta al mismo componente) */}
        <Route path="/login" element={<AuthForm />} />
        
        {/* Dashboard - Panel principal para todos los roles */}
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* Formulario de electivos (solo profesores) */}
        <Route path="/profesor/electivos" element={<ElectivoForm />} />
        
        {/* NUEVA RUTA: Gestión de electivos (solo jefe de carrera) */}
        {/* Panel administrativo para revisar, aprobar y rechazar propuestas de electivos */}
        <Route path="/jefe/gestion-electivos" element={<GestionElectivos />} />
      </Routes>
    </Router>
  );
}