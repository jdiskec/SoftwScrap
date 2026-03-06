import { useState } from "react";

// ==========================================
// Tipos y Modelos de Datos
// ==========================================

/** 
 * Estructura de un Cliente para facturación. 
 */
export type Cliente = {
  identificacion: string; // Cédula o RUC
  tipoIdentificacion: string; // "cedula" | "ruc"
  razonSocial: string; // Nombre completo o razón social
  direccion: string;
  telefono: string;
  email: string;
};

/** 
 * Estructura de una Factura completa.
 */
export type Factura = {
  secuencial: string; // Formato 000-000-000000000
  fecha: string;
  cliente: Cliente;
  detalles: DetalleFactura[];
  subtotal: number;
  totalDescuento: number;
  baseImponible: number;
  valorIVA: number;
  ivaRate: number; // Tasa aplicada (ej: 0.15)
  total: number;
};

/** 
 * Representa una línea individual dentro de una factura.
 */
export type DetalleFactura = {
  id: string;
  descripcion: string;
  cantidad: number | string;
  precioUnitario: number | string;
  descuento: number | string;
  codigo?: string; // Código de inventario (opcional)
};

/**
 * Representa un Anticipo (Crédito/Deuda) otorgado a un cliente.
 */
export type Anticipo = {
  id: string;
  secuencial: string; // Número correlativo para seguimiento
  clienteId: string; // Identificación del cliente
  fecha: string;
  descripcion: string;
  montoTotal: number;
  saldoPendiente: number;
  pagos: PagoAnticipo[];
  estado: "pendiente" | "parcial" | "pagado";
};

/**
 * Representa un pago individual realizado hacia un anticipo.
 */
export type PagoAnticipo = {
  id: string;
  fecha: string;
  monto: number;
  metodoPago: "efectivo" | "transferencia" | "cheque" | "otro";
  referencia?: string;
};

/** Tasa de IVA vigente en Ecuador (Marzo 2024+) */
export const IVA_RATE = 0.15;

// ==========================================
// Funciones de Validación (Lógica Pura)
// ==========================================

/**
 * Valida una Cédula de Identidad Ecuatoriana mediante el algoritmo de Módulo 10.
 * @param cedula String de 10 dígitos.
 * @returns true si el dígito verificador es correcto.
 */
export function validarCedula(cedula: string): boolean {
  if (cedula.length !== 10) return false;
  const digits = cedula.split("").map(Number);
  const provincia = Number(cedula.substring(0, 2));
  const tercerDigito = digits[2];

  // Reglas de provincia (01 a 24) y tercer dígito (< 6 para personas naturales)
  if (provincia < 1 || provincia > 24) return false;
  if (tercerDigito >= 6) return false;

  const coeficientes = [2, 1, 2, 1, 2, 1, 2, 1, 2];
  let suma = 0;

  for (let i = 0; i < 9; i++) {
    let valor = digits[i] * coeficientes[i];
    if (valor >= 10) valor -= 9;
    suma += valor;
  }

  const digitoVerificador = (Math.ceil(suma / 10) * 10) - suma;
  const verificadorCalculado = digitoVerificador === 10 ? 0 : digitoVerificador;

  return verificadorCalculado === digits[9];
}

/**
 * Valida un RUC Ecuatoriano (Persona Natural, Jurídica o Pública).
 * @param ruc String de 13 dígitos.
 * @returns true si cumple con la estructura básica y verificadores.
 */
export function validarRUC(ruc: string): boolean {
  if (ruc.length !== 13) return false;
  const provincia = Number(ruc.substring(0, 2));
  const tercerDigito = Number(ruc[2]);

  if (provincia < 1 || provincia > 24) return false;

  // RUC Persona Natural (mismo algoritmo que cédula terminando en 001)
  if (tercerDigito < 6) {
    return validarCedula(ruc.substring(0, 10)) && ruc.substring(10) === "001";
  }

  // Nota: Para Sociedades Privadas y Públicas se requieren algoritmos Módulo 11 (Pendiente implementación profunda)
  return ruc.endsWith("001");
}

// ==========================================
// Gestión de Persistencia (LocalStorage)
// ==========================================

const CLIENTES_KEY = "facturacion_clientes";
const FACTURAS_KEY = "facturacion_facturas";
const ANTICIPOS_KEY = "facturacion_anticipos";

/** 
 * Recupera la lista completa de clientes almacenados.
 */
export function getClientes(): Cliente[] {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(CLIENTES_KEY);
  return stored ? JSON.parse(stored) : [];
}

