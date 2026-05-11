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
import { supabase, isConfigured } from '../lib/supabase';

interface AppState {
  isLoading: boolean;
  isSupabaseConfigured: boolean;
  
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
  
  // Actions
  initializeStore: () => Promise<void>;
  
  // CRUD Alumnos
  addAlumno: (alumno: Alumno) => Promise<void>;
  updateAlumno: (id: string, data: Partial<Alumno>) => Promise<void>;
  deleteAlumno: (id: string) => Promise<void>;
  
  // CRUD Instructores
  addInstructor: (instructor: Instructor) => Promise<void>;
  updateInstructor: (id: string, data: Partial<Instructor>) => Promise<void>;
  deleteInstructor: (id: string) => Promise<void>;
  
  // CRUD Turnos
  addTurno: (turno: Turno) => Promise<void>;
  updateTurno: (id: string, data: Partial<Turno>) => Promise<void>;
  deleteTurno: (id: string) => Promise<void>;
  
  // CRUD Grados
  addGrado: (grado: Grado) => Promise<void>;
  updateGrado: (id: string, data: Partial<Grado>) => Promise<void>;
  deleteGrado: (id: string) => Promise<void>;
  
  // CRUD Cuotas
  addCuota: (cuota: Cuota) => Promise<void>;
  updateCuota: (id: string, data: Partial<Cuota>) => Promise<void>;
  deleteCuota: (id: string) => Promise<void>;
  
  // CRUD Asistencias
  addAsistencia: (asistencia: Asistencia) => Promise<void>;
  updateAsistencia: (id: string, data: Partial<Asistencia>) => Promise<void>;
  
  // CRUD Liquidaciones
  addLiquidacion: (liquidacion: Liquidacion) => Promise<void>;
  updateLiquidacion: (id: string, data: Partial<Liquidacion>) => Promise<void>;
  marcarLiquidacionPagada: (id: string, aprobadoPor: string) => Promise<void>;
  
  // Notifications
  addNotificacion: (notificacion: Notificacion) => Promise<void>;
  marcarNotificacionLeida: (id: string) => Promise<void>;
  
  // UI
  toggleSidebar: () => void;
  
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
  getNotificacionesNoLeidas: () => Notificacion[];
}

const generateId = () => Math.random().toString(36).substring(2) + Date.now().toString(36);

