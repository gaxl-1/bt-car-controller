import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    StatusBar,
    Alert,
    ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../styles/theme';
import { globalStyles } from '../styles/globalStyles';
import BluetoothService from '../services/BluetoothService';
import Logo from '../components/Logo';
import ConnectionStatus from '../components/ConnectionStatus';
import ControlButtons from '../components/ControlButtons';
import DeviceSelector from '../components/DeviceSelector';

/**
 * Pantalla Principal (HomeScreen)
 * -------------------------------
 * Esta es la vista principal de la aplicación.
 * Coordina la interacción entre el servicio Bluetooth y los componentes de UI.
 * 
 * Responsabilidades:
 * 1. Gestionar el estado de conexión (conectado/desconectado)
 * 2. Manejar el escaneo y selección de dispositivos
 * 3. Mostrar la interfaz de usuario apropiada según el estado
 */

const HomeScreen = () => {
    // Estados de la aplicación
    const [isConnected, setIsConnected] = useState(false); // ¿Hay un dispositivo conectado?
    const [connectedDevice, setConnectedDevice] = useState(null); // Datos del dispositivo actual
    const [showDeviceSelector, setShowDeviceSelector] = useState(false); // ¿Mostrar modal de selección?
    const [devices, setDevices] = useState([]); // Lista de dispositivos encontrados
    const [isScanning, setIsScanning] = useState(false); // ¿Está escaneando actualmente?

    // Efecto inicial: Configuración y suscripción a eventos
    useEffect(() => {
        // Inicializa permisos y verifica estado del Bluetooth
        initializeBluetooth();

        // Handler para eventos del servicio Bluetooth
        const handleBluetoothEvent = (event, data) => {
            if (event === 'connected') {
                setIsConnected(true);
                setConnectedDevice(data);
                setShowDeviceSelector(false); // Cierra el modal al conectar
                Alert.alert('Conectado', `Conectado exitosamente a ${data.name || 'dispositivo'}`);
            } else if (event === 'disconnected') {
                setIsConnected(false);
                setConnectedDevice(null);
                Alert.alert('Desconectado', 'El dispositivo se ha desconectado');
            } else if (event === 'error') {
                Alert.alert('Error', 'Ocurrió un error en la conexión Bluetooth');
            }
        };

        // Suscribirse a los eventos
        BluetoothService.addListener(handleBluetoothEvent);

        // Limpieza al desmontar el componente
        return () => {
            BluetoothService.removeListener(handleBluetoothEvent);
        };
    }, []);

    /**
     * Verifica permisos y estado del Bluetooth al iniciar
     */
    const initializeBluetooth = async () => {
        const enabled = await BluetoothService.isBluetoothEnabled();

        if (!enabled) {
            const granted = await BluetoothService.requestPermissions();
            if (!granted) {
                Alert.alert(
                    'Bluetooth Requerido',
                    'Esta app necesita Bluetooth para controlar el carrito. Por favor actívalo y concede los permisos.'
                );
            }
        }
    };

    /**
     * Maneja el botón principal de Conectar/Desconectar
     */
    const handleConnect = async () => {
        if (isConnected) {
            // Si ya está conectado, intenta desconectar
            const success = await BluetoothService.disconnect();
            if (success) {
                setIsConnected(false);
                setConnectedDevice(null);
            }
        } else {
            // Si no está conectado, inicia escaneo y muestra selector
            await scanDevices();
            setShowDeviceSelector(true);
        }
    };

    /**
     * Escanea dispositivos cercanos
     */
    const scanDevices = async () => {
        setIsScanning(true);

        try {
            const foundDevices = await BluetoothService.scanDevices();
            setDevices(foundDevices);
        } catch (error) {
            Alert.alert('Error', 'No se pudieron buscar dispositivos cercanos');
        } finally {
            setIsScanning(false);
        }
    };

    /**
     * Maneja la selección de un dispositivo de la lista
     * @param {Object} device - Dispositivo seleccionado
     */
    const handleSelectDevice = async (device) => {
        setShowDeviceSelector(false); // Cierra modal inmediatamente para mejor UX

        try {
            // Intenta conectar (el resultado se maneja en el listener de eventos)
            const success = await BluetoothService.connect(device);

            if (!success) {
                Alert.alert(
                    'Error de Conexión',
                    'No se pudo establecer conexión con el dispositivo. Asegúrate de que esté encendido y en rango.'
                );
            }
        } catch (error) {
            Alert.alert('Error', 'Ocurrió un error inesperado al conectar');
        }
    };

    return (
        <SafeAreaView style={globalStyles.container}>
            <StatusBar barStyle="light-content" backgroundColor={theme.colors.background} />

            {/* Fondo con gradiente */}
            <LinearGradient
                colors={theme.gradients.background}
                style={styles.gradient}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Logo animado */}
                    <Logo size={120} />

                    {/* Títulos */}
                    <Text style={styles.appTitle}>BT Car Controller</Text>
                    <Text style={styles.appSubtitle}>Control Remoto Arduino</Text>

                    {/* Indicador de estado */}
                    <ConnectionStatus
                        isConnected={isConnected}
                        deviceName={connectedDevice?.name}
                    />

                    {/* Botón de Acción Principal (Conectar/Desconectar) */}
                    <View style={styles.connectButtonContainer}>
                        <TouchableOpacity
                            onPress={handleConnect}
                            activeOpacity={0.8}
                        >
                            <LinearGradient
                                colors={
                                    isConnected
                                        ? theme.gradients.danger // Rojo si está conectado (para desconectar)
                                        : theme.gradients.primary // Azul/Violeta si está desconectado
                                }
                                style={styles.connectButton}
                            >
                                <Text style={styles.connectButtonText}>
                                    {isConnected ? '🔌 Desconectar' : '📡 Conectar Dispositivo'}
                                </Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>

                    {/* Panel de Control (Cruceta) */}
                    <ControlButtons disabled={!isConnected} />

                    {/* Pie de página con instrucciones */}
                    <Text style={styles.footer}>
                        Mantén presionado para mover, suelta para detener
                    </Text>
                </ScrollView>

                {/* Modal emergente para seleccionar dispositivo */}
                <DeviceSelector
                    visible={showDeviceSelector}
                    onClose={() => setShowDeviceSelector(false)}
                    onSelectDevice={handleSelectDevice}
                    devices={devices}
                    isScanning={isScanning}
                />
            </LinearGradient>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    gradient: {
        flex: 1,
    },
    scrollContent: {
        paddingVertical: theme.spacing.lg,
    },
    appTitle: {
        ...theme.typography.h1,
        color: theme.colors.textPrimary,
        textAlign: 'center',
        marginTop: theme.spacing.md,
    },
    appSubtitle: {
        ...theme.typography.caption,
        color: theme.colors.textSecondary,
        textAlign: 'center',
        marginTop: theme.spacing.xs,
        marginBottom: theme.spacing.lg,
    },
    connectButtonContainer: {
        paddingHorizontal: theme.spacing.lg,
        marginVertical: theme.spacing.lg,
    },
    connectButton: {
        ...globalStyles.buttonBase,
        ...theme.shadows.lg,
    },
    connectButtonText: {
        ...theme.typography.body,
        color: theme.colors.textPrimary,
        fontWeight: 'bold',
        fontSize: 18,
    },
    footer: {
        ...theme.typography.caption,
        color: theme.colors.textMuted,
        textAlign: 'center',
        marginTop: theme.spacing.lg,
        marginBottom: theme.spacing.xl,
        fontStyle: 'italic',
    },
});

export default HomeScreen;
