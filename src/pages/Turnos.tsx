import { useState } from 'react';
import { Plus, X, Check, Edit2, Trash2 } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import type { Turno } from '../types';

const formatCurrency = (value: number) => 
  new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(value);

const DIAS_SEMANA = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];

export function Turnos() {
  const { turnos, instructores, getAlumnosByTurno, addTurno, updateTurno, deleteTurno } = useAppStore();
  const [showModal, setShowModal] = useState(false);
  const [editingTurno, setEditingTurno] = useState<Turno | null>(null);

  const handleNewTurno = () => {
    setEditingTurno(null);
    setShowModal(true);
  };

  const handleEditTurno = (turno: Turno) => {
    setEditingTurno(turno);
    setShowModal(true);
  };

  const handleDeleteTurno = (id: string) => {
    if (confirm('¿Estás seguro de eliminar este turno? Esta acción no se puede deshacer.')) {
      deleteTurno(id);
    }
  };

  const handleSaveTurno = (turno: Turno) => {
    if (editingTurno) {
      updateTurno(editingTurno.id, turno);
    } else {
      addTurno({ ...turno, id: `t${Date.now()}`, activo: true });
    }
    setShowModal(false);
    setEditingTurno(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-taekwondo-secondary">Turnos</h1>
          <p className="text-gray-500">Gestión de horarios y clases</p>
        </div>
        <button onClick={handleNewTurno} className="btn-primary flex items-center gap-2">
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

              <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                <button
                  onClick={() => handleEditTurno(turno)}
                  className="flex-1 px-3 py-2 text-sm text-gray-600 hover:text-taekwondo-primary hover:bg-gray-100 rounded flex items-center justify-center gap-1"
                >
                  <Edit2 className="w-4 h-4" />
                  Editar
                </button>
                <button
                  onClick={() => handleDeleteTurno(turno.id)}
                  className="flex-1 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded flex items-center justify-center gap-1"
                >
                  <Trash2 className="w-4 h-4" />
                  Eliminar
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {showModal && (
        <TurnoModal
          turno={editingTurno}
          onSave={handleSaveTurno}
          onClose={() => { setShowModal(false); setEditingTurno(null); }}
        />
      )}
    </div>
  );
}

function TurnoModal({ 
  turno, 
  onSave, 
  onClose 
}: { 
  turno: Turno | null; 
  onSave: (turno: Turno) => void; 
  onClose: () => void;
}) {
  const { instructores } = useAppStore();
  
  const [formData, setFormData] = useState({
    nombre: turno?.nombre || '',
    diasSemana: turno?.diasSemana || [] as string[],
    horaInicio: turno?.horaInicio || '16:00',
    horaFin: turno?.horaFin || '17:30',
    instructorId: turno?.instructorId || instructores[0]?.id || '',
    precioCuota: turno?.precioCuota || 15000,
    capacidadMax: turno?.capacidadMax || 20,
    activo: turno?.activo ?? true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nuevoTurno: Turno = {
      id: turno?.id || '',
      nombre: formData.nombre,
      diasSemana: formData.diasSemana,
      horaInicio: formData.horaInicio,
      horaFin: formData.horaFin,
      instructorId: formData.instructorId,
      precioCuota: Number(formData.precioCuota),
      capacidadMax: Number(formData.capacidadMax),
      activo: formData.activo,
    };
    onSave(nuevoTurno);
  };

  const toggleDia = (dia: string) => {
    const dias = formData.diasSemana.includes(dia)
      ? formData.diasSemana.filter(d => d !== dia)
      : [...formData.diasSemana, dia];
    setFormData({ ...formData, diasSemana: dias });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="font-display text-2xl text-taekwondo-secondary">
            {turno ? 'Editar Turno' : 'Nuevo Turno'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Turno</label>
            <input
              type="text"
              required
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              placeholder="Ej: Turno Mañana, Kids, Adultos"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-taekwondo-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Días de la Semana</label>
            <div className="flex flex-wrap gap-2">
              {DIAS_SEMANA.map(dia => (
                <button
                  key={dia}
                  type="button"
                  onClick={() => toggleDia(dia)}
                  className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${
                    formData.diasSemana.includes(dia)
                      ? 'bg-taekwondo-primary text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {dia}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hora de Inicio</label>
              <input
                type="time"
                required
                value={formData.horaInicio}
                onChange={(e) => setFormData({ ...formData, horaInicio: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-taekwondo-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hora de Fin</label>
              <input
                type="time"
                required
                value={formData.horaFin}
                onChange={(e) => setFormData({ ...formData, horaFin: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-taekwondo-primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Instructor</label>
            <select
              required
              value={formData.instructorId}
              onChange={(e) => setFormData({ ...formData, instructorId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-taekwondo-primary"
            >
              {instructores.filter(i => i.activo).map(i => (
                <option key={i.id} value={i.id}>{i.nombre} {i.apellido}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Precio Cuota ($)</label>
              <input
                type="number"
                required
                value={formData.precioCuota}
                onChange={(e) => setFormData({ ...formData, precioCuota: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-taekwondo-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Capacidad Máxima</label>
              <input
                type="number"
                required
                value={formData.capacidadMax}
                onChange={(e) => setFormData({ ...formData, capacidadMax: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-taekwondo-primary"
              />
            </div>
          </div>

          {turno && (
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="activo"
                checked={formData.activo}
                onChange={(e) => setFormData({ ...formData, activo: e.target.checked })}
                className="w-4 h-4 text-taekwondo-primary rounded"
              />
              <label htmlFor="activo" className="text-sm text-gray-700">Turno activo</label>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 btn-primary flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" />
              {turno ? 'Guardar Cambios' : 'Crear Turno'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}