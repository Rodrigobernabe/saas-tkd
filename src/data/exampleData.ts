import type { Alumno, Instructor, Turno, Grado, Cuota, Asistencia, AcademiaConfig } from '../types';

export const grados: Grado[] = [
  { id: 'g1', nombre: 'Blanco', colorHex: '#FFFFFF', orden: 1 },
  { id: 'g2', nombre: 'Amarillo', colorHex: '#FFD700', orden: 2 },
  { id: 'g3', nombre: 'Naranja', colorHex: '#FF8C00', orden: 3 },
  { id: 'g4', nombre: 'Verde', colorHex: '#228B22', orden: 4 },
  { id: 'g5', nombre: 'Azul', colorHex: '#4169E1', orden: 5 },
  { id: 'g6', nombre: 'Rojo', colorHex: '#DC143C', orden: 6 },
  { id: 'g7', nombre: 'Negro 1er Dan', colorHex: '#000000', orden: 7 },
  { id: 'g8', nombre: 'Negro 2do Dan', colorHex: '#000000', orden: 8 },
];

export const turnos: Turno[] = [
  {
    id: 't1',
    nombre: 'Lunes y Miércoles 18:00',
    diasSemana: ['lunes', 'miercoles'],
    horaInicio: '18:00',
    horaFin: '19:30',
    precioCuota: 25000,
    capacidadMax: 20,
    activo: true,
    instructorId: 'i1',
  },
  {
    id: 't2',
    nombre: 'Martes y Jueves 19:00',
    diasSemana: ['martes', 'jueves'],
    horaInicio: '19:00',
    horaFin: '20:30',
    precioCuota: 25000,
    capacidadMax: 15,
    activo: true,
    instructorId: 'i2',
  },
  {
    id: 't3',
    nombre: 'Sábado 10:00',
    diasSemana: ['sabado'],
    horaInicio: '10:00',
    horaFin: '12:00',
    precioCuota: 20000,
    capacidadMax: 25,
    activo: true,
    instructorId: 'i3',
  },
];

export const instructores: Instructor[] = [
  {
    id: 'i1',
    nombre: 'Carlos',
    apellido: 'Mendoza',
    dni: '28456321',
    cuil: '20-28456321-5',
    telefono: '351-4567890',
    email: 'carlos.mendoza@olimpia.com',
    fechaNacimiento: '1985-03-15',
    turnoId: 't1',
    porcentajeCobro: 40,
    cbuAlias: 'carlos.mendoza.alias',
    activo: true,
  },
  {
    id: 'i2',
    nombre: 'María',
    apellido: 'López',
    dni: '31567890',
    cuil: '27-31567890-3',
    telefono: '351-2345678',
    email: 'maria.lopez@olimpia.com',
    fechaNacimiento: '1990-07-22',
    turnoId: 't2',
    porcentajeCobro: 35,
    cbuAlias: 'maria.lopez.alias',
    activo: true,
  },
  {
    id: 'i3',
    nombre: 'José',
    apellido: 'Rodríguez',
    dni: '25678901',
    cuil: '20-25678901-8',
    telefono: '351-3456789',
    email: 'jose.rodriguez@olimpia.com',
    fechaNacimiento: '1982-11-08',
    turnoId: 't3',
    porcentajeCobro: 38,
    cbuAlias: 'jose.rodriguez.alias',
    activo: true,
  },
];

const hoy = new Date();
const mesActual = hoy.getMonth() + 1;
const anioActual = hoy.getFullYear();

