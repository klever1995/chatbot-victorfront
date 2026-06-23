import axios from 'axios';

// Configuración base de la API desde variables de entorno
const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.1.145:8005/api/v1';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true',
  },
});

// ==================== TIPOS ====================
export interface Carpeta {
  id: number;
  nombre: string;
  descripcion?: string;
  activa: boolean;
  padre_id?: number;
  usuario_id: number;
  fecha_creacion: string;
  fecha_actualizacion?: string;
  documentos_count?: number;
  subcarpetas_count?: number;
  subcarpetas?: Carpeta[];
  documentos?: DocumentoSimple[];
}

export interface DocumentoSimple {
  id: number;
  nombre: string;
  activo: boolean;
  extension?: string;
  tamano_bytes?: number;
}

export interface CarpetaTree {
  id: number;
  nombre: string;
  descripcion?: string;
  activa: boolean;
  subcarpetas: CarpetaTree[];
  documentos: DocumentoSimple[];
}

// ==================== FUNCIONES ====================

/**
 * Crea una nueva carpeta (solo admin)
 * @param token - Token de acceso JWT (debe ser admin)
 * @param data - Datos de la carpeta (nombre, descripcion, padre_id)
 * @returns Carpeta creada
 */
export const crearCarpeta = async (token: string, data: {
  nombre: string;
  descripcion?: string;
  activa?: boolean;
  padre_id?: number | null;  // 👈 ACEPTA NULL
}) => {
  // Si padre_id es null, lo eliminamos del objeto para que no se envíe
  const cleanData: any = { nombre: data.nombre };
  if (data.descripcion !== undefined) cleanData.descripcion = data.descripcion;
  if (data.activa !== undefined) cleanData.activa = data.activa;
  if (data.padre_id !== undefined && data.padre_id !== null) {
    cleanData.padre_id = data.padre_id;
  }

  const response = await api.post('/carpetas/', cleanData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

/**
 * Lista carpetas con filtros
 * @param token - Token de acceso JWT
 * @param params - Filtros (skip, limit, padre_id, solo_activas)
 * @returns Lista de carpetas
 */
export const listarCarpetas = async (
  token: string,
  params: {
    skip?: number;
    limit?: number;
    padre_id?: number;
    solo_activas?: boolean;
  } = {}
) => {
  const queryParams = new URLSearchParams();
  if (params.skip) queryParams.append('skip', params.skip.toString());
  if (params.limit) queryParams.append('limit', params.limit.toString());
  if (params.padre_id !== undefined) queryParams.append('padre_id', params.padre_id.toString());
  if (params.solo_activas) queryParams.append('solo_activas', 'true');

  const response = await api.get(`/carpetas/?${queryParams.toString()}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

/**
 * Obtiene una carpeta por su ID con sus subcarpetas y documentos
 * @param token - Token de acceso JWT
 * @param carpetaId - ID de la carpeta
 * @returns Carpeta con subcarpetas y documentos
 */
export const obtenerCarpeta = async (token: string, carpetaId: number) => {
  const response = await api.get(`/carpetas/${carpetaId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

/**
 * Obtiene el árbol completo de carpetas (estructura jerárquica)
 * @param token - Token de acceso JWT
 * @returns Árbol de carpetas
 */
export const obtenerArbolCarpetas = async (token: string) => {
  const response = await api.get('/carpetas/arbol', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

/**
 * Actualiza una carpeta (solo admin)
 * @param token - Token de acceso JWT (debe ser admin)
 * @param carpetaId - ID de la carpeta
 * @param data - Datos a actualizar (nombre, descripcion, activa, padre_id)
 * @returns Carpeta actualizada
 */
export const actualizarCarpeta = async (token: string, carpetaId: number, data: {
  nombre?: string;
  descripcion?: string;
  activa?: boolean;
  padre_id?: number;
}) => {
  const response = await api.put(`/carpetas/${carpetaId}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

/**
 * Elimina una carpeta (solo si está vacía) - solo admin
 * @param token - Token de acceso JWT (debe ser admin)
 * @param carpetaId - ID de la carpeta
 */
export const eliminarCarpeta = async (token: string, carpetaId: number) => {
  const response = await api.delete(`/carpetas/${carpetaId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

/**
 * Mueve documentos a una carpeta (solo admin)
 * @param token - Token de acceso JWT (debe ser admin)
 * @param carpetaId - ID de la carpeta destino
 * @param documentoIds - Lista de IDs de documentos a mover
 * @returns Mensaje de confirmación
 */
export const moverDocumentosACarpeta = async (
  token: string,
  carpetaId: number,
  documentoIds: number[]
) => {
  const response = await api.post(
    `/carpetas/${carpetaId}/mover-documentos`,
    documentoIds,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );
  return response.data;
};

export default {
  crearCarpeta,
  listarCarpetas,
  obtenerCarpeta,
  obtenerArbolCarpetas,
  actualizarCarpeta,
  eliminarCarpeta,
  moverDocumentosACarpeta,
};