/** 
 * Guarda un cliente nuevo o actualiza uno existente por identificación.
 */
export function saveCliente(cliente: Cliente) {
  const clientes = getClientes();
  const index = clientes.findIndex(c => c.identificacion === cliente.identificacion);

  if (index >= 0) {
    clientes[index] = cliente;
  } else {
    clientes.push(cliente);
  }

  localStorage.setItem(CLIENTES_KEY, JSON.stringify(clientes));
}

/** 
 * Obtiene un cliente específico por su número de identificación.
 */
export function getClienteById(identificacion: string): Cliente | undefined {
  const clientes = getClientes();
  return clientes.find(c => c.identificacion === identificacion);
}

/** 
 * Recupera el historial completo de facturas emitidas.
 */
export function getFacturas(): Factura[] {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(FACTURAS_KEY);
  return stored ? JSON.parse(stored) : [];
}

/** 
 * Registra una nueva factura en el historial local.
 */
export function saveFactura(factura: Factura) {
  const facturas = getFacturas();
  facturas.push(factura);
  localStorage.setItem(FACTURAS_KEY, JSON.stringify(facturas));
}

/**
 * Recupera la lista completa de anticipos.
 */
export function getAnticipos(): Anticipo[] {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(ANTICIPOS_KEY);
  return stored ? JSON.parse(stored) : [];
}

/**
 * Guarda o actualiza un anticipo.
 */
export function saveAnticipo(anticipo: Anticipo) {
  const anticipos = getAnticipos();
  const index = anticipos.findIndex(a => a.id === anticipo.id);

  if (index >= 0) {
    anticipos[index] = anticipo;
  } else {
    anticipos.push(anticipo);
  }

  localStorage.setItem(ANTICIPOS_KEY, JSON.stringify(anticipos));
}

/**
 * Genera el siguiente número secuencial para un anticipo.
 */
export function getNextAnticipoSecuencial(): string {
  const anticipos = getAnticipos();
  if (anticipos.length === 0) return "ANT-000001";

  // Extraer números y encontrar el máximo
  const numeros = anticipos.map(a => {
    const match = a.secuencial.match(/\d+/);
    return match ? parseInt(match[0]) : 0;
  });

  const max = Math.max(...numeros);
  return `ANT-${String(max + 1).padStart(6, '0')}`;
}

/**
 * Registra un pago en un anticipo existente.
 */
export function registrarPagoAnticipo(anticipoId: string, pago: PagoAnticipo) {
  const anticipos = getAnticipos();
  const index = anticipos.findIndex(a => a.id === anticipoId);

  if (index >= 0) {
    const a = anticipos[index];
    a.pagos.push(pago);

    const totalPagado = a.pagos.reduce((acc, p) => acc + p.monto, 0);
    a.saldoPendiente = Number((a.montoTotal - totalPagado).toFixed(2));

    if (a.saldoPendiente <= 0) {
      a.estado = "pagado";
      a.saldoPendiente = 0;
    } else {
      a.estado = "parcial";
    }

    anticipos[index] = a;
    localStorage.setItem(ANTICIPOS_KEY, JSON.stringify(anticipos));
    return true;
  }
  return false;
}

// ==========================================
// Hook de Lógica de Negocio: Facturación
// ==========================================

/**
 * Hook central para la gestión del estado y cálculos de la pantalla de Facturación.
 * Proporciona reactividad para cálculos de impuestos y validaciones de cliente.
 */