export const alumnos: Alumno[] = [
  // Grupo familiar 1: García (2 hermanos) - descuento familiar
  { id: 'a1', nombre: 'Santiago', apellido: 'García', dni: '55678901', telefono: '351-1111111', email: 'santiago.garcia@email.com', fechaNacimiento: '2010-05-15', turnoId: 't1', gradoId: 'g5', fechaInicio: '2022-03-01', contactoEmergenciaNombre: 'Laura García', contactoEmergenciaTelefono: '351-2222222', activo: true, grupoFamiliarId: 'fam1' },
  { id: 'a2', nombre: 'Valentina', apellido: 'García', dni: '55789012', telefono: '351-1111222', email: 'valentina.f@email.com', fechaNacimiento: '2012-08-20', turnoId: 't1', gradoId: 'g3', fechaInicio: '2023-06-15', contactoEmergenciaNombre: 'Roberto Fernández', contactoEmergenciaTelefono: '351-2222333', activo: true, grupoFamiliarId: 'fam1' },
  { id: 'a3', nombre: 'Mateo', apellido: 'López', dni: '55890123', telefono: '351-1111333', email: 'mateo.l@email.com', fechaNacimiento: '2008-02-10', turnoId: 't1', gradoId: 'g7', fechaInicio: '2020-01-10', contactoEmergenciaNombre: 'Ana López', contactoEmergenciaTelefono: '351-2222444', activo: true },
  // Grupo familiar 2: Martínez-González (2 hermanos) - descuento familiar
  { id: 'a4', nombre: 'Sofía', apellido: 'Martínez', dni: '55901234', telefono: '351-1111444', email: 'sofia.m@email.com', fechaNacimiento: '2015-11-25', turnoId: 't2', gradoId: 'g2', fechaInicio: '2024-02-01', contactoEmergenciaNombre: 'Pedro Martínez', contactoEmergenciaTelefono: '351-2222555', activo: true, grupoFamiliarId: 'fam2' },
  { id: 'a5', nombre: 'Lucas', apellido: 'González', dni: '55012345', telefono: '351-1111555', email: 'lucas.g@email.com', fechaNacimiento: '2009-07-08', turnoId: 't2', gradoId: 'g4', fechaInicio: '2021-09-15', contactoEmergenciaNombre: 'Patricia González', contactoEmergenciaTelefono: '351-2222666', activo: true, grupoFamiliarId: 'fam2' },
  { id: 'a6', nombre: 'Isabella', apellido: 'Rodríguez', dni: '55123456', telefono: '351-1111666', email: 'isabella.r@email.com', fechaNacimiento: '2013-04-18', turnoId: 't2', gradoId: 'g6', fechaInicio: '2022-05-20', contactoEmergenciaNombre: 'Jorge Rodríguez', contactoEmergenciaTelefono: '351-2222777', activo: true },
  // Grupo familiar 3: Sánchez-Torres (2 hermanos) - descuento familiar
  { id: 'a7', nombre: 'Diego', apellido: 'Sánchez', dni: '55234567', telefono: '351-1111777', email: 'diego.s@email.com', fechaNacimiento: '2011-09-30', turnoId: 't3', gradoId: 'g1', fechaInicio: '2024-03-01', contactoEmergenciaNombre: 'Rosa Sánchez', contactoEmergenciaTelefono: '351-2222888', activo: true, grupoFamiliarId: 'fam3' },
  { id: 'a8', nombre: 'Emilia', apellido: 'Torres', dni: '55345678', telefono: '351-1111888', email: 'emilia.t@email.com', fechaNacimiento: '2014-12-12', turnoId: 't3', gradoId: 'g3', fechaInicio: '2023-08-10', contactoEmergenciaNombre: 'Miguel Torres', contactoEmergenciaTelefono: '351-2222999', activo: true, grupoFamiliarId: 'fam3' },
  { id: 'a9', nombre: 'Alejandro', apellido: 'Díaz', dni: '55456789', telefono: '351-1111999', email: 'ale.diaz@email.com', fechaNacimiento: '2007-06-05', turnoId: 't3', gradoId: 'g8', fechaInicio: '2019-04-15', contactoEmergenciaNombre: 'Silvia Díaz', contactoEmergenciaTelefono: '351-2222000', activo: true, montoIndividual: 18000 },
  { id: 'a10', nombre: 'Valentina', apellido: 'Morales', dni: '55567890', telefono: '351-1112000', email: 'valentina.m@email.com', fechaNacimiento: '2016-01-22', turnoId: 't1', gradoId: 'g4', fechaInicio: '2023-11-01', contactoEmergenciaNombre: 'Carlos Morales', contactoEmergenciaTelefono: '351-2222111', activo: true },
  { id: 'a11', nombre: 'Gabriel', apellido: 'Ramírez', dni: '55678911', telefono: '351-1112111', email: 'gabriel.r@email.com', fechaNacimiento: '2010-03-17', turnoId: 't2', gradoId: 'g5', fechaInicio: '2022-07-20', contactoEmergenciaNombre: 'Elena Ramírez', contactoEmergenciaTelefono: '351-2222222', activo: true },
  { id: 'a12', nombre: 'Martina', apellido: 'Herrera', dni: '55789013', telefono: '351-1112222', email: 'martina.h@email.com', fechaNacimiento: '2012-10-09', turnoId: 't3', gradoId: 'g2', fechaInicio: '2024-01-15', contactoEmergenciaNombre: 'Oscar Herrera', contactoEmergenciaTelefono: '351-2222333', activo: true },
  { id: 'a13', nombre: 'Nicolás', apellido: 'Castillo', dni: '55890124', telefono: '351-1112333', email: 'nicolas.c@email.com', fechaNacimiento: '2008-08-14', turnoId: 't1', gradoId: 'g6', fechaInicio: '2021-02-28', contactoEmergenciaNombre: 'Liliana Castillo', contactoEmergenciaTelefono: '351-2222444', activo: true },
  { id: 'a14', nombre: 'Emma', apellido: 'Vega', dni: '55901235', telefono: '351-1112444', email: 'emma.v@email.com', fechaNacimiento: '2015-05-28', turnoId: 't2', gradoId: 'g1', fechaInicio: '2024-04-01', contactoEmergenciaNombre: 'Daniel Vega', contactoEmergenciaTelefono: '351-2222555', activo: true },
  { id: 'a15', nombre: 'Benjamín', apellido: 'Reyes', dni: '55012346', telefono: '351-1112555', email: 'benjamin.r@email.com', fechaNacimiento: '2011-11-03', turnoId: 't3', gradoId: 'g4', fechaInicio: '2023-03-10', contactoEmergenciaNombre: 'Claudia Reyes', contactoEmergenciaTelefono: '351-2222666', activo: true },
  { id: 'a16', nombre: 'Catalina', apellido: 'Flores', dni: '55123457', telefono: '351-1112666', email: 'catalina.f@email.com', fechaNacimiento: '2013-07-19', turnoId: 't1', gradoId: 'g2', fechaInicio: '2024-02-15', contactoEmergenciaNombre: 'Gustavo Flores', contactoEmergenciaTelefono: '351-2222777', activo: false },
  { id: 'a17', nombre: 'Thiago', apellido: 'Aguilar', dni: '55234568', telefono: '351-1112777', email: 'thiago.a@email.com', fechaNacimiento: '2009-04-25', turnoId: 't2', gradoId: 'g7', fechaInicio: '2020-08-20', contactoEmergenciaNombre: 'Andrea Aguilar', contactoEmergenciaTelefono: '351-2222888', activo: true },
  { id: 'a18', nombre: 'Juana', apellido: 'Benítez', dni: '55345679', telefono: '351-1112888', email: 'juana.b@email.com', fechaNacimiento: '2014-02-11', turnoId: 't3', gradoId: 'g3', fechaInicio: '2023-09-05', contactoEmergenciaNombre: 'Walter Benítez', contactoEmergenciaTelefono: '351-2222999', activo: true },
  { id: 'a19', nombre: 'Samuel', apellido: 'Correa', dni: '55456790', telefono: '351-1112999', email: 'samuel.c@email.com', fechaNacimiento: '2007-12-29', turnoId: 't1', gradoId: 'g5', fechaInicio: '2022-01-10', contactoEmergenciaNombre: 'Mónica Correa', contactoEmergenciaTelefono: '351-2223000', activo: true },
  { id: 'a20', nombre: 'Luna', apellido: 'Medina', dni: '55567891', telefono: '351-1113000', email: 'luna.m@email.com', fechaNacimiento: '2016-06-07', turnoId: 't2', gradoId: 'g1', fechaInicio: '2024-05-01', contactoEmergenciaNombre: 'Fernando Medina', contactoEmergenciaTelefono: '351-2223111', activo: true },
];

