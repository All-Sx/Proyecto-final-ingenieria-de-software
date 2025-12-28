import { MESES , getAniosDisponibles } from "../helpers/periodos";
import { diasPorMes } from "../helpers/fechas";

export default function FechaSelector({ data, setData, selectClasses }) {
    const añosDisponibles = getAniosDisponibles();

    return (
        <>
            <div className="grid grid-cols-2 gap-3 mb-2">
                <select
                    className={selectClasses}
                    value={data.año}
                    onChange={e => setData({ ...data, año: +e.target.value, dia: "" })}
                >
                    {añosDisponibles.map(a => (
                        <option key={a} value={a}>{a}</option>
                    ))}
                </select>
            </div>

            <div className="flex gap-3">
                <select
                    className={selectClasses}
                    value={data.mes}
                    onChange={e => setData({ ...data, mes: +e.target.value, dia: "" })}
                >
                    <option value="">Mes</option>
                    {MESES.map(m => (
                        <option key={m.value} value={m.value}>{m.label}</option>
                    ))}
                </select>

                <select
                    className={selectClasses}
                    value={data.dia}
                    onChange={e => setData({ ...data, dia: +e.target.value })}
                >
                    <option value="">Día</option>
                    {diasPorMes(data.mes, data.año).map(d => (
                        <option key={d} value={d}>{d}</option>
                    ))}
                </select>
            </div>
        </>
    );
}
