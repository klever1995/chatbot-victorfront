import axios from 'axios';
import * as DocumentPicker from 'expo-document-picker';

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
export interface Documento {
  id: number;
  nombre: string;
  nombre_almacenado: string;
  ruta: string;
  tamano_bytes?: number;
  tipo_mime?: string;
  extension?: string;
  activo: boolean;
  carpeta_id?: number;
  usuario_id: number;
  fecha_subida: string;
  fecha_actualizacion?: string;
  ultimo_acceso?: string;
}

export interface DocumentoListResponse {
  id: number;
  nombre: string;
  activo: boolean;
  carpeta_id?: number;
  fecha_subida: string;
  tamano_bytes?: number;
  tipo_mime?: string;
  extension?: string;
}

// ==================== FUNCIONES ====================

/**
 * Sube un nuevo documento (solo admin)
 * @param token - Token de acceso JWT (debe ser admin)
 * @param archivo - Archivo a subir (de expo-document-picker)
 * @param carpeta_id - ID de la carpeta donde guardar (opcional)
 * @returns Documento creado
 */
export const subirDocumento = async (
  token: string,
  archivo: DocumentPicker.DocumentPickerAsset,
  carpeta_id?: number
) => {
  const formData = new FormData();
  
  // @ts-ignore - Expo DocumentPicker devuelve un objeto con uri, name, mimeType
  formData.append('archivo', {
    uri: archivo.uri,
    name: archivo.name,
    type: archivo.mimeType || 'application/octet-stream',
  } as any);

  if (carpeta_id) {
    formData.append('carpeta_id', carpeta_id.toString());
  }

  const response = await api.post('/documentos/subir', formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

/**
 * Lista documentos con filtros
 * @param token - Token de acceso JWT
 * @param params - Filtros (skip, limit, carpeta_id, solo_activos)
 * @returns Lista de documentos
 */
export const listarDocumentos = async (
  token: string,
  params: {
    skip?: number;
    limit?: number;
    carpeta_id?: number;
    solo_activos?: boolean;
  } = {}
) => {
  const queryParams = new URLSearchParams();
  if (params.skip) queryParams.append('skip', params.skip.toString());
  if (params.limit) queryParams.append('limit', params.limit.toString());
  if (params.carpeta_id !== undefined) queryParams.append('carpeta_id', params.carpeta_id.toString());
  if (params.solo_activos) queryParams.append('solo_activos', 'true');

  const response = await api.get(`/documentos/?${queryParams.toString()}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

/**
 * Obtiene un documento por su ID
 * @param token - Token de acceso JWT
 * @param documentoId - ID del documento
 * @returns Documento completo
 */
export const obtenerDocumento = async (token: string, documentoId: number) => {
  const response = await api.get(`/documentos/${documentoId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

/**
 * Actualiza un documento (solo admin)
 * @param token - Token de acceso JWT (debe ser admin)
 * @param documentoId - ID del documento
 * @param data - Datos a actualizar (nombre, activo, carpeta_id)
 * @returns Documento actualizado
 */
export const actualizarDocumento = async (
  token: string,
  documentoId: number,
  data: {
    nombre?: string;
    activo?: boolean;
    carpeta_id?: number;
  }
) => {
  const response = await api.put(`/documentos/${documentoId}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

/**
 * Activa o desactiva un documento (solo admin)
 * @param token - Token de acceso JWT (debe ser admin)
 * @param documentoId - ID del documento
 * @param activo - true para activar, false para desactivar
 * @returns Documento actualizado
 */
export const toggleActivoDocumento = async (
  token: string,
  documentoId: number,
  activo: boolean
) => {
  const response = await api.patch(
    `/documentos/${documentoId}/toggle-activo`,
    { activo },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

/**
 * Elimina un documento (solo admin)
 * @param token - Token de acceso JWT (debe ser admin)
 * @param documentoId - ID del documento
 */
export const eliminarDocumento = async (token: string, documentoId: number) => {
  const response = await api.delete(`/documentos/${documentoId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

/**
 * Cuenta los chunks de un documento
 * @param token - Token de acceso JWT
 * @param documentoId - ID del documento
 * @returns Número de chunks
 */
export const contarChunks = async (token: string, documentoId: number) => {
  const response = await api.get(`/documentos/${documentoId}/chunks-count`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

/**
 * Reprocesa un documento (rehace chunks y embeddings) - solo admin
 * @param token - Token de acceso JWT (debe ser admin)
 * @param documentoId - ID del documento
 * @returns Documento reprocesado
 */
export const reprocesarDocumento = async (token: string, documentoId: number) => {
  const response = await api.post(
    `/documentos/${documentoId}/reprocesar`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export default {
  subirDocumento,
  listarDocumentos,
  obtenerDocumento,
  actualizarDocumento,
  toggleActivoDocumento,
  eliminarDocumento,
  contarChunks,
  reprocesarDocumento,
};