export const cuotaAlumnos: Cuota[] = [
  { id: 'c1', alumnoId: 'a1', turnoId: 't1', periodoMes: mesActual, periodoAnio: anioActual, monto: 25000, descuento: 0, recargo: 0, montoFinal: 25000, estado: 'pagada', fechaPago: `${anioActual}-${mesActual.toString().padStart(2, '0')}-05`, metodoPago: 'transferencia', registradoPor: 'admin' },
  { id: 'c2', alumnoId: 'a2', turnoId: 't1', periodoMes: mesActual, periodoAnio: anioActual, monto: 25000, descuento: 0, recargo: 0, montoFinal: 25000, estado: 'pagada', fechaPago: `${anioActual}-${mesActual.toString().padStart(2, '0')}-08`, metodoPago: 'efectivo', registradoPor: 'admin' },
  { id: 'c3', alumnoId: 'a3', turnoId: 't1', periodoMes: mesActual, periodoAnio: anioActual, monto: 25000, descuento: 0, recargo: 0, montoFinal: 25000, estado: 'pagada', fechaPago: `${anioActual}-${mesActual.toString().padStart(2, '0')}-02`, metodoPago: 'mercadopago', registradoPor: 'admin' },
  { id: 'c4', alumnoId: 'a4', turnoId: 't2', periodoMes: mesActual, periodoAnio: anioActual, monto: 25000, descuento: 0, recargo: 0, montoFinal: 25000, estado: 'vencida', registradoPor: 'admin' },
  { id: 'c5', alumnoId: 'a5', turnoId: 't2', periodoMes: mesActual, periodoAnio: anioActual, monto: 25000, descuento: 0, recargo: 0, montoFinal: 25000, estado: 'pagada', fechaPago: `${anioActual}-${mesActual.toString().padStart(2, '0')}-10`, metodoPago: 'transferencia', registradoPor: 'admin' },
  { id: 'c6', alumnoId: 'a6', turnoId: 't2', periodoMes: mesActual, periodoAnio: anioActual, monto: 25000, descuento: 0, recargo: 0, montoFinal: 25000, estado: 'pendiente', registradoPor: 'admin' },
  { id: 'c7', alumnoId: 'a7', turnoId: 't3', periodoMes: mesActual, periodoAnio: anioActual, monto: 20000, descuento: 0, recargo: 0, montoFinal: 20000, estado: 'pagada', fechaPago: `${anioActual}-${mesActual.toString().padStart(2, '0')}-03`, metodoPago: 'efectivo', registradoPor: 'admin' },
  { id: 'c8', alumnoId: 'a8', turnoId: 't3', periodoMes: mesActual, periodoAnio: anioActual, monto: 20000, descuento: 0, recargo: 0, montoFinal: 20000, estado: 'pagada', fechaPago: `${anioActual}-${mesActual.toString().padStart(2, '0')}-07`, metodoPago: 'transferencia', registradoPor: 'admin' },
  { id: 'c9', alumnoId: 'a9', turnoId: 't3', periodoMes: mesActual, periodoAnio: anioActual, monto: 20000, descuento: 0, recargo: 0, montoFinal: 20000, estado: 'pagada', fechaPago: `${anioActual}-${mesActual.toString().padStart(2, '0')}-01`, metodoPago: 'mercadopago', registradoPor: 'admin' },
  { id: 'c10', alumnoId: 'a10', turnoId: 't1', periodoMes: mesActual, periodoAnio: anioActual, monto: 25000, descuento: 0, recargo: 0, montoFinal: 25000, estado: 'vencida', registradoPor: 'admin' },
  { id: 'c11', alumnoId: 'a11', turnoId: 't2', periodoMes: mesActual, periodoAnio: anioActual, monto: 25000, descuento: 0, recargo: 0, montoFinal: 25000, estado: 'pagada', fechaPago: `${anioActual}-${mesActual.toString().padStart(2, '0')}-12`, metodoPago: 'efectivo', registradoPor: 'admin' },
  { id: 'c12', alumnoId: 'a12', turnoId: 't3', periodoMes: mesActual, periodoAnio: anioActual, monto: 20000, descuento: 0, recargo: 0, montoFinal: 20000, estado: 'pagada', fechaPago: `${anioActual}-${mesActual.toString().padStart(2, '0')}-09`, metodoPago: 'transferencia', registradoPor: 'admin' },
  { id: 'c13', alumnoId: 'a13', turnoId: 't1', periodoMes: mesActual, periodoAnio: anioActual, monto: 25000, descuento: 0, recargo: 0, montoFinal: 25000, estado: 'pagada', fechaPago: `${anioActual}-${mesActual.toString().padStart(2, '0')}-06`, metodoPago: 'mercadopago', registradoPor: 'admin' },
  { id: 'c14', alumnoId: 'a14', turnoId: 't2', periodoMes: mesActual, periodoAnio: anioActual, monto: 25000, descuento: 0, recargo: 0, montoFinal: 25000, estado: 'pendiente', registradoPor: 'admin' },
  { id: 'c15', alumnoId: 'a15', turnoId: 't3', periodoMes: mesActual, periodoAnio: anioActual, monto: 20000, descuento: 0, recargo: 0, montoFinal: 20000, estado: 'pagada', fechaPago: `${anioActual}-${mesActual.toString().padStart(2, '0')}-11`, metodoPago: 'efectivo', registradoPor: 'admin' },
  { id: 'c16', alumnoId: 'a16', turnoId: 't1', periodoMes: mesActual, periodoAnio: anioActual, monto: 25000, descuento: 0, recargo: 0, montoFinal: 25000, estado: 'vencida', registradoPor: 'admin' },
  { id: 'c17', alumnoId: 'a17', turnoId: 't2', periodoMes: mesActual, periodoAnio: anioActual, monto: 25000, descuento: 0, recargo: 0, montoFinal: 25000, estado: 'pagada', fechaPago: `${anioActual}-${mesActual.toString().padStart(2, '0')}-04`, metodoPago: 'transferencia', registradoPor: 'admin' },
  { id: 'c18', alumnoId: 'a18', turnoId: 't3', periodoMes: mesActual, periodoAnio: anioActual, monto: 20000, descuento: 0, recargo: 0, montoFinal: 20000, estado: 'vencida', registradoPor: 'admin' },
  { id: 'c19', alumnoId: 'a19', turnoId: 't1', periodoMes: mesActual, periodoAnio: anioActual, monto: 25000, descuento: 0, recargo: 0, montoFinal: 25000, estado: 'pagada', fechaPago: `${anioActual}-${mesActual.toString().padStart(2, '0')}-13`, metodoPago: 'mercadopago', registradoPor: 'admin' },
  { id: 'c20', alumnoId: 'a20', turnoId: 't2', periodoMes: mesActual, periodoAnio: anioActual, monto: 25000, descuento: 0, recargo: 0, montoFinal: 25000, estado: 'pagada', fechaPago: `${anioActual}-${mesActual.toString().padStart(2, '0')}-02`, metodoPago: 'efectivo', registradoPor: 'admin' },
];

