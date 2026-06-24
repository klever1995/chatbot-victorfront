import axios from 'axios';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.1.145:8005/api/v1';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true',
  },
});

export const login = async (email: string, password: string) => {
  const params = new URLSearchParams();
  params.append('username', email);
  params.append('password', password);

  const response = await api.post('/auth/login', params.toString(), {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'ngrok-skip-browser-warning': 'true',
    },
  });

  return response.data;
};

export const registro = async (userData: {
  email: string;
  nombre: string;
  password: string;
  empresa_id: number;
}) => {
  const response = await api.post('/usuarios/registro', userData);
  return response.data;
};

export const verificarEmail = async (token: string) => {
  const response = await api.get(`/usuarios/verificar-email?token=${token}`);
  return response.data;
};

export const obtenerPerfil = async (token: string) => {
  const response = await api.get('/usuarios/me', {
    headers: {
      Authorization: `Bearer ${token}`,
      'ngrok-skip-browser-warning': 'true',
    },
  });
  return response.data;
};

export const actualizarPerfil = async (token: string, data: any) => {
  const response = await api.put('/usuarios/me', data, {
    headers: {
      Authorization: `Bearer ${token}`,
      'ngrok-skip-browser-warning': 'true',
    },
  });
  return response.data;
};

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