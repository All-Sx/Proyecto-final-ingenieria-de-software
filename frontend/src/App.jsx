import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthForm from "./pages/AuthForm";
import Dashboard from "./pages/Dashboard";
import ElectivoForm from "./pages/CrearElectivo";
import GestionElectivos from "./pages/GestionElectivos"; 

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthForm />} />
        <Route path="/login" element={<AuthForm />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profesor/electivos" element={<ElectivoForm />} />
        <Route path="/jefe/gestion-electivos" element={<GestionElectivos />} />
      </Routes>
    </Router>
  );
}