const fechaHoy = hoy.toISOString().split('T')[0];

export const historialAsistencias: Asistencia[] = [
  { id: 'as1', alumnoId: 'a1', turnoId: 't1', fecha: fechaHoy, presente: true, registradoPor: 'admin' },
  { id: 'as2', alumnoId: 'a2', turnoId: 't1', fecha: fechaHoy, presente: true, registradoPor: 'admin' },
  { id: 'as3', alumnoId: 'a3', turnoId: 't1', fecha: fechaHoy, presente: true, registradoPor: 'admin' },
  { id: 'as4', alumnoId: 'a10', turnoId: 't1', fecha: fechaHoy, presente: false, registradoPor: 'admin' },
  { id: 'as5', alumnoId: 'a13', turnoId: 't1', fecha: fechaHoy, presente: true, registradoPor: 'admin' },
  { id: 'as6', alumnoId: 'a19', turnoId: 't1', fecha: fechaHoy, presente: true, registradoPor: 'admin' },
  { id: 'as7', alumnoId: 'a4', turnoId: 't2', fecha: fechaHoy, presente: true, registradoPor: 'admin' },
  { id: 'as8', alumnoId: 'a5', turnoId: 't2', fecha: fechaHoy, presente: true, registradoPor: 'admin' },
  { id: 'as9', alumnoId: 'a6', turnoId: 't2', fecha: fechaHoy, presente: false, registradoPor: 'admin' },
  { id: 'as10', alumnoId: 'a11', turnoId: 't2', fecha: fechaHoy, presente: true, registradoPor: 'admin' },
  { id: 'as11', alumnoId: 'a14', turnoId: 't2', fecha: fechaHoy, presente: true, registradoPor: 'admin' },
  { id: 'as12', alumnoId: 'a17', turnoId: 't2', fecha: fechaHoy, presente: false, registradoPor: 'admin' },
  { id: 'as13', alumnoId: 'a20', turnoId: 't2', fecha: fechaHoy, presente: true, registradoPor: 'admin' },
  { id: 'as14', alumnoId: 'a7', turnoId: 't3', fecha: fechaHoy, presente: true, registradoPor: 'admin' },
  { id: 'as15', alumnoId: 'a8', turnoId: 't3', fecha: fechaHoy, presente: true, registradoPor: 'admin' },
  { id: 'as16', alumnoId: 'a9', turnoId: 't3', fecha: fechaHoy, presente: true, registradoPor: 'admin' },
  { id: 'as17', alumnoId: 'a12', turnoId: 't3', fecha: fechaHoy, presente: true, registradoPor: 'admin' },
  { id: 'as18', alumnoId: 'a15', turnoId: 't3', fecha: fechaHoy, presente: false, registradoPor: 'admin' },
  { id: 'as19', alumnoId: 'a18', turnoId: 't3', fecha: fechaHoy, presente: true, registradoPor: 'admin' },
];

