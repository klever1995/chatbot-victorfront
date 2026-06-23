import { SafeArea } from '@/components/ui/safe-area';
import { useAuth } from '@/hooks/useAuth';
import { consultar, consultarAudioDesdeURI } from '@/services/chat';
import { chatStyle } from '@/styles/chatStyle';
import { Audio } from 'expo-av';
import React, { useRef, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export default function ChatScreen() {
  const { token } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [messages, setMessages] = useState<Array<{role: 'user' | 'bot', text: string}>>([]);
  const [textInput, setTextInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const recordingRef = useRef<Audio.Recording | null>(null);

  // ==================== GRABACIÓN DE AUDIO ====================
  const startRecording = async () => {
    try {
      const permission = await Audio.requestPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Error', 'Permiso de micrófono denegado');
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync({
        android: {
          extension: '.m4a',
          outputFormat: Audio.AndroidOutputFormat.MPEG_4,
          audioEncoder: Audio.AndroidAudioEncoder.AAC,
          sampleRate: 44100,
          numberOfChannels: 2,
          bitRate: 128000,
        },
        ios: {
          extension: '.m4a',
          audioQuality: Audio.IOSAudioQuality.MAX,
          sampleRate: 44100,
          numberOfChannels: 2,
          bitRate: 128000,
          linearPCMBitDepth: 16,
          linearPCMIsBigEndian: false,
          linearPCMIsFloat: false,
        },
        web: {
          mimeType: 'audio/mp4',
          bitsPerSecond: 128000,
        },
      });
      await recording.startAsync();
      recordingRef.current = recording;
      setIsRecording(true);
    } catch (error) {
      console.error('Error al iniciar grabación:', error);
      Alert.alert('Error', 'No se pudo iniciar la grabación');
    }
  };

  const stopRecording = async () => {
    if (!recordingRef.current) return;

    try {
      setIsRecording(false);
      await recordingRef.current.stopAndUnloadAsync();
      const uri = recordingRef.current.getURI();
      
      if (uri) {
        setIsProcessing(true);
        setMessages(prev => [...prev, { role: 'user', text: '🎤 Enviando audio...' }]);
        
        const response = await consultarAudioDesdeURI(token!, uri);
        
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1] = { 
            role: 'user', 
            text: `🎤 ${response.transcripcion || 'Audio transcrito'}` 
          };
          return newMessages;
        });
        
        setMessages(prev => [...prev, { role: 'bot', text: response.respuesta }]);
      }
    } catch (error) {
      console.error('Error al detener grabación:', error);
      Alert.alert('Error', 'Error al procesar el audio');
    } finally {
      setIsProcessing(false);
      recordingRef.current = null;
    }
  };

  // ==================== CONSULTA EN TEXTO ====================
  const handleSendText = async () => {
    if (!textInput.trim()) return;

    const userMessage = textInput.trim();
    setTextInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsProcessing(true);

    try {
      const response = await consultar(token!, userMessage);
      setMessages(prev => [...prev, { role: 'bot', text: response.respuesta }]);
      
      if (response.fuentes?.length > 0) {
        const fuentesText = `📚 Fuentes: ${response.fuentes.join(', ')}`;
        setMessages(prev => [...prev, { role: 'bot', text: fuentesText }]);
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo obtener respuesta');
    } finally {
      setIsProcessing(false);
    }
  };

  // ==================== RENDER ====================
  return (
    <SafeArea style={chatStyle.container}>
      <View style={chatStyle.header}>
        <Text style={chatStyle.title}>💬 Asistente IA</Text>
        <Text style={chatStyle.subtitle}>Pregunta por voz o texto</Text>
      </View>

      <ScrollView
        ref={scrollViewRef}
        style={chatStyle.messagesContainer}
        contentContainerStyle={chatStyle.messagesContent}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
      >
        {messages.length === 0 ? (
          <View style={chatStyle.emptyState}>
            <Text style={chatStyle.emptyText}>👋 Haz una pregunta o graba un audio</Text>
          </View>
        ) : (
          messages.map((msg, index) => (
            <View
              key={index}
              style={[
                chatStyle.messageBubble,
                msg.role === 'user' ? chatStyle.userMessage : chatStyle.botMessage,
              ]}
            >
              <Text style={chatStyle.messageText}>{msg.text}</Text>
            </View>
          ))
        )}
        {isProcessing && (
          <View style={chatStyle.loadingContainer}>
            <ActivityIndicator size="small" color="#007AFF" />
            <Text style={chatStyle.loadingText}>Pensando...</Text>
          </View>
        )}
      </ScrollView>

      <View style={chatStyle.inputContainer}>
        <TextInput
          style={chatStyle.textInput}
          placeholder="Escribe tu pregunta..."
          placeholderTextColor="#999"
          value={textInput}
          onChangeText={setTextInput}
          onSubmitEditing={handleSendText}
          editable={!isProcessing}
        />
        <TouchableOpacity
          style={[chatStyle.sendButton, !textInput.trim() && chatStyle.sendButtonDisabled]}
          onPress={handleSendText}
          disabled={!textInput.trim() || isProcessing}
        >
          <Text style={chatStyle.sendButtonText}>➤</Text>
        </TouchableOpacity>
      </View>

      <View style={chatStyle.micContainer}>
        <TouchableOpacity
          style={[
            chatStyle.micButton,
            isRecording && chatStyle.micButtonRecording,
            isProcessing && chatStyle.micButtonDisabled,
          ]}
          onPressIn={startRecording}
          onPressOut={stopRecording}
          disabled={isProcessing}
        >
          <Text style={chatStyle.micText}>{isRecording ? '⏹️' : '🎤'}</Text>
        </TouchableOpacity>
        <Text style={chatStyle.hint}>
          {isRecording ? 'Suelta para enviar' : 'Mantén presionado para grabar'}
        </Text>
      </View>
    </SafeArea>
  );
}