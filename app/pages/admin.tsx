import { SafeArea } from '@/components/ui/safe-area';
import { useAuth } from '@/hooks/useAuth';
import {
  crearCarpeta,
  listarCarpetas,
} from '@/services/carpetas';
import {
  eliminarDocumento,
  listarDocumentos,
  subirDocumento,
  toggleActivoDocumento,
} from '@/services/documentos';
import { adminStyle } from '@/styles/adminStyle';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as DocumentPicker from 'expo-document-picker';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Modal, ScrollView, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import ChatScreen from './chat';

const Tab = createBottomTabNavigator();

// ==================== COMPONENTE DE DOCUMENTOS ====================
function DocumentosScreen() {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [documentos, setDocumentos] = useState<any[]>([]);
  const [carpetas, setCarpetas] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [nuevaCarpeta, setNuevaCarpeta] = useState('');
  const [carpetaSeleccionada, setCarpetaSeleccionada] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (token) cargarDatos();
  }, [token]);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const docs = await listarDocumentos(token!, { limit: 100 });
      setDocumentos(docs);
      const carpetasData = await listarCarpetas(token!, { limit: 100 });
      setCarpetas(carpetasData);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  const handleSubirDocumento = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'text/plain', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
        copyToCacheDirectory: true,
      });
      if (result.canceled) return;
      setLoading(true);
      await subirDocumento(token!, result.assets[0], carpetaSeleccionada);
      Alert.alert('Éxito', 'Documento subido correctamente');
      cargarDatos();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Error al subir el documento');
    } finally {
      setLoading(false);
    }
  };

  const handleCrearCarpeta = async () => {
    if (!nuevaCarpeta.trim()) {
      Alert.alert('Error', 'El nombre de la carpeta es obligatorio');
      return;
    }
    try {
      setLoading(true);
      const carpetaData: any = { nombre: nuevaCarpeta.trim(), activa: true };
      if (carpetaSeleccionada !== undefined && carpetaSeleccionada !== null) {
        carpetaData.padre_id = carpetaSeleccionada;
      }
      await crearCarpeta(token!, carpetaData);
      Alert.alert('Éxito', 'Carpeta creada correctamente');
      setNuevaCarpeta('');
      setModalVisible(false);
      cargarDatos();
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.detail || 'Error al crear la carpeta');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActivo = async (documentoId: number, activo: boolean) => {
    try {
      setLoading(true);
      await toggleActivoDocumento(token!, documentoId, !activo);
      cargarDatos();
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar el estado');
    } finally {
      setLoading(false);
    }
  };

  const handleEliminarDocumento = async (documentoId: number, nombre: string) => {
    Alert.alert(
      'Eliminar Documento',
      `¿Estás seguro de eliminar "${nombre}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              await eliminarDocumento(token!, documentoId);
              cargarDatos();
            } catch (error) {
              Alert.alert('Error', 'No se pudo eliminar el documento');
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <View style={adminStyle.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={adminStyle.loadingText}>Cargando...</Text>
      </View>
    );
  }

  return (
    <View style={adminStyle.container}>
      <ScrollView style={adminStyle.scrollView}>
        <View style={adminStyle.header}>
          <Text style={adminStyle.title}>📁 Panel de Gestión</Text>
          <Text style={adminStyle.subtitle}>Administra documentos y carpetas</Text>
        </View>

        <View style={adminStyle.actionsRow}>
          <TouchableOpacity style={adminStyle.button} onPress={handleSubirDocumento}>
            <Text style={adminStyle.buttonText}>📤 Subir Documento</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[adminStyle.button, adminStyle.buttonSecondary]} onPress={() => setModalVisible(true)}>
            <Text style={adminStyle.buttonText}>📁 Nueva Carpeta</Text>
          </TouchableOpacity>
        </View>

        <View style={adminStyle.filterContainer}>
          <Text style={adminStyle.filterLabel}>Carpeta actual:</Text>
          <TouchableOpacity
            style={adminStyle.filterButton}
            onPress={() => {
              Alert.alert(
                'Seleccionar Carpeta',
                'Elige una carpeta para filtrar',
                [
                  { text: 'Todas', onPress: () => setCarpetaSeleccionada(undefined) },
                  ...carpetas.map(c => ({
                    text: c.nombre,
                    onPress: () => setCarpetaSeleccionada(c.id)
                  }))
                ]
              );
            }}
          >
            <Text style={adminStyle.filterText}>
              {carpetaSeleccionada ? carpetas.find(c => c.id === carpetaSeleccionada)?.nombre || 'Seleccionar' : 'Todas'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={adminStyle.section}>
          <Text style={adminStyle.sectionTitle}>📂 Carpetas</Text>
          {carpetas.length === 0 ? (
            <Text style={adminStyle.emptyText}>No hay carpetas creadas</Text>
          ) : (
            carpetas.map(c => (
              <View key={c.id} style={adminStyle.carpetaItem}>
                <Text style={adminStyle.carpetaNombre}>📁 {c.nombre}</Text>
                <Text style={adminStyle.carpetaInfo}>
                  {c.documentos_count || 0} documentos • {c.subcarpetas_count || 0} subcarpetas
                </Text>
              </View>
            ))
          )}
        </View>

        <View style={adminStyle.section}>
          <Text style={adminStyle.sectionTitle}>📄 Documentos</Text>
          {documentos.length === 0 ? (
            <Text style={adminStyle.emptyText}>No hay documentos subidos</Text>
          ) : (
            documentos.map(doc => (
              <View key={doc.id} style={adminStyle.documentoItem}>
                <View style={adminStyle.documentoInfo}>
                  <Text style={adminStyle.documentoNombre}>{doc.nombre}</Text>
                  <Text style={adminStyle.documentoMeta}>
                    {doc.extension || ''} • {(doc.tamano_bytes / 1024).toFixed(1)} KB
                  </Text>
                  <Text style={adminStyle.documentoFecha}>
                    Subido: {new Date(doc.fecha_subida).toLocaleDateString()}
                  </Text>
                </View>
                <View style={adminStyle.documentoActions}>
                  <View style={adminStyle.switchContainer}>
                    <Text style={adminStyle.switchLabel}>{doc.activo ? '✅ Activo' : '⛔ Inactivo'}</Text>
                    <Switch
                      value={doc.activo}
                      onValueChange={() => handleToggleActivo(doc.id, doc.activo)}
                      trackColor={{ false: '#767577', true: '#4CAF50' }}
                      thumbColor={doc.activo ? '#fff' : '#f4f3f4'}
                    />
                  </View>
                  <TouchableOpacity style={adminStyle.deleteButton} onPress={() => handleEliminarDocumento(doc.id, doc.nombre)}>
                    <Text style={adminStyle.deleteButtonText}>🗑️</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </View>

        <Modal animationType="slide" transparent visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
          <View style={adminStyle.modalOverlay}>
            <View style={adminStyle.modalContent}>
              <Text style={adminStyle.modalTitle}>📁 Nueva Carpeta</Text>
              <TextInput
                style={adminStyle.modalInput}
                placeholder="Nombre de la carpeta"
                placeholderTextColor="#999"
                value={nuevaCarpeta}
                onChangeText={setNuevaCarpeta}
              />
              <View style={adminStyle.modalButtons}>
                <TouchableOpacity
                  style={[adminStyle.modalButton, adminStyle.modalButtonCancel]}
                  onPress={() => {
                    setModalVisible(false);
                    setNuevaCarpeta('');
                  }}
                >
                  <Text style={adminStyle.modalButtonText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[adminStyle.modalButton, adminStyle.modalButtonConfirm]}
                  onPress={handleCrearCarpeta}
                >
                  <Text style={adminStyle.modalButtonText}>Crear</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </View>
  );
}

// ==================== ADMIN TABS CON LOGOUT EN HEADER ====================
export default function AdminScreen() {
  const { logout } = useAuth();

  return (
    <SafeArea style={{ flex: 1, backgroundColor: '#1a1a1a' }}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused }) => {
            const icon = route.name === 'Documentos' ? '📁' : '💬';
            return <Text style={{ fontSize: 24, color: focused ? '#007AFF' : '#999' }}>{icon}</Text>;
          },
          tabBarLabel: ({ focused }) => (
            <Text style={{ color: focused ? '#007AFF' : '#999', fontSize: 12 }}>
              {route.name}
            </Text>
          ),
          tabBarStyle: {
            backgroundColor: '#1a1a1a',
            borderTopColor: '#333',
            height: 60,
            paddingBottom: 5,
          },
          headerShown: true,
          headerStyle: {
            backgroundColor: '#1a1a1a',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          // 🔥 LOGOUT EN EL HEADER
          headerRight: () => (
            <TouchableOpacity
              style={adminStyle.logoutButton}
              onPress={async () => {
                Alert.alert(
                  'Cerrar Sesión',
                  '¿Estás seguro de que quieres salir?',
                  [
                    { text: 'Cancelar', style: 'cancel' },
                    {
                      text: 'Salir',
                      style: 'destructive',
                      onPress: async () => {
                        await logout();
                      },
                    },
                  ]
                );
              }}
            >
              <Text style={adminStyle.logoutButtonText}>Cerrar Sesión</Text>
            </TouchableOpacity>
          ),
        })}
      >
        <Tab.Screen 
          name="Documentos" 
          component={DocumentosScreen} 
          options={{ title: 'Gestión' }}
        />
        <Tab.Screen 
          name="Chat" 
          component={ChatScreen} 
          options={{ title: 'Chat' }}
        />
      </Tab.Navigator>
    </SafeArea>
  );
}