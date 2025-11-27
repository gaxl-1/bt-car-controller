import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { theme } from '../styles/theme';
import { globalStyles } from '../styles/globalStyles';

/**
 * Componente Estado de Conexión
 * -----------------------------
 * Muestra visualmente si la app está conectada a un dispositivo Bluetooth.
 * Incluye una animación de "pulso" cuando está conectado para indicar actividad.
 */

const ConnectionStatus = ({ isConnected, deviceName }) => {
    // Valor animado para el efecto de pulso (escala)
    const pulseAnim = React.useRef(new Animated.Value(1)).current;

    React.useEffect(() => {
        if (isConnected) {
            // Inicia animación de pulso infinito si está conectado
            Animated.loop(
                Animated.sequence([
                    Animated.timing(pulseAnim, {
                        toValue: 1.2, // Crece un 20%
                        duration: 1000,
                        useNativeDriver: true,
                    }),
                    Animated.timing(pulseAnim, {
                        toValue: 1, // Vuelve al tamaño original
                        duration: 1000,
                        useNativeDriver: true,
                    }),
                ])
            ).start();
        } else {
            // Resetea la animación si se desconecta
            pulseAnim.setValue(1);
        }
    }, [isConnected]);

    return (
        <View style={styles.container}>
            <View style={globalStyles.glassCard}>
                <View style={globalStyles.row}>
                    {/* Indicador visual (punto de color) */}
                    <Animated.View
                        style={[
                            globalStyles.statusIndicator,
                            isConnected ? globalStyles.statusConnected : globalStyles.statusDisconnected,
                            { transform: [{ scale: pulseAnim }] }, // Aplica la animación
                        ]}
                    />
                    <View>
                        <Text style={styles.statusText}>
                            {isConnected ? 'Conectado' : 'Desconectado'}
                        </Text>
                        {isConnected && deviceName && (
                            <Text style={styles.deviceName}>{deviceName}</Text>
                        )}
                    </View>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: theme.spacing.lg,
        marginVertical: theme.spacing.md,
    },
    statusText: {
        ...theme.typography.h3,
        color: theme.colors.textPrimary,
        fontWeight: '600',
    },
    deviceName: {
        ...theme.typography.caption,
        color: theme.colors.textSecondary,
        marginTop: theme.spacing.xs,
    },
});

export default ConnectionStatus;
