import { Plus } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

const formatCurrency = (value: number) => 
  new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(value);

export function Turnos() {
  const { turnos, instructores, getAlumnosByTurno } = useAppStore();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-taekwondo-secondary">Turnos</h1>
          <p className="text-gray-500">Gestión de horarios y clases</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Nuevo Turno
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {turnos.map((turno) => {
          const instructor = instructores.find(i => i.id === turno.instructorId);
          const alumnos = getAlumnosByTurno(turno.id);
          
          return (
            <div key={turno.id} className="card hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-display text-xl text-taekwondo-secondary">
                    {turno.nombre}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {turno.diasSemana.map(d => d.charAt(0).toUpperCase() + d.slice(1)).join(', ')}
                  </p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${turno.activo ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                  {turno.activo ? 'Activo' : 'Inactivo'}
                </span>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Horario</span>
                  <span className="font-medium text-gray-900">
                    {turno.horaInicio} - {turno.horaFin}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Instructor</span>
                  <span className="font-medium text-gray-900">
                    {instructor?.nombre} {instructor?.apellido}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Alumnos</span>
                  <span className="font-medium text-gray-900">{alumnos.length}/{turno.capacidadMax}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Cuota</span>
                  <span className="font-medium text-green-600">{formatCurrency(turno.precioCuota)}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}