import React from 'react';
import {
    View,
    Text,
    Modal,
    TouchableOpacity,
    FlatList,
    StyleSheet,
    ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../styles/theme';
import { globalStyles } from '../styles/globalStyles';

/**
 * Componente Selector de Dispositivos
 * -----------------------------------
 * Modal que muestra la lista de dispositivos Bluetooth disponibles.
 * Permite escanear y seleccionar un dispositivo para conectar.
 */

const DeviceSelector = ({ visible, onClose, onSelectDevice, devices, isScanning }) => {

    // Renderiza cada ítem de la lista de dispositivos
    const renderDevice = ({ item }) => (
        <TouchableOpacity
            onPress={() => onSelectDevice(item)}
            style={styles.deviceItem}
            activeOpacity={0.7}
        >
            <LinearGradient
                colors={['rgba(139, 92, 246, 0.2)', 'rgba(59, 130, 246, 0.1)']}
                style={styles.deviceGradient}
            >
                <View>
                    <Text style={styles.deviceName}>{item.name || 'Dispositivo sin nombre'}</Text>
                    <Text style={styles.deviceAddress}>{item.address}</Text>
                </View>
                <Text style={styles.deviceIcon}>📡</Text>
            </LinearGradient>
        </TouchableOpacity>
    );

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide" // Animación de deslizamiento desde abajo
            onRequestClose={onClose} // Maneja el botón "Atrás" de Android
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <LinearGradient
                        colors={[theme.colors.backgroundLight, theme.colors.background]}
                        style={styles.modalGradient}
                    >
                        {/* Encabezado del Modal */}
                        <View style={styles.header}>
                            <Text style={styles.title}>Seleccionar Dispositivo</Text>
                            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                                <Text style={styles.closeIcon}>✕</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Contenido Principal */}
                        {isScanning ? (
                            // Muestra spinner de carga mientras escanea
                            <View style={styles.loadingContainer}>
                                <ActivityIndicator size="large" color={theme.colors.primary} />
                                <Text style={styles.loadingText}>Buscando dispositivos...</Text>
                            </View>
                        ) : devices.length > 0 ? (
                            // Muestra lista de dispositivos encontrados
                            <FlatList
                                data={devices}
                                renderItem={renderDevice}
                                keyExtractor={(item) => item.address}
                                style={styles.deviceList}
                                contentContainerStyle={styles.deviceListContent}
                            />
                        ) : (
                            // Muestra mensaje si no se encontraron dispositivos
                            <View style={styles.emptyContainer}>
                                <Text style={styles.emptyIcon}>🔍</Text>
                                <Text style={styles.emptyText}>No se encontraron dispositivos</Text>
                                <Text style={styles.emptySubtext}>
                                    Asegúrate de que el Bluetooth esté activado y el dispositivo esté emparejado
                                </Text>
                            </View>
                        )}
                    </LinearGradient>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: theme.colors.overlay,
        justifyContent: 'flex-end', // Alinea el modal al fondo
    },
    modalContent: {
        maxHeight: '80%', // Ocupa máximo el 80% de la pantalla
        borderTopLeftRadius: theme.borderRadius.xl,
        borderTopRightRadius: theme.borderRadius.xl,
        overflow: 'hidden',
    },
    modalGradient: {
        padding: theme.spacing.lg,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.lg,
    },
    title: {
        ...theme.typography.h2,
        color: theme.colors.textPrimary,
    },
    closeButton: {
        width: 36,
        height: 36,
        borderRadius: theme.borderRadius.full,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeIcon: {
        fontSize: 24,
        color: theme.colors.textPrimary,
    },
    deviceList: {
        maxHeight: 400,
    },
    deviceListContent: {
        paddingBottom: theme.spacing.lg,
    },
    deviceItem: {
        marginBottom: theme.spacing.md,
        borderRadius: theme.borderRadius.md,
        overflow: 'hidden',
    },
    deviceGradient: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: theme.spacing.md,
        borderWidth: 1,
        borderColor: 'rgba(139, 92, 246, 0.3)',
        borderRadius: theme.borderRadius.md,
    },
    deviceName: {
        ...theme.typography.body,
        color: theme.colors.textPrimary,
        fontWeight: '600',
        marginBottom: theme.spacing.xs,
    },
    deviceAddress: {
        ...theme.typography.caption,
        color: theme.colors.textSecondary,
    },
    deviceIcon: {
        fontSize: 24,
    },
    loadingContainer: {
        alignItems: 'center',
        paddingVertical: theme.spacing.xxl,
    },
    loadingText: {
        ...theme.typography.body,
        color: theme.colors.textSecondary,
        marginTop: theme.spacing.md,
    },
    emptyContainer: {
        alignItems: 'center',
        paddingVertical: theme.spacing.xxl,
    },
    emptyIcon: {
        fontSize: 48,
        marginBottom: theme.spacing.md,
    },
    emptyText: {
        ...theme.typography.h3,
        color: theme.colors.textPrimary,
        marginBottom: theme.spacing.sm,
    },
    emptySubtext: {
        ...theme.typography.caption,
        color: theme.colors.textSecondary,
        textAlign: 'center',
        paddingHorizontal: theme.spacing.lg,
    },
});

export default DeviceSelector;
