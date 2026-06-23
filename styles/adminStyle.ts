import { StyleSheet } from 'react-native';

export const adminStyle = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#999',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  button: {
    flex: 1,
    height: 50,
    backgroundColor: '#007AFF',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonSecondary: {
    backgroundColor: '#333',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#222',
    padding: 10,
    borderRadius: 10,
  },
  filterLabel: {
    color: '#fff',
    fontSize: 14,
    marginRight: 10,
  },
  filterButton: {
    backgroundColor: '#333',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
  },
  filterText: {
    color: '#007AFF',
    fontSize: 14,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 10,
  },
  emptyText: {
    color: '#666',
    fontSize: 14,
    textAlign: 'center',
    padding: 20,
  },
  carpetaItem: {
    backgroundColor: '#222',
    padding: 15,
    borderRadius: 10,
    marginBottom: 8,
  },
  carpetaNombre: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  carpetaInfo: {
    color: '#999',
    fontSize: 12,
    marginTop: 5,
  },
  documentoItem: {
    backgroundColor: '#222',
    padding: 15,
    borderRadius: 10,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  documentoInfo: {
    flex: 1,
  },
  documentoNombre: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  documentoMeta: {
    color: '#999',
    fontSize: 12,
    marginTop: 2,
  },
  documentoFecha: {
    color: '#666',
    fontSize: 10,
    marginTop: 2,
  },
  documentoActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  switchContainer: {
    alignItems: 'center',
    marginRight: 10,
  },
  switchLabel: {
    color: '#999',
    fontSize: 10,
    marginBottom: 5,
  },
  deleteButton: {
    padding: 8,
    backgroundColor: '#ff3b30',
    borderRadius: 8,
  },
  deleteButtonText: {
    fontSize: 18,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#1a1a1a',
    borderRadius: 20,
    padding: 25,
    width: '90%',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalInput: {
    backgroundColor: '#333',
    borderRadius: 10,
    padding: 15,
    color: '#fff',
    fontSize: 16,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  modalButton: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalButtonCancel: {
    backgroundColor: '#333',
  },
  modalButtonConfirm: {
    backgroundColor: '#007AFF',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

  loadingContainer: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#1a1a1a',
},
loadingText: {
  color: '#fff',
  marginTop: 20,
  fontSize: 16,
},

// ==================== LOGOUT BUTTON (HEADER) ====================
logoutButton: {
  marginRight: 16,
  backgroundColor: '#ff3b30',
  paddingVertical: 6,
  paddingHorizontal: 12,
  borderRadius: 16,
},
logoutButtonText: {
  color: '#fff',
  fontWeight: 'bold',
  fontSize: 12,
},
});

