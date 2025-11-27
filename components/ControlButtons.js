import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Vibration } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../styles/theme';
import { globalStyles } from '../styles/globalStyles';
import BluetoothService from '../services/BluetoothService';

/**
 * Componente Botones de Control
 * -----------------------------
 * Este componente renderiza el pad direccional (cruceta) para controlar el carrito.
 * Maneja los eventos de presionar y soltar para enviar comandos continuos.
 * 
 * Lógica de Control:
 * - Al presionar (onPressIn): Envía comando de movimiento (F, B, L, R)
 * - Al soltar (onPressOut): Envía comando de parada (S)
 */

const ControlButtons = ({ disabled }) => {
    // Estado para rastrear qué botón está presionado visualmente
    const [pressedButton, setPressedButton] = React.useState(null);

    // Valores animados para el efecto de escala al presionar cada botón
    const scaleAnims = {
        forward: React.useRef(new Animated.Value(1)).current,
        backward: React.useRef(new Animated.Value(1)).current,
        left: React.useRef(new Animated.Value(1)).current,
        right: React.useRef(new Animated.Value(1)).current,
    };

    /**
     * Maneja el evento cuando el usuario comienza a presionar un botón
     * @param {string} direction - Identificador del botón ('forward', 'backward', etc.)
     * @param {string} command - Comando a enviar al Arduino ('F', 'B', etc.)
     */
    const handlePressIn = (direction, command) => {
        if (disabled) return; // No hace nada si no está conectado

        setPressedButton(direction);
        Vibration.vibrate(50); // Feedback háptico (vibración corta)

        // Inicia animación de "hundimiento" del botón
        Animated.spring(scaleAnims[direction], {
            toValue: 0.9, // Reduce tamaño al 90%
            useNativeDriver: true,
        }).start();

        // Envía el comando de movimiento al Arduino
        BluetoothService.sendCommand(command);
    };

    /**
     * Maneja el evento cuando el usuario suelta el botón
     * @param {string} direction - Identificador del botón que se soltó
     */
    const handlePressOut = (direction) => {
        if (disabled) return;

        setPressedButton(null);

        // Restaura el tamaño original del botón con efecto rebote
        Animated.spring(scaleAnims[direction], {
            toValue: 1,
            friction: 3,
            useNativeDriver: true,
        }).start();

        // Envía comando 'S' para detener los motores inmediatamente
        BluetoothService.sendCommand('S');
    };

    /**
     * Sub-componente para renderizar un botón individual
     * Encapsula la lógica de animación y estilos
     */
    const ControlButton = ({ direction, command, label, icon, style }) => (
        <Animated.View style={{ transform: [{ scale: scaleAnims[direction] }] }}>
            <TouchableOpacity
                onPressIn={() => handlePressIn(direction, command)}
                onPressOut={() => handlePressOut(direction)}
                disabled={disabled}
                activeOpacity={0.8}
            >
                <LinearGradient
                    // Cambia el color si el botón está presionado
                    colors={
                        pressedButton === direction
                            ? [theme.colors.primaryLight, theme.colors.primary]
                            : ['rgba(139, 92, 246, 0.3)', 'rgba(139, 92, 246, 0.1)']
                    }
                    style={[styles.controlButton, style, disabled && styles.disabledButton]}
                >
                    <Text style={styles.buttonIcon}>{icon}</Text>
                    <Text style={styles.buttonLabel}>{label}</Text>
                </LinearGradient>
            </TouchableOpacity>
        </Animated.View>
    );

    return (
        <View style={styles.container}>
            <View style={globalStyles.glassCard}>
                <Text style={styles.title}>Controles</Text>

                <View style={styles.controlPad}>
                    {/* Botón Adelante (Arriba) */}
                    <View style={styles.row}>
                        <ControlButton
                            direction="forward"
                            command="F"
                            label="Adelante"
                            icon="▲"
                        />
                    </View>

                    {/* Fila Central: Izquierda y Derecha */}
                    <View style={[styles.row, styles.middleRow]}>
                        <ControlButton
                            direction="left"
                            command="L"
                            label="Izquierda"
                            icon="◄"
                            style={styles.sideButton}
                        />
                        {/* Espaciador central para separar izquierda/derecha */}
                        <View style={styles.spacer} />
                        <ControlButton
                            direction="right"
                            command="R"
                            label="Derecha"
                            icon="►"
                            style={styles.sideButton}
                        />
                    </View>

                    {/* Botón Atrás (Abajo) */}
                    <View style={styles.row}>
                        <ControlButton
                            direction="backward"
                            command="B"
                            label="Atrás"
                            icon="▼"
                        />
                    </View>
                </View>

                {/* Mensaje informativo cuando está desconectado */}
                {disabled && (
                    <Text style={styles.disabledText}>
                        Conecta un dispositivo para usar los controles
                    </Text>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: theme.spacing.lg,
        marginVertical: theme.spacing.lg,
    },
    title: {
        ...theme.typography.h2,
        color: theme.colors.textPrimary,
        textAlign: 'center',
        marginBottom: theme.spacing.lg,
    },
    controlPad: {
        alignItems: 'center',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginVertical: theme.spacing.sm,
    },
    middleRow: {
        marginVertical: theme.spacing.md,
    },
    spacer: {
        width: 100,
    },
    controlButton: {
        width: 100,
        height: 100,
        borderRadius: theme.borderRadius.lg,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: theme.colors.primary,
        ...theme.shadows.lg,
    },
    sideButton: {
        // Additional styles for side buttons if needed
    },
    disabledButton: {
        opacity: 0.4,
    },
    buttonIcon: {
        fontSize: 32,
        color: theme.colors.textPrimary,
        marginBottom: theme.spacing.xs,
    },
    buttonLabel: {
        ...theme.typography.caption,
        color: theme.colors.textPrimary,
        fontWeight: '600',
        textAlign: 'center',
    },
    disabledText: {
        ...theme.typography.caption,
        color: theme.colors.textMuted,
        textAlign: 'center',
        marginTop: theme.spacing.lg,
        fontStyle: 'italic',
    },
});

export default ControlButtons;
