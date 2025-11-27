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
import SettingsService from '../services/SettingsService';
import Logo from '../components/Logo';
import ConnectionStatus from '../components/ConnectionStatus';
import ControlButtons from '../components/ControlButtons';
import DeviceSelector from '../components/DeviceSelector';
import SettingsModal from '../components/SettingsModal';

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
    const [showSettings, setShowSettings] = useState(false); // Estado para el modal de ajustes
    const [devices, setDevices] = useState([]); // Lista de dispositivos encontrados
    const [isScanning, setIsScanning] = useState(false); // ¿Está escaneando actualmente?

    // Estado de configuración (se pasa a los botones)
    const [appSettings, setAppSettings] = useState(SettingsService.getSettings());

    // Efecto inicial: Configuración y suscripción a eventos
    useEffect(() => {
        // Inicializa permisos y verifica estado del Bluetooth
        initializeBluetooth();
        loadSettings();

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

        // Listener para cambios en configuración
        const handleSettingsChange = (newSettings) => {
            setAppSettings(newSettings);
        };

        // Suscribirse a los eventos
        BluetoothService.addListener(handleBluetoothEvent);
        SettingsService.addListener(handleSettingsChange);

        // Limpieza al desmontar el componente
        return () => {
            BluetoothService.removeListener(handleBluetoothEvent);
            SettingsService.removeListener(handleSettingsChange);
        };
    }, []);

    const loadSettings = async () => {
        const settings = await SettingsService.loadSettings();
        setAppSettings(settings);
    };

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
                {/* Botón de Configuración (Flotante o en Header) */}
                <View style={styles.headerContainer}>
                    <TouchableOpacity
                        style={styles.settingsButton}
                        onPress={() => setShowSettings(true)}
                    >
                        <Text style={styles.settingsIcon}>⚙️</Text>
                    </TouchableOpacity>
                </View>

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
                    <ControlButtons
                        disabled={!isConnected}
                        settings={appSettings} // Pasamos la configuración
                    />

                    {/* Pie de página con instrucciones */}
                    <Text style={styles.footer}>
                        {appSettings.controlMode === 'continuous'
                            ? 'Mantén presionado para mover'
                            : 'Toca para activar/desactivar'}
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

                <SettingsModal
                    visible={showSettings}
                    onClose={() => setShowSettings(false)}
                />
            </LinearGradient>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    gradient: {
        flex: 1,
    },
    headerContainer: {
        position: 'absolute',
        top: 10,
        right: 20,
        zIndex: 10,
    },
    settingsButton: {
        padding: 8,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: theme.borderRadius.full,
    },
    settingsIcon: {
        fontSize: 24,
    },
    scrollContent: {
        padding: theme.spacing.lg,
        alignItems: 'center',
        paddingTop: 40, // Espacio para el botón de settings
    },
    appTitle: {
        ...theme.typography.h1,
        color: theme.colors.textPrimary,
        marginTop: theme.spacing.md,
        textAlign: 'center',
    },
    appSubtitle: {
        ...theme.typography.body,
        color: theme.colors.textSecondary,
        marginBottom: theme.spacing.lg,
        textAlign: 'center',
    },
    connectButtonContainer: {
        width: '100%',
        marginVertical: theme.spacing.lg,
        ...theme.shadows.glow,
    },
    connectButton: {
        paddingVertical: theme.spacing.md,
        paddingHorizontal: theme.spacing.xl,
        borderRadius: theme.borderRadius.full,
        alignItems: 'center',
    },
    connectButtonText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 18,
    },
    footer: {
        ...theme.typography.caption,
        color: theme.colors.textMuted,
        marginTop: theme.spacing.xl,
        textAlign: 'center',
    },
});

export default HomeScreen;
