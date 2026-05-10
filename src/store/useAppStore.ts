import { create } from 'zustand';
import type { Alumno, Instructor, Turno, Grado, Cuota, Asistencia, AcademiaConfig, Usuario, Liquidacion, Notificacion } from '../types';
import { 
  alumnos as exampleAlumnos,
  instructores as exampleInstructores,
  turnos as exampleTurnos,
  grados as exampleGrados,
  cuotaAlumnos as exampleCuotas,
  historialAsistencias as exampleAsistencias,
  configAcademia,
  usuarioActual
} from '../data/exampleData';

import { liquidaciones as exampleLiquidaciones } from '../data/exampleData';

interface AppState {
  // Datos
  alumnos: Alumno[];
  instructores: Instructor[];
  turnos: Turno[];
  grados: Grado[];
  cuotas: Cuota[];
  assistentecias: Asistencia[];
  liquidaciones: Liquidacion[];
  notificaciones: Notificacion[];
  config: AcademiaConfig;
  usuario: Usuario;
  sidebarCollapsed: boolean;
  
  // Getters calculados
  getAlumnosActivos: () => Alumno[];
  getAlumnosByTurno: (turnoId: string) => Alumno[];
  getInstructorByTurno: (turnoId: string) => Instructor | undefined;
  getCuotasByAlumno: (alumnoId: string) => Cuota[];
  getCuotasByTurno: (turnoId: string) => Cuota[];
  getCuotasVencidas: () => Cuota[];
  getCuotasCobradasByTurno: (turnoId: string, mes: number, anio: number) => Cuota[];
  getAsistenciasByFecha: (fecha: string, turnoId?: string) => Asistencia[];
  getAsistenciaCount: () => { presentes: number; total: number };
  getAsistenciasByAlumno: (alumnoId: string, fechaDesde?: string, fechaHasta?: string) => Asistencia[];
  getPorcentajeAsistencia: (alumnoId: string, fechaDesde?: string, fechaHasta?: string) => number;
  getIngresosMes: () => number;
  getIngresosByPeriodo: (mes: number, anio: number) => number;
  getProximosCumpleanos: () => Alumno[];
  getLiquidacionesByInstructor: (instructorId: string) => Liquidacion[];
  getLiquidacionesByPeriodo: (mes: number, anio: number) => Liquidacion[];
  getLiquidacionPendiente: (instructorId: string, mes: number, anio: number) => Liquidacion | undefined;
  getTotalPagadoInstructores: (mes: number, anio: number) => number;
  getMargenAcademia: (mes: number, anio: number) => { ingreso: number; gasto: number; margen: number };
  getMontoCuota: (alumnoId: string) => { monto: number; tieneDescuentoFamiliar: boolean; montoOriginal: number };
  
  // Acciones
  toggleSidebar: () => void;
  addAlumno: (alumno: Alumno) => void;
  updateAlumno: (id: string, data: Partial<Alumno>) => void;
  addCuota: (cuota: Cuota) => void;
  updateCuota: (id: string, data: Partial<Cuota>) => void;
  addAsistencia: (asistencia: Asistencia) => void;
  updateAsistencia: (id: string, data: Partial<Asistencia>) => void;
  addInstructor: (instructor: Instructor) => void;
  updateInstructor: (id: string, data: Partial<Instructor>) => void;
  addLiquidacion: (liquidacion: Liquidacion) => void;
  updateLiquidacion: (id: string, data: Partial<Liquidacion>) => void;
  marcarLiquidacionPagada: (id: string, aprobadoPor: string) => void;
  addNotificacion: (notificacion: Notificacion) => void;
  marcarNotificacionLeida: (id: string) => void;
  getNotificacionesNoLeidas: () => Notificacion[];
}