export const useAppStore = create<AppState>((set, get) => ({
  isLoading: true,
  isSupabaseConfigured: false,
  
  // Datos iniciales
  alumnos: [],
  instructores: [],
  turnos: [],
  grados: [],
  cuotas: [],
  assistentecias: [],
  liquidaciones: [],
  notificaciones: [],
  config: configAcademia,
  usuario: usuarioActual,
  sidebarCollapsed: false,

  initializeStore: async () => {
    const configured = isConfigured();
    set({ isSupabaseConfigured: configured });
    
    if (!configured) {
      // Usar datos de ejemplo
      set({
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
        isLoading: false
      });
      return;
    }

    try {
      // Fetch all data from Supabase in parallel
      const [alumnosRes, instructoresRes, turnosRes, gradosRes, cuotasRes, asistenciasRes, liquidacionesRes, notificacionesRes] = await Promise.all([
        supabase.from('alumnos').select('*').eq('activo', true),
        supabase.from('instructores').select('*').eq('activo', true),
        supabase.from('turnos').select('*').eq('activo', true),
        supabase.from('grados').select('*').order('orden'),
        supabase.from('cuotas').select('*'),
        supabase.from('asistencias').select('*'),
        supabase.from('liquidaciones').select('*'),
        supabase.from('notificaciones').select('*').order('created_at', { ascending: false }).limit(50)
      ]);

      set({
        alumnos: alumnosRes.data || [],
        instructores: instructoresRes.data || [],
        turnos: turnosRes.data || [],
        grados: gradosRes.data || [],
        cuotas: cuotasRes.data || [],
        assistentecias: asistenciasRes.data || [],
        liquidaciones: liquidacionesRes.data || [],
        notificaciones: notificacionesRes.data || [],
        isLoading: false
      });
    } catch (error) {
      console.error('Error loading data from Supabase:', error);
      // Fallback to example data
      set({
        alumnos: exampleAlumnos,
        instructores: exampleInstructores,
        turnos: exampleTurnos,
        grados: exampleGrados,
        cuotas: exampleCuotas,
        assistentecias: exampleAsistencias,
        liquidaciones: exampleLiquidaciones,
        isLoading: false
      });
    }
  },

  // CRUD Alumnos
  addAlumno: async (alumno) => {
    const { isSupabaseConfigured } = get();
    if (isSupabaseConfigured) {
      const { data } = await supabase.from('alumnos').insert(alumno).select().single();
      if (data) set(state => ({ alumnos: [...state.alumnos, data] }));
    } else {
      set(state => ({ alumnos: [...state.alumnos, { ...alumno, id: generateId() }] }));
    }
  },

  updateAlumno: async (id, data) => {
    const { isSupabaseConfigured } = get();
    if (isSupabaseConfigured) {
      await supabase.from('alumnos').update(data).eq('id', id);
    }
    set(state => ({
      alumnos: state.alumnos.map(a => a.id === id ? { ...a, ...data } : a)
    }));
  },

  deleteAlumno: async (id) => {
    const { isSupabaseConfigured } = get();
    if (isSupabaseConfigured) {
      await supabase.from('alumnos').delete().eq('id', id);
    }
    set(state => ({
      alumnos: state.alumnos.filter(a => a.id !== id)
    }));
  },

  // CRUD Instructores
  addInstructor: async (instructor) => {
    const { isSupabaseConfigured } = get();
    if (isSupabaseConfigured) {
      const { data } = await supabase.from('instructores').insert(instructor).select().single();
      if (data) set(state => ({ instructores: [...state.instructores, data] }));
    } else {
      set(state => ({ instructores: [...state.instructores, { ...instructor, id: generateId() }] }));
    }
  },

  updateInstructor: async (id, data) => {
    const { isSupabaseConfigured } = get();
    if (isSupabaseConfigured) {
      await supabase.from('instructores').update(data).eq('id', id);
    }
    set(state => ({
      instructores: state.instructores.map(i => i.id === id ? { ...i, ...data } : i)
    }));
  },

  deleteInstructor: async (id) => {
    const { isSupabaseConfigured } = get();
    if (isSupabaseConfigured) {
      await supabase.from('instructores').update({ activo: false }).eq('id', id);
    }
    set(state => ({
      instructores: state.instructores.map(i => i.id === id ? { ...i, activo: false } : i)
    }));
  },

  // CRUD Turnos
  addTurno: async (turno) => {
    const { isSupabaseConfigured } = get();
    if (isSupabaseConfigured) {
      const { data } = await supabase.from('turnos').insert(turno).select().single();
      if (data) set(state => ({ turnos: [...state.turnos, data] }));
    } else {
      set(state => ({ turnos: [...state.turnos, { ...turno, id: generateId() }] }));
    }
  },

  updateTurno: async (id, data) => {
    const { isSupabaseConfigured } = get();
    if (isSupabaseConfigured) {
      await supabase.from('turnos').update(data).eq('id', id);
    }
    set(state => ({
      turnos: state.turnos.map(t => t.id === id ? { ...t, ...data } : t)
    }));
  },

  deleteTurno: async (id) => {
    const { isSupabaseConfigured } = get();
    if (isSupabaseConfigured) {
      await supabase.from('turnos').delete().eq('id', id);
    }
    set(state => ({
      turnos: state.turnos.filter(t => t.id !== id)
    }));
  },

  // CRUD Grados
  addGrado: async (grado) => {
    const { isSupabaseConfigured } = get();
    if (isSupabaseConfigured) {
      const { data } = await supabase.from('grados').insert(grado).select().single();
      if (data) set(state => ({ grados: [...state.grados, data] }));
    } else {
      set(state => ({ grados: [...state.grados, { ...grado, id: generateId() }] }));
    }
  },

  updateGrado: async (id, data) => {
    const { isSupabaseConfigured } = get();
    if (isSupabaseConfigured) {
      await supabase.from('grados').update(data).eq('id', id);
    }
    set(state => ({
      grados: state.grados.map(g => g.id === id ? { ...g, ...data } : g)
    }));
  },

  deleteGrado: async (id) => {
    const { isSupabaseConfigured } = get();
    if (isSupabaseConfigured) {
      await supabase.from('grados').delete().eq('id', id);
    }
    set(state => ({
      grados: state.grados.filter(g => g.id !== id)
    }));
  },

  // CRUD Cuotas
  addCuota: async (cuota) => {
    const { isSupabaseConfigured } = get();
    if (isSupabaseConfigured) {
      const { data } = await supabase.from('cuotas').insert(cuota).select().single();
      if (data) set(state => ({ cuotas: [...state.cuotas, data] }));
    } else {
      set(state => ({ cuotas: [...state.cuotas, { ...cuota, id: generateId() }] }));
    }
  },

  updateCuota: async (id, data) => {
    const { isSupabaseConfigured } = get();
    if (isSupabaseConfigured) {
      await supabase.from('cuotas').update(data).eq('id', id);
    }
    set(state => ({
      cuotas: state.cuotas.map(c => c.id === id ? { ...c, ...data } : c)
    }));
  },

  deleteCuota: async (id) => {
    const { isSupabaseConfigured } = get();
    if (isSupabaseConfigured) {
      await supabase.from('cuotas').delete().eq('id', id);
    }
    set(state => ({
      cuotas: state.cuotas.filter(c => c.id !== id)
    }));
  },

  // CRUD Asistencias
  addAsistencia: async (asistencia) => {
    const { isSupabaseConfigured } = get();
    if (isSupabaseConfigured) {
      const { data } = await supabase.from('asistencias').insert(asistencia).select().single();
      if (data) set(state => ({ assistentecias: [...state.assistentecias, data] }));
    } else {
      set(state => ({ assistentecias: [...state.assistentecias, { ...asistencia, id: generateId() }] }));
    }
  },

  updateAsistencia: async (id, data) => {
    const { isSupabaseConfigured } = get();
    if (isSupabaseConfigured) {
      await supabase.from('asistencias').update(data).eq('id', id);
    }
    set(state => ({
      assistentecias: state.assistentecias.map(a => a.id === id ? { ...a, ...data } : a)
    }));
  },

  // CRUD Liquidaciones
  addLiquidacion: async (liquidacion) => {
    const { isSupabaseConfigured } = get();
    if (isSupabaseConfigured) {
      const { data } = await supabase.from('liquidaciones').insert(liquidacion).select().single();
      if (data) set(state => ({ liquidaciones: [...state.liquidaciones, data] }));
    } else {
      set(state => ({ liquidaciones: [...state.liquidaciones, { ...liquidacion, id: generateId() }] }));
    }
  },

  updateLiquidacion: async (id, data) => {
    const { isSupabaseConfigured } = get();
    if (isSupabaseConfigured) {
      await supabase.from('liquidaciones').update(data).eq('id', id);
    }
    set(state => ({
      liquidaciones: state.liquidaciones.map(l => l.id === id ? { ...l, ...data } : l)
    }));
  },

  marcarLiquidacionPagada: async (id, aprobadoPor) => {
    const data = { estado: 'pagado' as const, fechaPago: new Date().toISOString().split('T')[0], aprobadoPor };
    const { isSupabaseConfigured } = get();
    if (isSupabaseConfigured) {
      await supabase.from('liquidaciones').update(data).eq('id', id);
    }
    set(state => ({
      liquidaciones: state.liquidaciones.map(l => l.id === id ? { ...l, ...data } : l)
    }));
  },

  // Notifications
  addNotificacion: async (notificacion) => {
    const { isSupabaseConfigured } = get();
    if (isSupabaseConfigured) {
      const { data } = await supabase.from('notificaciones').insert(notificacion).select().single();
      if (data) set(state => ({ notificaciones: [data, ...state.notificaciones] }));
    } else {
      set(state => ({ notificaciones: [{ ...notificacion, id: generateId() }, ...state.notificaciones] }));
    }
  },

  marcarNotificacionLeida: async (id) => {
    const { isSupabaseConfigured } = get();
    if (isSupabaseConfigured) {
      await supabase.from('notificaciones').update({ leida: true }).eq('id', id);
    }
    set(state => ({
      notificaciones: state.notificaciones.map(n => n.id === id ? { ...n, leida: true } : n)
    }));
  },

  // UI
  toggleSidebar: () => set(state => ({ sidebarCollapsed: !state.sidebarCollapsed })),

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
    
    if (alumno.montoIndividual) {
      return {
        monto: alumno.montoIndividual,
        tieneDescuentoFamiliar: false,
        montoOriginal: alumno.montoIndividual
      };
    }
    
    const montoBase = turno?.precioCuota || config.montoDefault;
    
    let tieneDescuentoFamiliar = false;
    let montoConDescuento = montoBase;
    
    if (alumno.grupoFamiliarId) {
      const cantidadEnGrupo = get().alumnos.filter(
        a => a.grupoFamiliarId === alumno.grupoFamiliarId && a.activo
      ).length;
      
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

  getNotificacionesNoLeidas: () => get().notificaciones.filter(n => !n.leida),
}));