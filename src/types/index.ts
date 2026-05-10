export interface Alumno {
  id: string;
  nombre: string;
  apellido: string;
  dni: string;
  telefono: string;
  email: string;
  fechaNacimiento: string;
  turnoId: string;
  gradoId: string;
  fechaInicio: string;
  contactoEmergenciaNombre: string;
  contactoEmergenciaTelefono: string;
  activo: boolean;
  fotoUrl?: string;
  observaciones?: string;
  // Campos para cuotas
  montoIndividual?: number;  // Monto personalizado del alumno (null = usa precio del turno)
  grupoFamiliarId?: string;  // ID del grupo familiar (para descuentos)
}

export interface Instructor {
  id: string;
  nombre: string;
  apellido: string;
  dni: string;
  cuil: string;
  telefono: string;
  email: string;
  fechaNacimiento: string;
  turnoId: string;
  porcentajeCobro: number;
  cbuAlias?: string;
  activo: boolean;
  fotoUrl?: string;
}

export interface Turno {
  id: string;
  nombre: string;
  diasSemana: string[];
  horaInicio: string;
  horaFin: string;
  precioCuota: number;
  capacidadMax: number;
  activo: boolean;
  instructorId: string;
}

export interface Grado {
  id: string;
  nombre: string;
  colorHex: string;
  orden: number;
}

export interface Asistencia {
  id: string;
  alumnoId: string;
  turnoId: string;
  fecha: string;
  presente: boolean;
  registradoPor: string;
}

export interface Cuota {
  id: string;
  alumnoId: string;
  turnoId: string;
  periodoMes: number;
  periodoAnio: number;
  monto: number;
  descuento: number;
  recargo: number;
  montoFinal: number;
  estado: 'pagada' | 'pendiente' | 'vencida';
  fechaPago?: string;
  metodoPago?: 'efectivo' | 'transferencia' | 'mercadopago';
  comprobanteUrl?: string;
  registradoPor: string;
}

export interface Liquidacion {
  id: string;
  instructorId: string;
  turnoId: string;
  periodoMes: number;
  periodoAnio: number;
  totalRecaudado: number;
  porcentaje: number;
  montoInstructor: number;
  estado: 'pendiente' | 'pagado';
  fechaPago?: string;
  aprobadoPor?: string;
}

export interface Usuario {
  id: string;
  email: string;
  nombre: string;
  rol: 'administrador' | 'recepcionista' | 'instructor';
  activo: boolean;
}

export interface AcademiaConfig {
  nombre: string;
  logoUrl?: string;
  direccion: string;
  telefono: string;
  email: string;
  diaVencimiento: number;
  diasGracia: number;
  recargoMora: number;
  descuentoFamiliarPorcentaje: number;
  cantidadMinimaGrupoFamiliar: number;
  montoDefault: number;
}

export interface Notificacion {
  id: string;
  tipo: 'cuota_vencida' | 'cumpleanos' | 'asistencia_baja' | 'info';
  titulo: string;
  mensaje: string;
  leida: boolean;
  fecha: string;
}