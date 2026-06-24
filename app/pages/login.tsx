import { SafeArea } from '@/components/ui/safe-area';
import { useAuth } from '@/hooks/useAuth';
import { loginStyle } from '@/styles/loginStyle';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [debugError, setDebugError] = useState('');
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor ingresa email y contraseña');
      return;
    }

    setIsLoading(true);
    setDebugError('');
    try {
      await login(email, password);
    } catch (error: any) {
      const rawError = JSON.stringify(error.response?.data || error.message || error);
      setDebugError(rawError);
      let errorMessage = 'Credenciales incorrectas. Por favor, revisa tu email y contraseña.';
      if (error.response?.data?.detail) {
        const detail = error.response.data.detail;
        errorMessage = Array.isArray(detail) ? String(detail[0]?.msg || detail[0] || errorMessage) : String(detail);
      } else if (error.message) {
        errorMessage = String(error.message);
      }
      Alert.alert('Error de inicio de sesión', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const goToRegistro = () => {
    router.push('/pages/registro');
  };

  return (
    <SafeArea style={loginStyle.container}>
      <View style={loginStyle.content}>
        <View style={loginStyle.headerContainer}>
          <Text style={loginStyle.title}>🧠 Sinteligen</Text>
          <Text style={loginStyle.subtitle}>Tu asistente inteligente para la gestión de conocimiento</Text>
          <View style={loginStyle.divider} />
          <Text style={loginStyle.motivationalText}>
            Transforma tus documentos en respuestas instantáneas
          </Text>
        </View>

        <View style={loginStyle.formContainer}>
          <TextInput
            style={loginStyle.input}
            placeholder="Email"
            placeholderTextColor="#999"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <View style={loginStyle.passwordContainer}>
            <TextInput
              style={loginStyle.passwordInput}
              placeholder="Contraseña"
              placeholderTextColor="#999"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity
              style={loginStyle.eyeButton}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Text style={loginStyle.eyeText}>{showPassword ? '🙈' : '👁️'}</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={loginStyle.button} 
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={loginStyle.buttonText}>Iniciar Sesión</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={goToRegistro}>
            <Text style={loginStyle.link}>¿No tienes cuenta? Regístrate</Text>
          </TouchableOpacity>

          {debugError ? (
            <Text style={{ color: 'red', fontSize: 12, marginTop: 10, padding: 5 }}>
              DEBUG: {debugError}
            </Text>
          ) : null}
        </View>

        <View style={loginStyle.footerContainer}>
          <Text style={loginStyle.footerText}>© 2026 Sinteligen - Todos los derechos reservados</Text>
        </View>
      </View>
    </SafeArea>
  );
}