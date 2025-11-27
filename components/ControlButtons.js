import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Vibration } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../styles/theme';
import { globalStyles } from '../styles/globalStyles';
import BluetoothService from '../services/BluetoothService';

/**
 * Componente Botones de Control
 * -----------------------------
 * Renderiza el pad direccional y maneja la lógica de envío de comandos.
 * Ahora soporta configuración personalizada (mapeo, vibración, modo).
 */

const ControlButtons = ({ disabled, settings }) => {
    // Estado para rastrear qué botón está presionado visualmente
    const [pressedButton, setPressedButton] = useState(null);

    // Estado para modo interruptor (toggle)
    const [activeToggle, setActiveToggle] = useState(null);

    // Valores animados
    const scaleAnims = {
        forward: React.useRef(new Animated.Value(1)).current,
        backward: React.useRef(new Animated.Value(1)).current,
        left: React.useRef(new Animated.Value(1)).current,
        right: React.useRef(new Animated.Value(1)).current,
    };

    // Resetear estados si se desconecta
    useEffect(() => {
        if (disabled) {
            setPressedButton(null);
            setActiveToggle(null);
        }
    }, [disabled]);

    /**
     * Obtiene el comando mapeado para una dirección
     */
    const getCommand = (direction) => {
        if (!settings || !settings.buttonMapping) return direction === 'stop' ? 'S' : '';
        return settings.buttonMapping[direction] || '';
    };

    /**
     * Maneja el evento de presionar (Press In)
     */
    const handlePressIn = (direction) => {
        if (disabled) return;

        // Si es modo interruptor, la lógica es diferente (ver handlePress)
        if (settings?.controlMode === 'switch') return;

        const command = getCommand(direction);
        setPressedButton(direction);

        if (settings?.vibrationEnabled) {
            Vibration.vibrate(50);
        }

        animateButton(direction, 0.9);
        BluetoothService.sendCommand(command);
    };

    /**
     * Maneja el evento de soltar (Press Out)
     */
    const handlePressOut = (direction) => {
        if (disabled) return;
        if (settings?.controlMode === 'switch') return;

        setPressedButton(null);
        animateButton(direction, 1);

        // Enviar comando de parada
        BluetoothService.sendCommand(getCommand('stop'));
    };

    /**
     * Maneja el toque simple (para modo interruptor)
     */
    const handlePress = (direction) => {
        if (disabled) return;
        if (settings?.controlMode !== 'switch') return;

        if (settings?.vibrationEnabled) {
            Vibration.vibrate(50);
        }

        // Si ya está activo este botón, lo desactivamos (Stop)
        if (activeToggle === direction) {
            setActiveToggle(null);
            setPressedButton(null);
            animateButton(direction, 1);
            BluetoothService.sendCommand(getCommand('stop'));
        } else {
            // Si hay otro activo, lo desactivamos visualmente primero
            if (activeToggle) {
                animateButton(activeToggle, 1);
            }

            // Activamos el nuevo
            setActiveToggle(direction);
            setPressedButton(direction);
            animateButton(direction, 0.9);
            BluetoothService.sendCommand(getCommand(direction));
        }
    };

    const animateButton = (direction, scale) => {
        Animated.spring(scaleAnims[direction], {
            toValue: scale,
            useNativeDriver: true,
            friction: 3,
        }).start();
    };

    /**
     * Sub-componente para renderizar un botón individual
     */
    const ControlButton = ({ direction, label, icon, style }) => {
        const isPressed = pressedButton === direction;

        return (
            <Animated.View style={{ transform: [{ scale: scaleAnims[direction] }] }}>
                <TouchableOpacity
                    onPressIn={() => handlePressIn(direction)}
                    onPressOut={() => handlePressOut(direction)}
                    onPress={() => handlePress(direction)}
                    disabled={disabled}
                    activeOpacity={settings?.controlMode === 'switch' ? 0.9 : 0.8}
                    delayPressIn={0}
                >
                    <LinearGradient
                        colors={
                            isPressed
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
    };

    return (
        <View style={styles.container}>
            <View style={globalStyles.glassCard}>
                <Text style={styles.title}>Controles</Text>

                <View style={styles.controlPad}>
                    {/* Botón Adelante */}
                    <View style={styles.row}>
                        <ControlButton
                            direction="forward"
                            label="Adelante"
                            icon="▲"
                        />
                    </View>

                    {/* Fila Central */}
                    <View style={[styles.row, styles.middleRow]}>
                        <ControlButton
                            direction="left"
                            label="Izquierda"
                            icon="◄"
                            style={styles.sideButton}
                        />
                        <View style={styles.spacer} />
                        <ControlButton
                            direction="right"
                            label="Derecha"
                            icon="►"
                            style={styles.sideButton}
                        />
                    </View>

                    {/* Botón Atrás */}
                    <View style={styles.row}>
                        <ControlButton
                            direction="backward"
                            label="Atrás"
                            icon="▼"
                        />
                    </View>
                </View>

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
