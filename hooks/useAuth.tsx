import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { login as loginService } from '../services/auth';

// ==================== TIPOS ====================
interface User {
  id: number;
  email: string;
  nombre: string;
  rol: string;
  empresa_id: number;
  activo: boolean;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStorageData = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('@KnowledgeBot:token');
        const storedUser = await AsyncStorage.getItem('@KnowledgeBot:user');
        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Error al cargar datos de sesión:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadStorageData();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await loginService(email, password);
      const { access_token } = response;
      if (!access_token) throw new Error('No se recibió token');

      const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.1.145:8005/api/v1';
      const userResponse = await fetch(`${API_URL}/usuarios/me`, {
        headers: {
          'Authorization': `Bearer ${access_token}`,
          'ngrok-skip-browser-warning': 'true',
          'Content-Type': 'application/json',
        },
      });

      if (!userResponse.ok) {
        const errorData = await userResponse.json();
        throw new Error(JSON.stringify(errorData));
      }

      const userData = await userResponse.json();
      setToken(access_token);
      setUser(userData);
      await AsyncStorage.setItem('@KnowledgeBot:token', access_token);
      await AsyncStorage.setItem('@KnowledgeBot:user', JSON.stringify(userData));

      // 🔥 REDIRECCIÓN SEGÚN ROL
      if (userData.rol === 'admin') {
        router.replace('/pages/admin');
      } else {
        router.replace('/pages/chat');
      }
    } catch (error: any) {
      console.error('❌ Error en login:', error.message || error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setToken(null);
    setUser(null);
    await AsyncStorage.removeItem('@KnowledgeBot:token');
    await AsyncStorage.removeItem('@KnowledgeBot:user');
    router.replace('/pages/login');
  };

  const isAdmin = user?.rol === 'admin';

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

export default useAuth;