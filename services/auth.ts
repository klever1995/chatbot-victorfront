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

// ==================== AUTENTICACIÓN ====================

/**
 * Inicia sesión con email y contraseña
 * @param email - Correo del usuario
 * @param password - Contraseña del usuario
 * @returns { access_token, token_type }
 */
export const login = async (email: string, password: string) => {
  const formData = new FormData();
  formData.append('username', email);
  formData.append('password', password);

  const response = await api.post('/auth/login', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      'ngrok-skip-browser-warning': 'true',
    },
  });

  return response.data;
};

/**
 * Registra un nuevo usuario
 * @param userData - Datos del usuario (email, nombre, password, empresa_id)
 * @returns Usuario registrado
 */
export const registro = async (userData: {
  email: string;
  nombre: string;
  password: string;
  empresa_id: number;
}) => {
  const response = await api.post('/usuarios/registro', userData);
  return response.data;
};

/**
 * Verifica el email del usuario con el token
 * @param token - Token de verificación recibido por correo
 * @returns Mensaje de confirmación
 */
export const verificarEmail = async (token: string) => {
  const response = await api.get(`/usuarios/verificar-email?token=${token}`);
  return response.data;
};

/**
 * Obtiene el perfil del usuario autenticado
 * @param token - Token de acceso JWT
 * @returns Datos del usuario
 */
export const obtenerPerfil = async (token: string) => {
  const response = await api.get('/usuarios/me', {
    headers: {
      Authorization: `Bearer ${token}`,
      'ngrok-skip-browser-warning': 'true',
    },
  });
  return response.data;
};

/**
 * Actualiza el perfil del usuario autenticado
 * @param token - Token de acceso JWT
 * @param data - Datos a actualizar (nombre, email, password, etc.)
 * @returns Usuario actualizado
 */
export const actualizarPerfil = async (token: string, data: any) => {
  const response = await api.put('/usuarios/me', data, {
    headers: {
      Authorization: `Bearer ${token}`,
      'ngrok-skip-browser-warning': 'true',
    },
  });
  return response.data;
};

/**
 * Elimina la cuenta del usuario autenticado
 * @param token - Token de acceso JWT
 */
export const eliminarCuenta = async (token: string) => {
  const response = await api.delete('/usuarios/me', {
    headers: {
      Authorization: `Bearer ${token}`,
      'ngrok-skip-browser-warning': 'true',
    },
  });
  return response.data;
};

export default {
  login,
  registro,
  verificarEmail,
  obtenerPerfil,
  actualizarPerfil,
  eliminarCuenta,
};