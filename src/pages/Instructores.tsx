import { useState } from 'react';
import { Trophy, Plus, Search, Edit2, DollarSign, X, Check } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import type { Instructor } from '../types';

const formatCurrency = (value: number) => 
  new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(value);

export function Instructores() {
  const { instructores, turnos, getAlumnosByTurno, getLiquidacionesByInstructor } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterActivo, setFilterActivo] = useState<boolean | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingInstructor, setEditingInstructor] = useState<Instructor | null>(null);
  const [showDetalle, setShowDetalle] = useState<Instructor | null>(null);

  const filteredInstructores = instructores.filter(i => {
    const matchesSearch = `${i.nombre} ${i.apellido}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          i.dni.includes(searchTerm);
    const matchesFilter = filterActivo === null || i.activo === filterActivo;
    return matchesSearch && matchesFilter;
  });

  const activos = instructores.filter(i => i.activo).length;
  const inactivos = instructores.filter(i => !i.activo).length;

  const handleNewInstructor = () => {
    setEditingInstructor(null);
    setShowModal(true);
  };

  const handleEditInstructor = (instructor: Instructor) => {
    setEditingInstructor(instructor);
    setShowModal(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-taekwondo-secondary">Instructores</h1>
          <p className="text-gray-500">Gestión de instructores y liquidaciones</p>
        </div>
        <button 
          onClick={handleNewInstructor}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Nuevo Instructor
        </button>
      </div>

      {/* Buscador y Filtros */}
      <div className="card">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nombre o DNI..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-taekwondo-primary focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setFilterActivo(null)}
              className={`px-4 py-2 rounded-lg border ${filterActivo === null ? 'bg-taekwondo-primary text-white' : 'border-gray-300 hover:bg-gray-50'}`}
            >
              Todos
            </button>
            <button
              onClick={() => setFilterActivo(true)}
              className={`px-4 py-2 rounded-lg border ${filterActivo === true ? 'bg-green-600 text-white' : 'border-gray-300 hover:bg-gray-50'}`}
            >
              Activos
            </button>
            <button
              onClick={() => setFilterActivo(false)}
              className={`px-4 py-2 rounded-lg border ${filterActivo === false ? 'bg-red-600 text-white' : 'border-gray-300 hover:bg-gray-50'}`}
            >
              Inactivos
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
          <p className="text-sm text-gray-500">Activos</p>
          <p className="font-display text-2xl text-gray-900">{activos}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-red-500">
          <p className="text-sm text-gray-500">Inactivos</p>
          <p className="font-display text-2xl text-gray-900">{inactivos}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-taekwondo-accent">
          <p className="text-sm text-gray-500">Total Instructores</p>
          <p className="font-display text-2xl text-gray-900">{instructores.length}</p>
        </div>
      </div>

      {/* Lista de Instructores */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredInstructores.map((instructor) => {
          const turno = turnos.find(t => t.id === instructor.turnoId);
          const alumnos = getAlumnosByTurno(instructor.turnoId);
          const liquidaciones = getLiquidacionesByInstructor(instructor.id);
          const ultimaLiquidacion = liquidaciones[liquidaciones.length - 1];
          
          return (
            <div key={instructor.id} className="card hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 bg-taekwondo-secondary rounded-full flex items-center justify-center text-white text-xl font-bold">
                    {instructor.nombre[0]}{instructor.apellido[0]}
                  </div>
                  <div>
                    <h3 className="font-display text-xl text-gray-900">
                      {instructor.nombre} {instructor.apellido}
                    </h3>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${instructor.activo ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                      {instructor.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">DNI</span>
                  <span className="font-medium text-gray-900">{instructor.dni}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Turno</span>
                  <span className="font-medium text-gray-900">{turno?.nombre}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Alumnos</span>
                  <span className="font-medium text-gray-900">{alumnos.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">% Cobro</span>
                  <span className="font-medium text-taekwondo-accent">{instructor.porcentajeCobro}%</span>
                </div>
                {ultimaLiquidacion && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Última Liquidación</span>
                    <span className={`font-medium ${ultimaLiquidacion.estado === 'pagado' ? 'text-green-600' : 'text-yellow-600'}`}>
                      {formatCurrency(ultimaLiquidacion.montoInstructor)}
                    </span>
                  </div>
                )}
              </div>

              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => handleEditInstructor(instructor)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
                >
                  <Edit2 className="w-4 h-4" />
                  Editar
                </button>
                <button
                  onClick={() => setShowDetalle(instructor)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-taekwondo-accent text-gray-900 rounded-lg hover:bg-yellow-400 text-sm font-medium"
                >
                  <DollarSign className="w-4 h-4" />
                  Liquidaciones
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredInstructores.length === 0 && (
        <div className="card text-center py-12">
          <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No se encontraron instructores</p>
        </div>
      )}

      {/* Modal de Instructor */}
      {showModal && (
        <InstructorModal
          instructor={editingInstructor}
          onClose={() => setShowModal(false)}
        />
      )}

      {/* Modal de Detalle de Liquidaciones */}
      {showDetalle && (
        <LiquidacionDetalleModal
          instructor={showDetalle}
          onClose={() => setShowDetalle(null)}
        />
      )}
    </div>
  );
}

function InstructorModal({ instructor, onClose }: { instructor: Instructor | null; onClose: () => void }) {
  const { turnos, addInstructor, updateInstructor } = useAppStore();
  const [formData, setFormData] = useState({
    nombre: instructor?.nombre || '',
    apellido: instructor?.apellido || '',
    dni: instructor?.dni || '',
    cuil: instructor?.cuil || '',
    telefono: instructor?.telefono || '',
    email: instructor?.email || '',
    turnoId: instructor?.turnoId || '',
    porcentajeCobro: instructor?.porcentajeCobro || 40,
    cbuAlias: instructor?.cbuAlias || '',
    activo: instructor?.activo ?? true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (instructor) {
      updateInstructor(instructor.id, formData);
    } else {
      const newInstructor: Instructor = {
        ...formData,
        id: `i${Date.now()}`,
        fechaNacimiento: '',
      };
      addInstructor(newInstructor);
    }
    onClose();
  };

  const turnosDisponibles = turnos.filter(t => t.activo);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="font-display text-2xl text-taekwondo-secondary">
            {instructor ? 'Editar Instructor' : 'Nuevo Instructor'}
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
              <label className="block text-sm font-medium text-gray-700 mb-1">CUIL/CUIT</label>
              <input
                type="text"
                required
                value={formData.cuil}
                onChange={(e) => setFormData({ ...formData, cuil: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-taekwondo-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
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
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Turno Asignado</label>
              <select
                required
                value={formData.turnoId}
                onChange={(e) => setFormData({ ...formData, turnoId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-taekwondo-primary"
              >
                <option value="">Seleccionar turno</option>
                {turnosDisponibles.map(t => (
                  <option key={t.id} value={t.id}>{t.nombre}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">% de Cobro</label>
              <input
                type="number"
                required
                min="0"
                max="100"
                value={formData.porcentajeCobro}
                onChange={(e) => setFormData({ ...formData, porcentajeCobro: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-taekwondo-primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Alias CBU/CVU</label>
            <input
              type="text"
              value={formData.cbuAlias}
              onChange={(e) => setFormData({ ...formData, cbuAlias: e.target.value })}
              placeholder="Alias de transferencia"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-taekwondo-primary"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="activo"
              checked={formData.activo}
              onChange={(e) => setFormData({ ...formData, activo: e.target.checked })}
              className="w-4 h-4 text-taekwondo-primary rounded"
            />
            <label htmlFor="activo" className="text-sm text-gray-700">Instructor activo</label>
          </div>

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
              {instructor ? 'Guardar Cambios' : 'Crear Instructor'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function LiquidacionDetalleModal({ instructor, onClose }: { instructor: Instructor; onClose: () => void }) {
  const { liquidaciones, getAlumnosByTurno } = useAppStore();
  const instructorLiquidaciones = liquidaciones
    .filter(l => l.instructorId === instructor.id)
    .sort((a, b) => {
      if (a.periodoAnio !== b.periodoAnio) return b.periodoAnio - a.periodoAnio;
      return b.periodoMes - a.periodoMes;
    });

  const totalPagado = instructorLiquidaciones
    .filter(l => l.estado === 'pagado')
    .reduce((sum, l) => sum + l.montoInstructor, 0);

  const alumnos = getAlumnosByTurno(instructor.turnoId);

  const getMonthName = (mes: number) => {
    const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    return meses[mes - 1];
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="font-display text-2xl text-taekwondo-secondary">
              {instructor.nombre} {instructor.apellido}
            </h2>
            <p className="text-sm text-gray-500">Historial de Liquidaciones</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Info actual */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-sm text-gray-500">Turno</p>
                <p className="font-medium text-gray-900">{instructor.turnoId === 't1' ? 'Lun/Mié 18:00' : instructor.turnoId === 't2' ? 'Mar/Jue 19:00' : 'Sáb 10:00'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Alumnos</p>
                <p className="font-medium text-gray-900">{alumnos.length}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">% Cobro</p>
                <p className="font-medium text-taekwondo-accent">{instructor.porcentajeCobro}%</p>
              </div>
            </div>
          </div>

          {/* Lista de liquidaciones */}
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Historial de Liquidaciones</h3>
            {instructorLiquidaciones.length > 0 ? (
              <div className="space-y-2">
                {instructorLiquidaciones.map(l => (
                  <div 
                    key={l.id} 
                    className={`p-4 rounded-lg border ${l.estado === 'pagado' ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'}`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">
                          {getMonthName(l.periodoMes)} {l.periodoAnio}
                        </p>
                        <p className="text-sm text-gray-500">
                          Recaudado: {formatCurrency(l.totalRecaudado)} | {l.porcentaje}%
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-display text-xl text-gray-900">
                          {formatCurrency(l.montoInstructor)}
                        </p>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${l.estado === 'pagado' ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800'}`}>
                          {l.estado === 'pagado' ? 'Pagado' : 'Pendiente'}
                        </span>
                      </div>
                    </div>
                    {l.fechaPago && (
                      <p className="text-xs text-gray-500 mt-1">Pagado el: {l.fechaPago} | Aprobado por: {l.aprobadoPor}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No hay liquidaciones registradas</p>
            )}
          </div>

          {/* Total */}
          <div className="bg-taekwondo-secondary text-white rounded-lg p-4">
            <div className="flex items-center justify-between">
              <p className="text-lg">Total Pagado Histórico</p>
              <p className="font-display text-2xl">{formatCurrency(totalPagado)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}