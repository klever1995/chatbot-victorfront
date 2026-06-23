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
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor ingresa email y contraseña');
      return;
    }

    setIsLoading(true);
    try {
      await login(email, password);
    } catch (error: any) {
      let errorMessage = 'Credenciales incorrectas. Por favor, revisa tu email y contraseña.';
      if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      } else if (error.message) {
        errorMessage = error.message;
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
        {/* 🔥 ENCABEZADO CON LOGO Y MENSAJE */}
        <View style={loginStyle.headerContainer}>
          <Text style={loginStyle.title}>🧠 Sinteligen</Text>
          <Text style={loginStyle.subtitle}>Tu asistente inteligente para la gestión de conocimiento</Text>
          <View style={loginStyle.divider} />
          <Text style={loginStyle.motivationalText}>
            Transforma tus documentos en respuestas instantáneas
          </Text>
        </View>

        {/* 🔥 FORMULARIO DE LOGIN */}
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
        </View>

        {/* 🔥 FOOTER DECORATIVO */}
        <View style={loginStyle.footerContainer}>
          <Text style={loginStyle.footerText}>© 2026 Sinteligen - Todos los derechos reservados</Text>
        </View>
      </View>
    </SafeArea>
  );
}