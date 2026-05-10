-- Eliminar tablas existentes si existen
DROP TABLE IF EXISTS liquidaciones CASCADE;
DROP TABLE IF EXISTS cuotas CASCADE;
DROP TABLE IF EXISTS asistimecias CASCADE;
DROP TABLE IF EXISTS alumnos CASCADE;
DROP TABLE IF EXISTS instructores CASCADE;
DROP TABLE IF EXISTS turnos CASCADE;
DROP TABLE IF EXISTS grados CASCADE;
DROP TABLE IF EXISTS notificaciones CASCADE;

-- GRADOS (cintas)
CREATE TABLE grados (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre TEXT NOT NULL,
  color_hex TEXT NOT NULL,
  orden INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- TURNOS
CREATE TABLE turnos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre TEXT NOT NULL,
  dias_semana TEXT[] NOT NULL,
  hora_inicio TIME NOT NULL,
  hora_fin TIME NOT NULL,
  precio_cuota INTEGER NOT NULL,
  capacidad_max INTEGER NOT NULL,
  activo BOOLEAN DEFAULT true,
  instructor_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- INSTRUCTORES
CREATE TABLE instructores (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre TEXT NOT NULL,
  apellido TEXT NOT NULL,
  dni TEXT UNIQUE NOT NULL,
  cuil TEXT,
  telefono TEXT NOT NULL,
  email TEXT NOT NULL,
  fecha_nacimiento DATE,
  turno_id UUID,
  porcentaje_cobro INTEGER DEFAULT 40,
  cbu_alias TEXT,
  activo BOOLEAN DEFAULT true,
  foto_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ALUMNOS
CREATE TABLE alumnos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre TEXT NOT NULL,
  apellido TEXT NOT NULL,
  dni TEXT UNIQUE NOT NULL,
  telefono TEXT NOT NULL,
  email TEXT NOT NULL,
  fecha_nacimiento DATE NOT NULL,
  turno_id UUID,
  grado_id UUID,
  fecha_inicio DATE NOT NULL,
  contacto_emergencia_nombre TEXT NOT NULL,
  contacto_emergencia_telefono TEXT NOT NULL,
  activo BOOLEAN DEFAULT true,
  foto_url TEXT,
  observaciones TEXT,
  monto_individual INTEGER,
  grupo_familiar_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ASISTENCIAS
CREATE TABLE asistimecias (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  alumno_id UUID NOT NULL,
  turno_id UUID NOT NULL,
  fecha DATE NOT NULL,
  presente BOOLEAN DEFAULT true,
  registrado_por TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(alumno_id, turno_id, fecha)
);

-- CUOTAS
CREATE TABLE cuotas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  alumno_id UUID NOT NULL,
  turno_id UUID NOT NULL,
  periodo_mes INTEGER NOT NULL,
  periodo_anio INTEGER NOT NULL,
  monto INTEGER NOT NULL,
  descuento INTEGER DEFAULT 0,
  recargo INTEGER DEFAULT 0,
  monto_final INTEGER NOT NULL,
  estado TEXT CHECK (estado IN ('pagada', 'pendiente', 'vencida')) DEFAULT 'pendiente',
  fecha_pago DATE,
  metodo_pago TEXT,
  comprobante_url TEXT,
  registrado_por TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(alumno_id, periodo_mes, periodo_anio)
);

-- LIQUIDACIONES
CREATE TABLE liquidaciones (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  instructor_id UUID NOT NULL,
  turno_id UUID NOT NULL,
  periodo_mes INTEGER NOT NULL,
  periodo_anio INTEGER NOT NULL,
  total_recaudado INTEGER NOT NULL,
  porcentaje INTEGER NOT NULL,
  monto_instructor INTEGER NOT NULL,
  estado TEXT CHECK (estado IN ('pendiente', 'pagado')) DEFAULT 'pendiente',
  fecha_pago DATE,
  aprobado_por TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- NOTIFICACIONES
CREATE TABLE notificaciones (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tipo TEXT NOT NULL,
  titulo TEXT NOT NULL,
  mensaje TEXT NOT NULL,
  leida BOOLEAN DEFAULT false,
  fecha DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_alumnos_turno ON alumnos(turno_id);
CREATE INDEX idx_alumnos_activo ON alumnos(activo);
CREATE INDEX idx_cuotas_alumno ON cuotas(alumno_id);
CREATE INDEX idx_cuotas_periodo ON cuotas(periodo_mes, periodo_anio);
CREATE INDEX idx_asistencias_fecha ON asistimecias(fecha);
CREATE INDEX idx_asistencias_alumno ON asistimecias(alumno_id);