import { useState, useMemo } from 'react';
import { DollarSign, Search, X, Check, Download, Filter } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { format, addMonths, subMonths } from 'date-fns';

const formatCurrency = (value: number) => 
  new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(value);

export function Cuotas() {
  const { 
    alumnos, 
    turnos, 
    cuotas,
    config,
    getMontoCuota
  } = useAppStore();

  const hoy = new Date();
  const [selectedMes, setSelectedMes] = useState(hoy.getMonth() + 1);
  const [selectedAnio, setSelectedAnio] = useState(hoy.getFullYear());
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEstado, setFilterEstado] = useState<'todos' | 'pagada' | 'pendiente' | 'vencida'>('todos');
  const [showCobroModal, setShowCobroModal] = useState(false);
  const [selectedAlumno, setSelectedAlumno] = useState<string | null>(null);

  const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

  const cuotasDelPeriodo = useMemo(() => {
    return cuotas.filter(c => c.periodoMes === selectedMes && c.periodoAnio === selectedAnio);
  }, [cuotas, selectedMes, selectedAnio]);

  const filteredAlumnos = useMemo(() => {
    let filtered = alumnos.filter(a => a.activo);
    
    if (searchTerm) {
      filtered = filtered.filter(a => 
        `${a.nombre} ${a.apellido}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.dni.includes(searchTerm)
      );
    }
    
    return filtered;
  }, [alumnos, searchTerm]);

  const getCuotaAlumno = (alumnoId: string) => {
    return cuotasDelPeriodo.find(c => c.alumnoId === alumnoId);
  };

  const handleAbrirCobro = (alumnoId: string) => {
    setSelectedAlumno(alumnoId);
    setShowCobroModal(true);
  };

  // Stats
  const pagadas = cuotasDelPeriodo.filter(c => c.estado === 'pagada').length;
  const pendientes = cuotasDelPeriodo.filter(c => c.estado === 'pendiente').length;
  const vencidas = cuotasDelPeriodo.filter(c => c.estado === 'vencida').length;
  const totalPagado = cuotasDelPeriodo.filter(c => c.estado === 'pagada').reduce((sum, c) => sum + c.montoFinal, 0);
  const totalPendiente = cuotasDelPeriodo.filter(c => c.estado !== 'pagada').reduce((sum, c) => sum + c.montoFinal, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-taekwondo-secondary">Cuotas</h1>
          <p className="text-gray-500">Gestión de cuotas y cobros</p>
        </div>
      </div>

      {/* Selector de Período */}
      <div className="card">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <button
            onClick={() => {
              const prev = subMonths(new Date(selectedAnio, selectedMes - 1), 1);
              setSelectedMes(prev.getMonth() + 1);
              setSelectedAnio(prev.getFullYear());
            }}
            className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50"
          >
            ←
          </button>
          <div className="flex items-center gap-2">
            <select
              value={selectedMes}
              onChange={(e) => setSelectedMes(parseInt(e.target.value))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-taekwondo-primary"
            >
              {meses.map((m, idx) => (
                <option key={idx} value={idx + 1}>{m}</option>
              ))}
            </select>
            <select
              value={selectedAnio}
              onChange={(e) => setSelectedAnio(parseInt(e.target.value))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-taekwondo-primary"
            >
              {[2025, 2026, 2027].map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
          <button
            onClick={() => {
              const next = addMonths(new Date(selectedAnio, selectedMes - 1), 1);
              setSelectedMes(next.getMonth() + 1);
              setSelectedAnio(next.getFullYear());
            }}
            className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50"
          >
            →
          </button>

          <div className="ml-auto flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-500" />
            <select
              value={filterEstado}
              onChange={(e) => setFilterEstado(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-taekwondo-primary"
            >
              <option value="todos">Todos</option>
              <option value="pagada">Pagadas</option>
              <option value="pendiente">Pendientes</option>
              <option value="vencida">Vencidas</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="card bg-green-50 border-l-4 border-green-500">
          <p className="text-sm text-gray-600">Pagadas</p>
          <p className="font-display text-2xl text-green-600">{pagadas}</p>
        </div>
        <div className="card bg-yellow-50 border-l-4 border-yellow-500">
          <p className="text-sm text-gray-600">Pendientes</p>
          <p className="font-display text-2xl text-yellow-600">{pendientes}</p>
        </div>
        <div className="card bg-red-50 border-l-4 border-red-500">
          <p className="text-sm text-gray-600">Vencidas</p>
          <p className="font-display text-2xl text-red-600">{vencidas}</p>
        </div>
        <div className="card bg-green-50 border-l-4 border-green-500">
          <p className="text-sm text-gray-600">Total Cobrado</p>
          <p className="font-display text-xl text-green-600">{formatCurrency(totalPagado)}</p>
        </div>
        <div className="card bg-yellow-50 border-l-4 border-yellow-500">
          <p className="text-sm text-gray-600">Total Pendiente</p>
          <p className="font-display text-xl text-yellow-600">{formatCurrency(totalPendiente)}</p>
        </div>
      </div>

      {/* Buscador */}
      <div className="card">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar alumno por nombre o DNI..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-taekwondo-primary"
          />
        </div>
      </div>

      {/* Lista de Alumnos con Estado de Cuota */}
      <div className="space-y-2">
        {filteredAlumnos.map(alumno => {
          const cuota = getCuotaAlumno(alumno.id);
          const turno = turnos.find(t => t.id === alumno.turnoId);
          const infoCuota = getMontoCuota(alumno.id);
          const monto = cuota?.montoFinal || infoCuota.monto;
          
          let estado: 'pagada' | 'pendiente' | 'vencida' = 'pendiente';
          if (cuota) {
            estado = cuota.estado;
          } else if (selectedMes < hoy.getMonth() + 1 || (selectedMes === hoy.getMonth() + 1 && selectedAnio <= hoy.getFullYear())) {
            // Período pasado sin cuota = vencido
            if (selectedAnio < hoy.getFullYear() || (selectedAnio === hoy.getFullYear() && selectedMes < hoy.getMonth() + 1)) {
              estado = 'vencida';
            }
          }

          if (filterEstado !== 'todos' && estado !== filterEstado) return null;

          return (
            <div key={alumno.id} className="card flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-taekwondo-secondary rounded-full flex items-center justify-center text-white font-bold">
                  {alumno.nombre[0]}{alumno.apellido[0]}
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {alumno.nombre} {alumno.apellido}
                    {alumno.grupoFamiliarId && (
                      <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                        Grupo Familiar
                      </span>
                    )}
                  </p>
                  <p className="text-sm text-gray-500">
                    {turno?.nombre} | DNI: {alumno.dni}
                    {alumno.montoIndividual && (
                      <span className="ml-2 text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                        Monto personalizado
                      </span>
                    )}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="font-display text-lg text-gray-900">{formatCurrency(monto)}</p>
                  {infoCuota.tieneDescuentoFamiliar && (
                    <p className="text-xs text-green-600">
                      Descuento familiar Applied (-{config.descuentoFamiliarPorcentaje}%)
                    </p>
                  )}
                  {!infoCuota.tieneDescuentoFamiliar && infoCuota.montoOriginal !== infoCuota.monto && (
                    <p className="text-xs text-gray-400 line-through">
                      {formatCurrency(infoCuota.montoOriginal)}
                    </p>
                  )}
                  <p className="font-display text-lg text-gray-900">{formatCurrency(monto)}</p>
                  <p className="text-sm text-gray-500">
                    {cuota?.metodoPago && estado === 'pagada' 
                      ? `${cuota.metodoPago} - ${format(new Date(cuota.fechaPago!), 'dd/MM/yyyy')}`
                      : estado === 'vencida' ? `Vencida el ${config.diaVencimiento}` : 'Sin registrar'}
                    </p>
                </div>

                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  estado === 'pagada' 
                    ? 'bg-green-100 text-green-700'
                    : estado === 'vencida'
                    ? 'bg-red-100 text-red-700'
                    : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {estado === 'pagada' ? 'Pagada' : estado === 'vencida' ? 'Vencida' : 'Pendiente'}
                </span>

                {estado !== 'pagada' && (
                  <button
                    onClick={() => handleAbrirCobro(alumno.id)}
                    className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                  >
                    <DollarSign className="w-4 h-4" />
                    Cobrar
                  </button>
                )}

                {estado === 'pagada' && (
                  <button
                    onClick={() => alert('Generando PDF del recibo...')}
                    className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    <Download className="w-4 h-4" />
                    Recibo
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal de Cobro */}
      {showCobroModal && selectedAlumno && (
        <CobroModal
          alumnoId={selectedAlumno}
          mes={selectedMes}
          anio={selectedAnio}
          onClose={() => {
            setShowCobroModal(false);
            setSelectedAlumno(null);
          }}
        />
      )}
    </div>
  );
}

function CobroModal({ 
  alumnoId, 
  mes, 
  anio, 
  onClose 
}: { 
  alumnoId: string; 
  mes: number; 
  anio: number; 
  onClose: () => void;
}) {
  const { 
    alumnos, 
    turnos, 
    addCuota,
    getMontoCuota
  } = useAppStore();

  const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  
  const [mesElegido, setMesElegido] = useState(mes);
  
  const aluno = alumnos.find(a => a.id === alumnoId);
  const turno = turnos.find(t => t.id === aluno?.turnoId);
  const infoCuota = getMontoCuota(alumnoId);
  const precioBase = infoCuota.monto;

  const [monto, setMonto] = useState(precioBase);
  const [descuento, setDescuento] = useState(0);
  const [recargo, setRecargo] = useState(0);
  const [metodoPago, setMetodoPago] = useState<'efectivo' | 'transferencia' | 'mercadopago'>('efectivo');
  const [observaciones, setObservaciones] = useState('');

  const montoFinal = monto - descuento + recargo;

  const handleCobrar = () => {
    const nuevaCuota = {
      id: `cuota_${Date.now()}`,
      alumnoId,
      turnoId: turno?.id || '',
      periodoMes: mesElegido,
      periodoAnio: anio,
      monto,
      descuento,
      recargo,
      montoFinal,
      estado: 'pagada' as const,
      fechaPago: new Date().toISOString().split('T')[0],
      metodoPago,
      registradoPor: 'admin'
    };
    
    addCuota(nuevaCuota);
    alert(`¡Cobro registrado!\n\nRecibo generado:\nAlumno: ${aluno?.nombre} ${aluno?.apellido}\nPeríodo: ${meses[mesElegido-1]} ${anio}\nMonto: ${formatCurrency(montoFinal)}\nMétodo: ${metodoPago}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-lg">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="font-display text-2xl text-taekwondo-secondary">
            Registrar Cobro
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Alumno info */}
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="font-medium text-gray-900">
              {aluno?.nombre} {aluno?.apellido}
            </p>
            <p className="text-sm text-gray-500">
              {turno?.nombre} | DNI: {aluno?.dni}
            </p>
          </div>

          {/* Período */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Período a pagar</label>
            <select
              value={mesElegido}
              onChange={(e) => setMesElegido(parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-taekwondo-primary"
            >
              {meses.map((m, idx) => (
                <option key={idx} value={idx + 1}>{m} {anio}</option>
              ))}
            </select>
          </div>

          {/* Monto */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Monto Base</label>
            <input
              type="number"
              value={monto}
              onChange={(e) => setMonto(parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-taekwondo-primary"
            />
            <p className="text-xs text-gray-500 mt-1">Precio de cuota del turno: {formatCurrency(precioBase)}</p>
          </div>

          {/* Descuento y Recargo */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Descuento</label>
              <input
                type="number"
                value={descuento}
                onChange={(e) => setDescuento(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-taekwondo-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Recargo</label>
              <input
                type="number"
                value={recargo}
                onChange={(e) => setRecargo(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-taekwondo-primary"
              />
            </div>
          </div>

          {/* Método de pago */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Método de Pago</label>
            <div className="flex gap-2">
              {(['efectivo', 'transferencia', 'mercadopago'] as const).map(m => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMetodoPago(m)}
                  className={`flex-1 px-3 py-2 rounded-lg border ${
                    metodoPago === m 
                      ? 'bg-taekwondo-primary text-white border-taekwondo-primary'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {m === 'efectivo' ? 'Efectivo' : m === 'transferencia' ? 'Transferencia' : 'MercadoPago'}
                </button>
              ))}
            </div>
          </div>

          {/* Observaciones */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Observaciones (opcional)</label>
            <textarea
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-taekwondo-primary"
              placeholder="Notas adicionales..."
            />
          </div>

          {/* Total */}
          <div className="bg-taekwondo-secondary text-white rounded-lg p-4">
            <div className="flex items-center justify-between">
              <p className="text-lg">Total a Cobrar</p>
              <p className="font-display text-3xl">{formatCurrency(montoFinal)}</p>
            </div>
          </div>

          {/* Botones */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              onClick={handleCobrar}
              className="flex-1 btn-primary flex items-center justify-center gap-2"
            >
              <Check className="w-5 h-5" />
              Confirmar Cobro
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}