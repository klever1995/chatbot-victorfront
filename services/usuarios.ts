import axios from 'axios';

// Configuración base de la API desde variables de entorno
const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.1.145:8005/api/v1';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true', // Necesario para ngrok gratuito
  },
});

// ==================== USUARIOS ====================

/**
 * Registra un nuevo usuario (público)
 * @param userData - Datos del usuario (email, nombre, password, empresa_id)
 * @returns Usuario registrado (inactivo hasta verificar email)
 */
export const registrarUsuario = async (userData: {
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
export const actualizarPerfil = async (token: string, data: {
  nombre?: string;
  email?: string;
  password?: string;
  foto_url?: string;
}) => {
  const response = await api.put('/usuarios/me', data, {
    headers: {
      Authorization: `Bearer ${token}`,
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
    },
  });
  return response.data;
};

// ==================== ENDPOINTS ADMIN ====================

/**
 * Lista todos los usuarios (solo admin)
 * @param token - Token de acceso JWT (debe ser admin)
 * @param skip - Número de registros a saltar (paginación)
 * @param limit - Límite de registros
 * @returns Lista de usuarios
 */
export const listarUsuarios = async (token: string, skip: number = 0, limit: number = 100) => {
  const response = await api.get(`/usuarios/?skip=${skip}&limit=${limit}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

/**
 * Obtiene un usuario por ID (solo admin)
 * @param token - Token de acceso JWT (debe ser admin)
 * @param usuarioId - ID del usuario
 * @returns Datos del usuario
 */
export const obtenerUsuario = async (token: string, usuarioId: number) => {
  const response = await api.get(`/usuarios/${usuarioId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

/**
 * Cambia el rol de un usuario (solo admin)
 * @param token - Token de acceso JWT (debe ser admin)
 * @param usuarioId - ID del usuario
 * @param nuevoRol - Nuevo rol ('usuario' o 'admin')
 * @returns Usuario actualizado
 */
export const cambiarRolUsuario = async (token: string, usuarioId: number, nuevoRol: string) => {
  const response = await api.put(`/usuarios/${usuarioId}/rol?nuevo_rol=${nuevoRol}`, {}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

/**
 * Activa o desactiva un usuario (solo admin)
 * @param token - Token de acceso JWT (debe ser admin)
 * @param usuarioId - ID del usuario
 * @param activo - true para activar, false para desactivar
 * @returns Usuario actualizado
 */
export const activarDesactivarUsuario = async (token: string, usuarioId: number, activo: boolean) => {
  const response = await api.put(`/usuarios/${usuarioId}/activar?activo=${activo}`, {}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export default {
  registrarUsuario,
  verificarEmail,
  obtenerPerfil,
  actualizarPerfil,
  eliminarCuenta,
  listarUsuarios,
  obtenerUsuario,
  cambiarRolUsuario,
  activarDesactivarUsuario,
};