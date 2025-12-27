import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthForm from "./components/AuthForm";
import Dashboard from "./pages/Dashboard";
import ElectivoForm from "./components/ElectivoForm";
import GestionElectivos from "./components/GestionElectivos"; 

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
        
        {/* Panel administrativo para revisar, aprobar y rechazar propuestas de electivos */}
        <Route path="/jefe/gestion-electivos" element={<GestionElectivos />} />
      </Routes>
    </Router>
  );
}