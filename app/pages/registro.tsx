import { SafeArea } from '@/components/ui/safe-area';
import { registroStyle } from '@/styles/registroStyle';
import React from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function RegistroScreen() {
  return (
    <SafeArea style={registroStyle.container}>
      <View style={registroStyle.content}>
        <Text style={registroStyle.title}>Crear Cuenta</Text>
        <TextInput 
          style={registroStyle.input} 
          placeholder="Email" 
          placeholderTextColor="#999"
        />
        <TextInput 
          style={registroStyle.input} 
          placeholder="Nombre" 
          placeholderTextColor="#999"
        />
        <TextInput 
          style={registroStyle.input} 
          placeholder="Contraseña" 
          placeholderTextColor="#999"
          secureTextEntry
        />
        <TouchableOpacity style={registroStyle.button}>
          <Text style={registroStyle.buttonText}>Registrarse</Text>
        </TouchableOpacity>
        <Text style={registroStyle.link}>¿Ya tienes cuenta? Inicia sesión</Text>
      </View>
    </SafeArea>
  );
}