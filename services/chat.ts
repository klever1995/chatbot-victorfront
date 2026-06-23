import axios from 'axios';
import * as DocumentPicker from 'expo-document-picker';

// ==================== CONFIGURACIÓN DE AXIOS CON TIMEOUT ====================
const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.1.145:8005/api/v1';

// 🔥 Instancia de Axios con timeout de 30 segundos y reintentos
const api = axios.create({
  baseURL: API_URL,
  timeout: 30000, // 30 segundos para evitar Network Error
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true',
  },
});

// 🔥 Interceptor para reintentar peticiones fallidas por timeout
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;
    // Si es un error de timeout o red, y no se ha reintentado más de 2 veces
    if ((error.code === 'ECONNABORTED' || error.message === 'Network Error') && !config._retry) {
      config._retry = true;
      try {
        console.log('🔄 Reintentando petición por timeout...');
        return await api.request(config);
      } catch (retryError) {
        return Promise.reject(retryError);
      }
    }
    return Promise.reject(error);
  }
);

// ==================== TIPOS ====================
export interface ChatResponse {
  respuesta: string;
  fuentes: string[];
  chunks: Array<{
    chunk_id: number;
    texto: string;
    indice: number;
    documento_id: number;
    documento_nombre: string;
    similitud: number;
  }>;
  transcripcion?: string;
}

export interface ChatRequest {
  pregunta: string;
  documento_ids?: number[];
  top_k?: number;
}

// ==================== FUNCIONES ====================

/**
 * Consulta al bot usando texto (RAG)
 */
export const consultar = async (
  token: string,
  pregunta: string,
  documento_ids?: number[],
  top_k: number = 3
): Promise<ChatResponse> => {
  const response = await api.post(
    '/chat/consultar',
    {
      pregunta,
      documento_ids,
      top_k,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

/**
 * Consulta al bot usando un archivo de audio seleccionado con DocumentPicker
 */
export const consultarAudio = async (
  token: string,
  archivo: DocumentPicker.DocumentPickerAsset,
  documento_ids?: number[],
  top_k: number = 3
): Promise<ChatResponse> => {
  const formData = new FormData();
  
  formData.append('archivo', {
    uri: archivo.uri,
    name: archivo.name || 'audio.m4a',
    type: archivo.mimeType || 'audio/mp4',
  } as any);

  if (documento_ids && documento_ids.length > 0) {
    formData.append('documento_ids', documento_ids.join(','));
  }
  
  formData.append('top_k', top_k.toString());

  const response = await api.post('/chat/consultar-audio', formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
    timeout: 30000, // Timeout específico para esta petición
  });
  return response.data;
};

/**
 * Consulta al bot usando un archivo de audio desde URI (para grabaciones en tiempo real)
 */
export const consultarAudioDesdeURI = async (
  token: string,
  audioUri: string,
  documento_ids?: number[],
  top_k: number = 3
): Promise<ChatResponse> => {
  try {
    const fileName = audioUri.split('/').pop() || 'audio.m4a';
    const mimeType = fileName.endsWith('.mp3') ? 'audio/mpeg' :
                     fileName.endsWith('.wav') ? 'audio/wav' :
                     fileName.endsWith('.m4a') ? 'audio/mp4' :
                     'audio/mp4';

    const formData = new FormData();
    formData.append('archivo', {
      uri: audioUri,
      name: fileName,
      type: mimeType,
    } as any);

    if (documento_ids && documento_ids.length > 0) {
      formData.append('documento_ids', documento_ids.join(','));
    }
    
    formData.append('top_k', top_k.toString());

    const response = await api.post('/chat/consultar-audio', formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
      timeout: 30000, // Timeout específico para esta petición
    });
    return response.data;
  } catch (error) {
    console.error('❌ Error al enviar audio:', error);
    throw error;
  }
};

export default {
  consultar,
  consultarAudio,
  consultarAudioDesdeURI,
};