export const configAcademia: AcademiaConfig = {
  nombre: 'Academia Taekwondo Olimpia',
  direccion: 'Av. San Martín 1234, Córdoba Capital',
  telefono: '351-4567890',
  email: 'contacto@taekwondo-olimpia.com',
  diaVencimiento: 10,
  diasGracia: 5,
  recargoMora: 10,
  descuentoFamiliarPorcentaje: 15,  // 15% de descuento por grupo familiar
  cantidadMinimaGrupoFamiliar: 2,   // Mínimo 2 hermanos para aplicar
  montoDefault: 25000,
};

import type { Liquidacion } from '../types';

export const usuarioActual = {
  id: 'u1',
  email: 'admin@olimpia.com',
  nombre: 'Admin',
  rol: 'administrador' as const,
  activo: true,
};

export const liquidaciones: Liquidacion[] = [
  {
    id: 'l1',
    instructorId: 'i1',
    turnoId: 't1',
    periodoMes: 4,
    periodoAnio: 2026,
    totalRecaudado: 175000,
    porcentaje: 40,
    montoInstructor: 70000,
    estado: 'pagado',
    fechaPago: '2026-05-05',
    aprobadoPor: 'admin',
  },
  {
    id: 'l2',
    instructorId: 'i2',
    turnoId: 't2',
    periodoMes: 4,
    periodoAnio: 2026,
    totalRecaudado: 125000,
    porcentaje: 35,
    montoInstructor: 43750,
    estado: 'pagado',
    fechaPago: '2026-05-06',
    aprobadoPor: 'admin',
  },
  {
    id: 'l3',
    instructorId: 'i3',
    turnoId: 't3',
    periodoMes: 4,
    periodoAnio: 2026,
    totalRecaudado: 100000,
    porcentaje: 38,
    montoInstructor: 38000,
    estado: 'pagado',
    fechaPago: '2026-05-07',
    aprobadoPor: 'admin',
  },
  {
    id: 'l4',
    instructorId: 'i1',
    turnoId: 't1',
    periodoMes: 5,
    periodoAnio: 2026,
    totalRecaudado: 150000,
    porcentaje: 40,
    montoInstructor: 60000,
    estado: 'pendiente',
  },
  {
    id: 'l5',
    instructorId: 'i2',
    turnoId: 't2',
    periodoMes: 5,
    periodoAnio: 2026,
    totalRecaudado: 100000,
    porcentaje: 35,
    montoInstructor: 35000,
    estado: 'pendiente',
  },
  {
    id: 'l6',
    instructorId: 'i3',
    turnoId: 't3',
    periodoMes: 5,
    periodoAnio: 2026,
    totalRecaudado: 80000,
    porcentaje: 38,
    montoInstructor: 30400,
    estado: 'pendiente',
  },
];