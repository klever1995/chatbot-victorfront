import { StyleSheet } from 'react-native';

export const loginStyle = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  content: {
    flex: 1,
    justifyContent: 'space-between', // 🔥 Distribuye el espacio entre header, formulario y footer
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  // ==================== HEADER ====================
  headerContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
  title: {
    fontSize: 38,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#aaa',
    textAlign: 'center',
    marginBottom: 15,
  },
  divider: {
    width: 60,
    height: 3,
    backgroundColor: '#007AFF',
    borderRadius: 2,
    marginVertical: 10,
  },
  motivationalText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: 10,
  },
  // ==================== FORMULARIO ====================
  formContainer: {
    width: '100%',
    alignItems: 'center',
  },
  input: {
    width: '100%',
    height: 55,
    backgroundColor: '#333',
    borderRadius: 12,
    paddingHorizontal: 15,
    color: '#fff',
    marginBottom: 15,
    fontSize: 16,
  },
  passwordContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    borderRadius: 12,
    marginBottom: 15,
  },
  passwordInput: {
    flex: 1,
    height: 55,
    paddingHorizontal: 15,
    color: '#fff',
    fontSize: 16,
  },
  eyeButton: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  eyeText: {
    fontSize: 24,
    color: '#fff',
  },
  button: {
    width: '100%',
    height: 55,
    backgroundColor: '#007AFF',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  link: {
    color: '#007AFF',
    marginTop: 25,
    fontSize: 16,
  },
  // ==================== FOOTER ====================
  footerContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  },
  footerText: {
    color: '#555',
    fontSize: 12,
    textAlign: 'center',
  },
});