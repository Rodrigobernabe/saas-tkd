import { useState } from 'react';
import { Plus, Search, X, Check, Edit2, Trash2 } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import type { Alumno } from '../types';

const formatCurrency = (value: number) => 
  new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(value);

export function Alumnos() {
  const { alumnos, turnos, grados, getCuotasByAlumno, addAlumno, updateAlumno, deleteAlumno } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingAlumno, setEditingAlumno] = useState<Alumno | null>(null);

  const activos = alumnos.filter(a => a.activo);
  const inactivos = alumnos.filter(a => !a.activo);

  const filteredAlumnos = searchTerm 
    ? alumnos.filter(a => 
        `${a.nombre} ${a.apellido}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.dni.includes(searchTerm) || a.email.includes(searchTerm)
      )
    : alumnos;

  const handleNewAlumno = () => {
    setEditingAlumno(null);
    setShowModal(true);
  };

  const handleEditAlumno = (alumno: Alumno) => {
    setEditingAlumno(alumno);
    setShowModal(true);
  };

  const handleSaveAlumno = (alumno: Alumno) => {
    if (editingAlumno) {
      updateAlumno(editingAlumno.id, alumno);
    } else {
      addAlumno(alumno);
    }
    setShowModal(false);
    setEditingAlumno(null);
  };

  const handleChangeTurno = (alumnoId: string, nuevoTurnoId: string) => {
    updateAlumno(alumnoId, { turnoId: nuevoTurnoId });
  };

  const handleDeleteAlumno = (id: string) => {
    if (confirm('¿Estás seguro de eliminar este alumno? Esta acción no se puede deshacer.')) {
      deleteAlumno(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-taekwondo-secondary">Alumnos</h1>
          <p className="text-gray-500">Gestión de estudiantes de la academia</p>
        </div>
        <button onClick={handleNewAlumno} className="btn-primary flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Nuevo Alumno
        </button>
      </div>

      <div className="card">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nombre, DNI o email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-taekwondo-primary focus:border-transparent"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
          <p className="text-sm text-gray-500">Activos</p>
          <p className="font-display text-2xl text-gray-900">{activos.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-red-500">
          <p className="text-sm text-gray-500">Inactivos</p>
          <p className="font-display text-2xl text-gray-900">{inactivos.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
          <p className="text-sm text-gray-500">Total</p>
          <p className="font-display text-2xl text-gray-900">{alumnos.length}</p>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-4 text-sm font-medium text-gray-500">Alumno</th>
                <th className="text-left p-4 text-sm font-medium text-gray-500">DNI</th>
                <th className="text-left p-4 text-sm font-medium text-gray-500">Turno</th>
                <th className="text-left p-4 text-sm font-medium text-gray-500">Grado</th>
                <th className="text-left p-4 text-sm font-medium text-gray-500">Teléfono</th>
                <th className="text-left p-4 text-sm font-medium text-gray-500">Estado</th>
                <th className="text-left p-4 text-sm font-medium text-gray-500">Acciones</th>
              </tr>
            </thead>
            <tbody>
{filteredAlumnos.map((alumno) => {
                const grado = grados.find(g => g.id === alumno.gradoId);
                const cuotas = getCuotasByAlumno(alumno.id);
                const cuotaActual = cuotas.find(c => c.periodoMes === new Date().getMonth() + 1);
                
                return (
                  <tr key={alumno.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-taekwondo-secondary rounded-full flex items-center justify-center text-white font-medium">
                          {alumno.nombre[0]}{alumno.apellido[0]}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {alumno.nombre} {alumno.apellido}
                          </p>
                          <p className="text-sm text-gray-500">{alumno.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-gray-600">{alumno.dni}</td>
                    <td className="p-4">
                      <select
                        value={alumno.turnoId}
                        onChange={(e) => handleChangeTurno(alumno.id, e.target.value)}
                        className="px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-taekwondo-primary"
                      >
                        {turnos.filter(t => t.activo).map(t => (
                          <option key={t.id} value={t.id}>{t.nombre}</option>
                        ))}
                      </select>
                    </td>
                    <td className="p-4">
                      <span 
                        className="px-2 py-1 rounded text-xs font-medium text-white"
                        style={{ backgroundColor: grado?.colorHex || '#999' }}
                      >
                        {grado?.nombre}
                      </span>
                    </td>
                    <td className="p-4 text-gray-600">{alumno.telefono}</td>
                    <td className="p-4">
                      {cuotaActual?.estado === 'pagada' ? (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                          Al día
                        </span>
                      ) : cuotaActual?.estado === 'vencida' ? (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                          Vencida
                        </span>
                      ) : (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                          Pendiente
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditAlumno(alumno)}
                          className="p-2 text-gray-500 hover:text-taekwondo-primary hover:bg-gray-100 rounded"
                          title="Editar"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => updateAlumno(alumno.id, { activo: !alumno.activo })}
                          className={`p-2 rounded ${alumno.activo ? 'text-yellow-600 hover:bg-yellow-50' : 'text-green-500 hover:bg-green-50'}`}
                          title={alumno.activo ? 'Desactivar' : 'Activar'}
                        >
                          {alumno.activo ? <Trash2 className="w-4 h-4" /> : <Check className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => handleDeleteAlumno(alumno.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded"
                          title="Eliminar permanentemente"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <AlumnoModal
          alumno={editingAlumno}
          onSave={handleSaveAlumno}
          onClose={() => { setShowModal(false); setEditingAlumno(null); }}
        />
      )}
    </div>
  );
}

function AlumnoModal({ 
  alumno, 
  onSave, 
  onClose 
}: { 
  alumno: Alumno | null; 
  onSave: (alumno: Alumno) => void; 
  onClose: () => void;
}) {
  const { turnos, grados } = useAppStore();
  
  const [formData, setFormData] = useState({
    nombre: alumno?.nombre || '',
    apellido: alumno?.apellido || '',
    dni: alumno?.dni || '',
    telefono: alumno?.telefono || '',
    email: alumno?.email || '',
    fechaNacimiento: alumno?.fechaNacimiento || '',
    turnoId: alumno?.turnoId || turnos[0]?.id || '',
    gradoId: alumno?.gradoId || grados[0]?.id || '',
    contactoEmergenciaNombre: alumno?.contactoEmergenciaNombre || '',
    contactoEmergenciaTelefono: alumno?.contactoEmergenciaTelefono || '',
    montoIndividual: alumno?.montoIndividual || undefined,
    grupoFamiliarId: alumno?.grupoFamiliarId || '',
    activo: alumno?.activo ?? true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nuevoAlumno: Alumno = {
      id: alumno?.id || `a${Date.now()}`,
      ...formData,
      montoIndividual: formData.montoIndividual ? Number(formData.montoIndividual) : undefined,
      fechaInicio: alumno?.fechaInicio || new Date().toISOString().split('T')[0],
    };
    onSave(nuevoAlumno);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="font-display text-2xl text-taekwondo-secondary">
            {alumno ? 'Editar Alumno' : 'Nuevo Alumno'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
              <input
                type="text"
                required
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-taekwondo-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Apellido</label>
              <input
                type="text"
                required
                value={formData.apellido}
                onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-taekwondo-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">DNI</label>
              <input
                type="text"
                required
                value={formData.dni}
                onChange={(e) => setFormData({ ...formData, dni: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-taekwondo-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
              <input
                type="tel"
                required
                value={formData.telefono}
                onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-taekwondo-primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-taekwondo-primary"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Nacimiento</label>
              <input
                type="date"
                required
                value={formData.fechaNacimiento}
                onChange={(e) => setFormData({ ...formData, fechaNacimiento: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-taekwondo-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Grado/Cinta</label>
              <select
                required
                value={formData.gradoId}
                onChange={(e) => setFormData({ ...formData, gradoId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-taekwondo-primary"
              >
                { grados.map(g => (
                  <option key={g.id} value={g.id}>{g.nombre}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Turno</label>
            <select
              required
              value={formData.turnoId}
              onChange={(e) => setFormData({ ...formData, turnoId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-taekwondo-primary"
            >
              {turnos.filter(t => t.activo).map(t => (
                <option key={t.id} value={t.id}>{t.nombre} - {formatCurrency(t.precioCuota)}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Monto Individual (opcional)</label>
              <input
                type="number"
                value={formData.montoIndividual || ''}
                onChange={(e) => setFormData({ ...formData, montoIndividual: e.target.value ? parseInt(e.target.value) : undefined })}
                placeholder="Dejar vacío para usar precio del turno"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-taekwondo-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Grupo Familiar (opcional)</label>
              <input
                type="text"
                value={formData.grupoFamiliarId || ''}
                onChange={(e) => setFormData({ ...formData, grupoFamiliarId: e.target.value })}
                placeholder="ID del grupo familiar"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-taekwondo-primary"
              />
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-medium text-gray-900 mb-2">Contacto de Emergencia</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                <input
                  type="text"
                  required
                  value={formData.contactoEmergenciaNombre}
                  onChange={(e) => setFormData({ ...formData, contactoEmergenciaNombre: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-taekwondo-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                <input
                  type="tel"
                  required
                  value={formData.contactoEmergenciaTelefono}
                  onChange={(e) => setFormData({ ...formData, contactoEmergenciaTelefono: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-taekwondo-primary"
                />
              </div>
            </div>
          </div>

          {alumno && (
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="activo"
                checked={formData.activo}
                onChange={(e) => setFormData({ ...formData, activo: e.target.checked })}
                className="w-4 h-4 text-taekwondo-primary rounded"
              />
              <label htmlFor="activo" className="text-sm text-gray-700">Alumno activo</label>
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
              {alumno ? 'Guardar Cambios' : 'Crear Alumno'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}