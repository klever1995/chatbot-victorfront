import { useColorScheme } from '@/hooks/use-color-scheme';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { AuthProvider } from '../hooks/useAuth';

export const unstable_settings = { initialRouteName: 'index' };

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <AuthProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          {/* Pantallas de autenticación */}
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="pages/login" options={{ headerShown: false }} />
          <Stack.Screen name="pages/registro" options={{ headerShown: false }} />
          
          {/* Pantallas protegidas */}
          <Stack.Screen name="pages/admin" options={{ headerShown: false }} />
          <Stack.Screen name="pages/chat" options={{ headerShown: false }} />
          
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </AuthProvider>
  );
}