export const useAppStore = create<AppState>((set, get) => ({
  // Datos iniciales
  alumnos: exampleAlumnos,
  instructores: exampleInstructores,
  turnos: exampleTurnos,
  grados: exampleGrados,
  cuotas: exampleCuotas,
  assistentecias: exampleAsistencias,
  liquidaciones: exampleLiquidaciones,
  notificaciones: [
    { id: 'n1', tipo: 'cuota_vencida', titulo: 'Cuotas Vencidas', mensaje: 'Hay 3 alumnos con cuota vencida', leida: false, fecha: new Date().toISOString().split('T')[0] },
    { id: 'n2', tipo: 'cumpleanos', titulo: 'Cumpleaños', mensaje: 'Hoy es el cumpleaños de Alejandro Díaz', leida: false, fecha: new Date().toISOString().split('T')[0] },
  ],
  config: configAcademia,
  usuario: usuarioActual,
  sidebarCollapsed: false,

  // Getters
  getAlumnosActivos: () => get().alumnos.filter(a => a.activo),
  
  getAlumnosByTurno: (turnoId: string) => 
    get().alumnos.filter(a => a.turnoId === turnoId && a.activo),
  
  getInstructorByTurno: (turnoId: string) => 
    get().instructores.find(i => i.turnoId === turnoId),
  
  getCuotasByAlumno: (_alumnoId: string) => 
    get().cuotas.filter(c => c.alumnoId === _alumnoId),
  
  getCuotasByTurno: (turnoId: string) => 
    get().cuotas.filter(c => c.turnoId === turnoId),
  
  getCuotasVencidas: () => 
    get().cuotas.filter(c => c.estado === 'vencida'),
  
  getCuotasCobradasByTurno: (turnoId: string, mes: number, anio: number) =>
    get().cuotas.filter(c => c.turnoId === turnoId && c.periodoMes === mes && c.periodoAnio === anio && c.estado === 'pagada'),
  
  getAsistenciasByFecha: (fecha: string, turnoId?: string) => {
    const filtered = get().assistentecias.filter(a => a.fecha === fecha);
    return turnoId ? filtered.filter(a => a.turnoId === turnoId) : filtered;
  },
  
  getAsistenciaCount: () => {
    const hoy = new Date().toISOString().split('T')[0];
    const todayAsistencias = get().assistentecias.filter(a => a.fecha === hoy);
    return {
      presentes: todayAsistencias.filter(a => a.presente).length,
      total: todayAsistencias.length,
    };
  },
  
  getAsistenciasByAlumno: (alumnoId: string, fechaDesde?: string, fechaHasta?: string) => {
    let filtered = get().assistentecias.filter(a => a.alumnoId === alumnoId);
    
    if (fechaDesde) {
      filtered = filtered.filter(a => a.fecha >= fechaDesde);
    }
    if (fechaHasta) {
      filtered = filtered.filter(a => a.fecha <= fechaHasta);
    }
    
    return filtered.sort((a, b) => b.fecha.localeCompare(a.fecha));
  },
  
  getPorcentajeAsistencia: (alumnoId: string, fechaDesde?: string, fechaHasta?: string) => {
    const asistencia = get().getAsistenciasByAlumno(alumnoId, fechaDesde, fechaHasta);
    if (asistencia.length === 0) return 0;
    
    const presentes = asistencia.filter(a => a.presente).length;
    return Math.round((presentes / asistencia.length) * 100);
  },
  
  getIngresosMes: () => {
    const hoy = new Date();
    const mesActual = hoy.getMonth() + 1;
    const anioActual = hoy.getFullYear();
    return get()
      .cuotas.filter(c => c.periodoMes === mesActual && c.periodoAnio === anioActual && c.estado === 'pagada')
      .reduce((sum, c) => sum + c.montoFinal, 0);
  },
  
  getIngresosByPeriodo: (mes: number, anio: number) =>
    get()
      .cuotas.filter(c => c.periodoMes === mes && c.periodoAnio === anio && c.estado === 'pagada')
      .reduce((sum, c) => sum + c.montoFinal, 0),
  
  getProximosCumpleanos: () => {
    const hoy = new Date();
    const mesActual = hoy.getMonth() + 1;
    const diaActual = hoy.getDate();
    const anioActual = hoy.getFullYear();
    
    return get()
      .alumnos.filter(a => a.activo)
      .map(a => {
        const fechaNac = new Date(a.fechaNacimiento);
        const mesCumple = fechaNac.getMonth() + 1;
        const diaCumple = fechaNac.getDate();
        
        let diasRestantes = 0;
        if (mesCumple === mesActual) {
          diasRestantes = diaCumple - diaActual;
        } else if (mesCumple > mesActual) {
          const daysInMonth = new Date(anioActual, mesActual, 0).getDate();
          diasRestantes = (daysInMonth - diaActual) + diaCumple;
        }
        
        const edad = anioActual - fechaNac.getFullYear();
        
        return { ...a, diasRestantes, edadCumple: edad + 1 };
      })
      .filter(a => a.diasRestantes >= 0 && a.diasRestantes <= 30)
      .sort((a, b) => a.diasRestantes - b.diasRestantes)
      .slice(0, 5);
  },

  getLiquidacionesByInstructor: (instructorId: string) =>
    get().liquidaciones.filter(l => l.instructorId === instructorId),
  
  getLiquidacionesByPeriodo: (mes: number, anio: number) =>
    get().liquidaciones.filter(l => l.periodoMes === mes && l.periodoAnio === anio),
  
  getLiquidacionPendiente: (instructorId: string, mes: number, anio: number) =>
    get().liquidaciones.find(l => l.instructorId === instructorId && l.periodoMes === mes && l.periodoAnio === anio),
  
  getTotalPagadoInstructores: (mes: number, anio: number) =>
    get()
      .liquidaciones.filter(l => l.periodoMes === mes && l.periodoAnio === anio && l.estado === 'pagado')
      .reduce((sum, l) => sum + l.montoInstructor, 0),
  
  getMargenAcademia: (mes: number, anio: number) => {
    const ingreso = get().getIngresosByPeriodo(mes, anio);
    const gasto = get().getTotalPagadoInstructores(mes, anio);
    return {
      ingreso,
      gasto,
      margen: ingreso - gasto
    };
  },

  getMontoCuota: (alumnoId: string) => {
    const alumno = get().alumnos.find(a => a.id === alumnoId);
    if (!alumno) return { monto: 0, tieneDescuentoFamiliar: false, montoOriginal: 0 };
    
    const turno = get().turnos.find(t => t.id === alumno.turnoId);
    const config = get().config;
    
    // 1. Si tiene monto individual, usarlo
    if (alumno.montoIndividual) {
      return {
        monto: alumno.montoIndividual,
        tieneDescuentoFamiliar: false,
        montoOriginal: alumno.montoIndividual
      };
    }
    
    // 2. Usar precio del turno o default
    const montoBase = turno?.precioCuota || config.montoDefault;
    
    // 3. Verificar descuento familiar
    let tieneDescuentoFamiliar = false;
    let montoConDescuento = montoBase;
    
    if (alumno.grupoFamiliarId) {
      // Contar cuántos hay en el grupo familiar
      const cantidadEnGrupo = get().alumnos.filter(
        a => a.grupoFamiliarId === alumno.grupoFamiliarId && a.activo
      ).length;
      
      // Si hay suficientes miembros, aplicar descuento
      if (cantidadEnGrupo >= config.cantidadMinimaGrupoFamiliar) {
        const descuento = Math.round(montoBase * (config.descuentoFamiliarPorcentaje / 100));
        montoConDescuento = montoBase - descuento;
        tieneDescuentoFamiliar = true;
      }
    }
    
    return {
      monto: montoConDescuento,
      tieneDescuentoFamiliar,
      montoOriginal: montoBase
    };
  },

  // Acciones
  toggleSidebar: () => set(state => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  
  addAlumno: (alumno) => set(state => ({ 
    alumnos: [...state.alumnos, alumno] 
  })),
  
  updateAlumno: (id, data) => set(state => ({
    alumnos: state.alumnos.map(a => a.id === id ? { ...a, ...data } : a)
  })),
  
  addCuota: (cuota) => set(state => ({
    cuotas: [...state.cuotas, cuota]
  })),
  
  updateCuota: (id, data) => set(state => ({
    cuotas: state.cuotas.map(c => c.id === id ? { ...c, ...data } : c)
  })),
  
  addAsistencia: (asistencia) => set(state => ({
    assistentecias: [...state.assistentecias, asistencia]
  })),
  
  updateAsistencia: (id, data) => set(state => ({
    assistentecias: state.assistentecias.map(a => a.id === id ? { ...a, ...data } : a)
  })),
  
  addInstructor: (instructor) => set(state => ({
    instructores: [...state.instructores, instructor]
  })),
  
  updateInstructor: (id, data) => set(state => ({
    instructores: state.instructores.map(i => i.id === id ? { ...i, ...data } : i)
  })),
  
  addLiquidacion: (liquidacion) => set(state => ({
    liquidaciones: [...state.liquidaciones, liquidacion]
  })),
  
  updateLiquidacion: (id, data) => set(state => ({
    liquidaciones: state.liquidaciones.map(l => l.id === id ? { ...l, ...data } : l)
  })),
  
  marcarLiquidacionPagada: (id, aprobadoPor) => set(state => ({
    liquidaciones: state.liquidaciones.map(l => 
      l.id === id 
        ? { ...l, estado: 'pagado' as const, fechaPago: new Date().toISOString().split('T')[0], aprobadoPor }
        : l
    )
  })),
  
  addNotificacion: (notificacion) => set(state => ({
    notificaciones: [notificacion, ...state.notificaciones]
  })),
  
  marcarNotificacionLeida: (id) => set(state => ({
    notificaciones: state.notificaciones.map(n => n.id === id ? { ...n, leida: true } : n)
  })),
  
  getNotificacionesNoLeidas: () => get().notificaciones.filter(n => !n.leida),
}));