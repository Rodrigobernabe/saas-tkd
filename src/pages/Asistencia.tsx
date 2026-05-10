import { useState, useMemo } from 'react';
import { Calendar, ClipboardCheck, Search, Check, X, Clock, Users, RefreshCw, TrendingUp } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';
import { es } from 'date-fns/locale';

type Periodo = 'semana' | 'mes' | 'personalizado';

export function Asistencia() {
  const { 
    turnos, 
    alumnos, 
    getAlumnosByTurno, 
    assistentecias,
    addAsistencia,
    updateAsistencia,
    getAsistenciasByAlumno,
    getPorcentajeAsistencia,
    usuario
  } = useAppStore();

  const hoy = new Date();
  const [selectedDate, setSelectedDate] = useState(hoy.toISOString().split('T')[0]);
  const [selectedTurno, setSelectedTurno] = useState(turnos[0]?.id || '');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'diario' | 'historial'>('diario');
  
  // Período para estadísticas
  const [periodo, setPeriodo] = useState<Periodo>('semana');
  const [fechaDesde, setFechaDesde] = useState(startOfWeek(hoy).toISOString().split('T')[0]);
  const [fechaHasta, setFechaHasta] = useState(endOfWeek(hoy).toISOString().split('T')[0]);

  // Actualizar rango de fechas según período seleccionado
  const updatePeriodo = (nuevoPeriodo: Periodo) => {
    setPeriodo(nuevoPeriodo);
    const ahora = new Date();
    switch (nuevoPeriodo) {
      case 'semana':
        setFechaDesde(startOfWeek(ahora).toISOString().split('T')[0]);
        setFechaHasta(endOfWeek(ahora).toISOString().split('T')[0]);
        break;
      case 'mes':
        setFechaDesde(startOfMonth(ahora).toISOString().split('T')[0]);
        setFechaHasta(endOfMonth(ahora).toISOString().split('T')[0]);
        break;
      case 'personalizado':
        // Mantiene los valores actuales
        break;
    }
  };

  const alumnosDelTurno = useMemo(() => {
    return getAlumnosByTurno(selectedTurno).filter(a => a.activo);
  }, [selectedTurno, getAlumnosByTurno]);

  const filteredAlumnos = useMemo(() => {
    if (!searchTerm) return alumnosDelTurno;
    return alumnosDelTurno.filter(a => 
      `${a.nombre} ${a.apellido}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.dni.includes(searchTerm)
    );
  }, [alumnosDelTurno, searchTerm]);

  const asistenciaDelTurnoFecha = useMemo(() => {
    return assistentecias.filter(a => a.fecha === selectedDate && a.turnoId === selectedTurno);
  }, [selectedDate, selectedTurno, assistentecias]);

  const presentesCount = asistenciaDelTurnoFecha.filter(a => a.presente).length;
  const totalCount = alumnosDelTurno.length;

  const isAlumnoPresente = (alumnoId: string) => {
    return asistenciaDelTurnoFecha.some(a => a.alumnoId === alumnoId && a.presente);
  };

  const getAsistenciaId = (alumnoId: string) => {
    return asistenciaDelTurnoFecha.find(a => a.alumnoId === alumnoId)?.id;
  };

  const toggleAsistencia = (alumnoId: string) => {
    const asistenciaId = getAsistenciaId(alumnoId);
    const presente = isAlumnoPresente(alumnoId);
    
    if (asistenciaId) {
      // Toggle existente - actualizar
      updateAsistencia(asistenciaId, { presente: !presente });
    } else {
      // Crear nueva
      const nuevaAsistencia = {
        id: `as_${Date.now()}_${alumnoId}`,
        alumnoId,
        turnoId: selectedTurno,
        fecha: selectedDate,
        presente: true,
        registradoPor: usuario.id
      };
      addAsistencia(nuevaAsistencia);
    }
  };

  const marcarTodosPresentes = () => {
    filteredAlumnos.forEach(alumno => {
      if (!isAlumnoPresente(alumno.id)) {
        const nueva = {
          id: `as_${Date.now()}_${alumno.id}`,
          alumnoId: alumno.id,
          turnoId: selectedTurno,
          fecha: selectedDate,
          presente: true,
          registradoPor: usuario.id
        };
        addAsistencia(nueva);
      }
    });
  };

  const selectedTurnoData = turnos.find(t => t.id === selectedTurno);

  // Historial view
  const [historialTurno, setHistorialTurno] = useState(selectedTurno);
  const [historialAlumno, setHistorialAlumno] = useState('');

  const historialData = useMemo(() => {
    let filtered = assistentecias;

    if (historialTurno) {
      filtered = filtered.filter(a => a.turnoId === historialTurno);
    }

    if (historialAlumno) {
      filtered = filtered.filter(a => a.alumnoId === historialAlumno);
    }

    // Group by date
    const grouped: Record<string, typeof filtered> = {};
    filtered.forEach(a => {
      if (!grouped[a.fecha]) grouped[a.fecha] = [];
      grouped[a.fecha].push(a);
    });

    return Object.entries(grouped)
      .sort(([a], [b]) => b.localeCompare(a))
      .slice(0, 30);
  }, [assistentecias, historialTurno, historialAlumno]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-taekwondo-secondary">Asistencia</h1>
          <p className="text-gray-500">Control de asistencia diaria</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setViewMode('diario')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            viewMode === 'diario' 
              ? 'bg-taekwondo-primary text-white' 
              : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          <Clock className="w-4 h-4 inline mr-2" />
          Registro Diario
        </button>
        <button
          onClick={() => setViewMode('historial')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            viewMode === 'historial' 
              ? 'bg-taekwondo-primary text-white' 
              : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          <ClipboardCheck className="w-4 h-4 inline mr-2" />
          Historial
        </button>
      </div>

      {viewMode === 'diario' ? (
        <>
          {/* Selector de Período + Fecha y Turno */}
          <div className="card">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
              {/* Período para estadísticas */}
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-gray-500" />
                <select
                  value={periodo}
                  onChange={(e) => updatePeriodo(e.target.value as Periodo)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-taekwondo-primary"
                >
                  <option value="semana">Esta semana</option>
                  <option value="mes">Este mes</option>
                  <option value="personalizado">Personalizado</option>
                </select>
              </div>
              
              {periodo === 'personalizado' && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">Desde:</span>
                  <input
                    type="date"
                    value={fechaDesde}
                    onChange={(e) => setFechaDesde(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-taekwondo-primary"
                  />
                  <span className="text-sm text-gray-500">Hasta:</span>
                  <input
                    type="date"
                    value={fechaHasta}
                    onChange={(e) => setFechaHasta(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-taekwondo-primary"
                  />
                </div>
              )}
              
              <div className="lg:ml-auto flex items-center gap-2">
                <Calendar className="w-5 h-5 text-gray-500" />
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-taekwondo-primary"
                />
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-gray-500" />
                <select
                  value={selectedTurno}
                  onChange={(e) => setSelectedTurno(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-taekwondo-primary"
                >
                  {turnos.filter(t => t.activo).map(t => (
                    <option key={t.id} value={t.id}>{t.nombre}</option>
                  ))}
                </select>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Asistencia hoy</p>
                <p className="font-display text-xl">
                  <span className="text-green-600">{presentesCount}</span>
                  <span className="text-gray-400">/</span>
                  <span className="text-gray-900">{totalCount}</span>
                </p>
              </div>
              <div className="w-24 h-4 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-500 transition-all"
                  style={{ width: `${totalCount > 0 ? (presentesCount / totalCount) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>

          {/* Información del turno */}
          {selectedTurnoData && (
            <div className="bg-gradient-to-r from-taekwondo-secondary to-indigo-900 rounded-lg p-4 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display text-xl">{selectedTurnoData.nombre}</h3>
                  <p className="text-sm text-gray-300">
                    {selectedTurnoData.horaInicio} - {selectedTurnoData.horaFin} | {alumnosDelTurno.length} alumnos
                  </p>
                </div>
                <button
                  onClick={marcarTodosPresentes}
                  className="flex items-center gap-2 px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30"
                >
                  <RefreshCw className="w-4 h-4" />
                  Marcar todos presentes
                </button>
              </div>
            </div>
          )}

          {/* Buscador rápido */}
          <div className="card">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar alumno por nombre o DNI para registro rápido..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-taekwondo-primary"
              />
            </div>
            {searchTerm && filteredAlumnos.length === 0 && (
              <p className="text-sm text-gray-500 mt-2">No se encontraron alumnos con ese nombre o DNI</p>
            )}
          </div>

          {/* Lista de Alumnos con porcentaje */}
          <div className="space-y-2">
            {filteredAlumnos.map(alumno => {
              const presente = isAlumnoPresente(alumno.id);
              const porcentaje = getPorcentajeAsistencia(alumno.id, fechaDesde, fechaHasta);
              const totalClases = getAsistenciasByAlumno(alumno.id, fechaDesde, fechaHasta).length;
              
              return (
                <div 
                  key={alumno.id}
                  className={`card flex items-center justify-between transition-all ${
                    presente 
                      ? 'bg-green-50 border-green-300' 
                      : 'hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                      presente ? 'bg-green-500' : 'bg-taekwondo-secondary'
                    }`}>
                      {alumno.nombre[0]}{alumno.apellido[0]}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {alumno.nombre} {alumno.apellido}
                      </p>
                      <p className="text-sm text-gray-500">DNI: {alumno.dni}</p>
                    </div>
                  </div>
                  
                  {/* Porcentaje de asistencia */}
                  <div className="flex items-center gap-4 mx-4">
                    <div className="text-right">
                      <p className="text-xs text-gray-500">
                        {periodo === 'semana' ? 'Esta semana' : periodo === 'mes' ? 'Este mes' : 'Período'}
                      </p>
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${porcentaje >= 80 ? 'bg-green-500' : porcentaje >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
                            style={{ width: `${porcentaje}%` }}
                          />
                        </div>
                        <span className={`font-medium text-sm ${
                          porcentaje >= 80 ? 'text-green-600' : porcentaje >= 50 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {porcentaje}%
                        </span>
                      </div>
                      <p className="text-xs text-gray-400">{totalClases} clases</p>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => toggleAsistencia(alumno.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                      presente
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {presente ? (
                      <>
                        <Check className="w-4 h-4" />
                        Presente
                      </>
                    ) : (
                      <>
                        <X className="w-4 h-4" />
                        Ausente
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>

          {filteredAlumnos.length === 0 && (
            <div className="card text-center py-12">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No hay alumnos en este turno</p>
            </div>
          )}
        </>
      ) : (
        /* Vista de Historial */
        <>
          {/* Filtros */}
          <div className="card">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">Turno:</label>
                <select
                  value={historialTurno}
                  onChange={(e) => setHistorialTurno(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-taekwondo-primary"
                >
                  <option value="">Todos los turnos</option>
                  {turnos.filter(t => t.activo).map(t => (
                    <option key={t.id} value={t.id}>{t.nombre}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">Alumno:</label>
                <select
                  value={historialAlumno}
                  onChange={(e) => setHistorialAlumno(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-taekwondo-primary"
                >
                  <option value="">Todos los alumnos</option>
                  {alumnos.filter(a => a.activo).map(a => (
                    <option key={a.id} value={a.id}>{a.nombre} {a.apellido}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Historial */}
          <div className="space-y-4">
            {historialData.map(([fecha, asists]) => {
              const turnoInfo = turnos.find(t => t.id === asists[0].turnoId);
              const presentes = asists.filter(a => a.presente).length;
              
              return (
                <div key={fecha} className="card">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-display text-lg text-taekwondo-secondary">
                        {format(new Date(fecha), "EEEE d 'de' MMMM", { locale: es })}
                      </h3>
                      <p className="text-sm text-gray-500">{turnoInfo?.nombre}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Asistencia</p>
                        <p className="font-display text-xl">
                          <span className="text-green-600">{presentes}</span>
                          <span className="text-gray-400">/</span>
                          <span className="text-gray-900">{asists.length}</span>
                        </p>
                      </div>
                      <div className="w-20 h-3 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-green-500"
                          style={{ width: `${asists.length > 0 ? (presentes / asists.length) * 100 : 0}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {asists.map(a => {
                      const alum = alumnos.find(al => al.id === a.alumnoId);
                      return (
                        <div 
                          key={a.id}
                          className={`flex items-center gap-2 p-2 rounded ${
                            a.presente ? 'bg-green-50' : 'bg-red-50'
                          }`}
                        >
                          {a.presente ? (
                            <Check className="w-4 h-4 text-green-600" />
                          ) : (
                            <X className="w-4 h-4 text-red-600" />
                          )}
                          <span className="text-sm truncate">
                            {alum?.nombre} {alum?.apellido}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {historialData.length === 0 && (
            <div className="card text-center py-12">
              <ClipboardCheck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No hay registros de asistencia</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}