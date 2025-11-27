import React from 'react';
import { View, Image, StyleSheet, Animated } from 'react-native';
import { theme } from '../styles/theme';

/**
 * Componente Logo
 * ---------------
 * Muestra el logotipo de la aplicación con una animación de entrada (fade-in).
 * Si no se proporciona una imagen, muestra un placeholder elegante.
 */

const Logo = ({ source, size = 120 }) => {
    // Valor animado para la opacidad (empieza en 0 = invisible)
    const fadeAnim = React.useRef(new Animated.Value(0)).current;

    // Inicia la animación al montar el componente
    React.useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1, // Opacidad final (visible)
            duration: 800, // Duración en ms
            useNativeDriver: true, // Usa el hilo nativo para mejor rendimiento
        }).start();
    }, []);

    return (
        <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
            <View style={styles.logoWrapper}>
                {source ? (
                    <Image
                        source={source}
                        style={[styles.logo, { width: size, height: size }]}
                        resizeMode="contain"
                    />
                ) : (
                    // Placeholder si no hay imagen
                    <View style={[styles.placeholderLogo, { width: size, height: size }]}>
                        <View style={styles.placeholderIcon} />
                    </View>
                )}
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginVertical: theme.spacing.lg,
    },
    logoWrapper: {
        padding: theme.spacing.md,
        borderRadius: theme.borderRadius.xl,
        backgroundColor: 'rgba(139, 92, 246, 0.1)', // Fondo sutil
        borderWidth: 2,
        borderColor: 'rgba(139, 92, 246, 0.3)', // Borde brillante
    },
    logo: {
        borderRadius: theme.borderRadius.md,
    },
    placeholderLogo: {
        backgroundColor: 'rgba(139, 92, 246, 0.2)',
        borderRadius: theme.borderRadius.md,
        justifyContent: 'center',
        alignItems: 'center',
    },
    placeholderIcon: {
        width: 60,
        height: 60,
        borderRadius: theme.borderRadius.md,
        backgroundColor: theme.colors.primary,
    },
});

export default Logo;