export function useCrearFactura() {
  // Estado básico
  const [fecha, setFecha] = useState(new Date().toISOString().split("T")[0]);
  const [secuencial, setSecuencial] = useState("001-001-000000001");

  // Datos del Cliente Seleccionado/Editado
  const [cliente, setCliente] = useState<Cliente>({
    identificacion: "",
    tipoIdentificacion: "cedula",
    razonSocial: "",
    direccion: "",
    telefono: "",
    email: "",
  });

  // Estado de errores de validación (UI)
  const [errores, setErrores] = useState<Record<string, string>>({});

  // Lista de items de la factura
  const [detalles, setDetalles] = useState<DetalleFactura[]>([
    { id: "1", descripcion: "", cantidad: "", precioUnitario: "", descuento: "" },
  ]);

  // Tasa de IVA dinámica (Default 15% o valor legal vigente)
  const [ivaRate, setIvaRate] = useState(IVA_RATE);

  // --- Cálculos Dinámicos de Totales ---

  // Suma de (cantidad * precio) antes de impuestos
  const subtotal = Number(detalles.reduce((acc, item) => acc + (Number(item.cantidad || 0) * Number(item.precioUnitario || 0)), 0).toFixed(2));

  // Suma de descuentos aplicados por item
  const totalDescuento = Number(detalles.reduce((acc, item) => acc + Number(item.descuento || 0), 0).toFixed(2));

  // Valor sobre el cual se calcula el IVA
  const baseImponible = Number((subtotal - totalDescuento).toFixed(2));

  // Impuesto calculado usando la tasa dinámica
  const valorIVA = Number((baseImponible * ivaRate).toFixed(2));

  // Gran Total a pagar
  const total = Number((baseImponible + valorIVA).toFixed(2));

  /**
   * Actualiza datos del cliente y dispara autocompletado si existe en BD local.
   */
  const handleClienteChange = (field: keyof Cliente, value: string) => {
    setCliente((prev) => {
      const next = { ...prev, [field]: value };

      // Búsqueda automática al completar identificación
      if (field === "identificacion" && value.length >= 10) {
        const clienteExistente = getClienteById(value);
        if (clienteExistente) {
          return {
            ...next,
            razonSocial: clienteExistente.razonSocial,
            direccion: clienteExistente.direccion,
            telefono: clienteExistente.telefono,
            email: clienteExistente.email,
            tipoIdentificacion: clienteExistente.tipoIdentificacion
          };
        }
      }
      return next;
    });

    // Validación según tipo de documento
    if (field === "identificacion") {
      setErrores((prev) => {
        const nextErrores = { ...prev };
        if (cliente.tipoIdentificacion === "cedula" && !validarCedula(value) && value.length === 10) {
          nextErrores.identificacion = "Cédula inválida";
          return nextErrores;
        }
        if (cliente.tipoIdentificacion === "ruc" && !validarRUC(value) && value.length === 13) {
          nextErrores.identificacion = "RUC inválido";
          return nextErrores;
        }
        delete nextErrores.identificacion;
        return nextErrores;
      });
    }
  };

  /** Agrega una fila vacía a los detalles */
  const addDetalle = () => {
    setDetalles([
      ...detalles,
      { id: crypto.randomUUID(), descripcion: "", cantidad: "", precioUnitario: "", descuento: "" },
    ]);
  };

  /** Agrega un producto directamente buscando si hay filas vacías o creando una nueva */
  const addDetalleConProducto = (descripcion: string, precio: number, codigo: string) => {
    setDetalles((prev) => {
      const last = prev[prev.length - 1];
      const isLastEmpty = !last?.descripcion && (!last?.precioUnitario || Number(last?.precioUnitario) === 0);

      if (isLastEmpty && last) {
        return prev.map((d) => d.id === last.id ? { ...d, descripcion, precioUnitario: precio, codigo, cantidad: 1, descuento: 0 } : d);
      }

      return [
        ...prev,
        { id: crypto.randomUUID(), descripcion, cantidad: 1, precioUnitario: precio, descuento: 0, codigo }
      ];
    });
  };

  /** Elimina un item específico */
  const removeDetalle = (id: string) => {
    if (detalles.length > 1) {
      setDetalles(detalles.filter((d) => d.id !== id));
    }
  };

  /** Actualiza valores numéricos o descriptivos de un item */
  const updateDetalle = (id: string, field: keyof DetalleFactura, value: string | number) => {
    setDetalles(
      detalles.map((d) => (d.id === id ? { ...d, [field]: value } : d))
    );
  };

  /**
   * Consolida y guarda la factura y el cliente en la persistencia local.
   */
  const guardarFactura = () => {
    if (!cliente.identificacion || !cliente.razonSocial) {
      alert("Por favor complete los datos del cliente");
      return;
    }

    saveCliente(cliente);

    const nuevaFactura: Factura = {
      secuencial,
      fecha,
      cliente,
      detalles,
      subtotal,
      totalDescuento,
      baseImponible,
      valorIVA,
      ivaRate,
      total
    };
    saveFactura(nuevaFactura);

    alert("Factura guardada correctamente");
  };

  return {
    fecha, setFecha,
    secuencial, setSecuencial,
    cliente, setCliente,
    errores,
    detalles,
    subtotal,
    totalDescuento,
    baseImponible,
    valorIVA,
    ivaRate,
    setIvaRate,
    total,
    handleClienteChange,
    addDetalle,
    addDetalleConProducto,
    removeDetalle,
    updateDetalle,
    guardarFactura
  };
}
