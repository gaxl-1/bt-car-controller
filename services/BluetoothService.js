import { PermissionsAndroid, Platform } from 'react-native';
import RNBluetoothClassic from 'react-native-bluetooth-classic';

/**
 * Servicio de Bluetooth
 * ---------------------
 * Este servicio maneja toda la comunicación Bluetooth con el módulo HC-05/HC-06 del Arduino.
 * Implementa el patrón Singleton para asegurar una única instancia de conexión en toda la app.
 */

class BluetoothService {
    constructor() {
        // Almacena la referencia al dispositivo conectado actualmente
        this.connectedDevice = null;
        // Lista de funciones callback (listeners) que esperan eventos de Bluetooth
        this.listeners = [];
    }

    /**
     * Solicita permisos de Bluetooth al usuario (Android)
     * Maneja diferencias entre Android 12+ (S) y versiones anteriores.
     * @returns {Promise<boolean>} true si los permisos fueron concedidos
     */
    async requestPermissions() {
        if (Platform.OS === 'android') {
            try {
                // Para Android 12+ (API 31+)
                if (Platform.Version >= 31) {
                    const result = await PermissionsAndroid.requestMultiple([
                        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
                        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
                        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, // A veces necesario para escanear
                    ]);

                    return (
                        result['android.permission.BLUETOOTH_CONNECT'] === PermissionsAndroid.RESULTS.GRANTED &&
                        result['android.permission.BLUETOOTH_SCAN'] === PermissionsAndroid.RESULTS.GRANTED
                    );
                }
                // Para Android < 12
                else {
                    const granted = await PermissionsAndroid.request(
                        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                        {
                            title: 'Permiso de Ubicación Requerido',
                            message: 'Esta app necesita acceso a la ubicación para buscar dispositivos Bluetooth cercanos.',
                            buttonNeutral: 'Preguntar luego',
                            buttonNegative: 'Cancelar',
                            buttonPositive: 'OK',
                        }
                    );
                    return granted === PermissionsAndroid.RESULTS.GRANTED;
                }
            } catch (err) {
                console.warn(err);
                return false;
            }
        }
        return true;
    }

    /**
     * Verifica si el adaptador Bluetooth del teléfono está encendido
     * @returns {Promise<boolean>} true si el Bluetooth está activo
     */
    async isBluetoothEnabled() {
        try {
            return await RNBluetoothClassic.isBluetoothEnabled();
        } catch (error) {
            console.error('Error al verificar estado del Bluetooth:', error);
            return false;
        }
    }

    /**
     * Escanea dispositivos Bluetooth disponibles
     * Busca tanto dispositivos ya emparejados como nuevos dispositivos cercanos
     * @returns {Promise<Array>} Lista de dispositivos encontrados
     */
    async scanDevices() {
        try {
            // Obtiene dispositivos ya emparejados en la configuración de Android
            const paired = await RNBluetoothClassic.getBondedDevices();
            // Inicia búsqueda de nuevos dispositivos no emparejados
            const unpaired = await RNBluetoothClassic.startDiscovery();

            // Combina ambas listas eliminando duplicados si es necesario (aquí simplificado)
            const allDevices = [...paired, ...unpaired];

            return allDevices;
        } catch (error) {
            console.error('Error al escanear dispositivos:', error);
            return [];
        }
    }

    /**
     * Intenta conectar con un dispositivo específico
     * @param {Object} device - El objeto dispositivo obtenido del escaneo
     * @returns {Promise<boolean>} true si la conexión fue exitosa
     */
    async connect(device) {
        try {
            // Intenta establecer la conexión socket RFCOMM
            const connection = await device.connect();

            if (connection) {
                this.connectedDevice = device;
                // Notifica a la interfaz que se ha conectado exitosamente
                this.notifyListeners('connected', device);
                return true;
            }

            return false;
        } catch (error) {
            console.error('Error al conectar con el dispositivo:', error);
            this.notifyListeners('error', error);
            return false;
        }
    }

    /**
     * Desconecta el dispositivo actual si existe una conexión activa
     * @returns {Promise<boolean>} true si se desconectó correctamente
     */
    async disconnect() {
        try {
            if (this.connectedDevice) {
                await this.connectedDevice.disconnect();
                const deviceName = this.connectedDevice.name;
                this.connectedDevice = null;
                // Notifica a la interfaz que se ha perdido la conexión
                this.notifyListeners('disconnected', deviceName);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error al desconectar:', error);
            return false;
        }
    }

    /**
     * Envía un comando de texto al Arduino
     * Comandos usados: 'F' (Adelante), 'B' (Atrás), 'L' (Izquierda), 'R' (Derecha), 'S' (Parar)
     * @param {string} command - El caracter o cadena a enviar
     * @returns {Promise<boolean>} true si el envío fue exitoso
     */
    async sendCommand(command) {
        try {
            if (!this.connectedDevice) {
                console.warn('No hay dispositivo conectado para enviar comandos');
                return false;
            }

            // Verifica si la conexión sigue activa antes de enviar
            if (!this.connectedDevice.isConnected()) {
                console.warn('El dispositivo parece estar desconectado');
                this.connectedDevice = null;
                this.notifyListeners('disconnected', 'Conexión perdida');
                return false;
            }

            // Escribe el comando en el stream de salida Bluetooth
            await this.connectedDevice.write(command);
            console.log(`Comando enviado: ${command}`);
            return true;
        } catch (error) {
            console.error('Error al enviar comando:', error);
            return false;
        }
    }

    /**
     * Obtiene el objeto del dispositivo conectado actualmente
     */
    getConnectedDevice() {
        return this.connectedDevice;
    }

    /**
     * Verifica si hay una conexión activa
     */
    isConnected() {
        return this.connectedDevice !== null && this.connectedDevice.isConnected();
    }

    /**
     * Agrega un listener para recibir eventos (conectado, desconectado, error)
     * @param {Function} callback - Función a ejecutar cuando ocurra un evento
     */
    addListener(callback) {
        this.listeners.push(callback);
    }

    /**
     * Elimina un listener previamente registrado
     * @param {Function} callback - La misma función que se registró
     */
    removeListener(callback) {
        this.listeners = this.listeners.filter(listener => listener !== callback);
    }

    /**
     * Método interno para notificar a todos los listeners registrados
     * @param {string} event - Nombre del evento
     * @param {any} data - Datos asociados al evento
     */
    notifyListeners(event, data) {
        this.listeners.forEach(listener => {
            listener(event, data);
        });
    }

    /**
     * Limpia recursos y desconecta (útil al cerrar la app)
     */
    cleanup() {
        this.disconnect();
        this.listeners = [];
    }
}

// Exporta una única instancia (Singleton) para usar en toda la app
export default new BluetoothService();
