import React, { useState } from "react";
import SinPeriodo from "../components/SinPeriodo";
import PeriodoVigente from "../components/PeriodoVigente";
import ModalCrearPeriodo from "../components/ModalCrearPeriodo";
import { isJefe } from "../helpers/roles";

export default function InscripcionesPage({ user, darkMode }) {
  if (!isJefe(user.rol)) {
    return <p className="text-center mt-10">Acceso restringido</p>;
  }

  const [periodo, setPeriodo] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Período de Inscripción</h1>

      {!periodo ? (
        <SinPeriodo onAbrir={() => setMostrarModal(true)} darkMode={darkMode} />
      ) : (
        <PeriodoVigente periodo={periodo} darkMode={darkMode}/>
      )}

      {mostrarModal && (
        <ModalCrearPeriodo
          onClose={() => setMostrarModal(false)}
          onCrear={(nuevoPeriodo) => {
            setPeriodo(nuevoPeriodo);
            setMostrarModal(false);
          }}
          darkMode={darkMode}
        />
      )}
    </div>
  );
}
