import { StyleSheet } from 'react-native';
import { theme } from './theme';

/**
 * Estilos Globales
 * ----------------
 * Define estilos reutilizables para mantener consistencia en toda la app.
 * Incluye utilidades para layout, tipografía, botones y efectos visuales.
 */

export const globalStyles = StyleSheet.create({
    // Contenedor principal que ocupa toda la pantalla
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },

    // Contenedor centrado (útil para loaders o mensajes)
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.colors.background,
    },

    // Tarjeta con efecto Glassmorphism (Vidrio esmerilado)
    glassCard: {
        backgroundColor: 'rgba(30, 41, 59, 0.7)', // Fondo semitransparente
        borderRadius: theme.borderRadius.lg,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)', // Borde sutil
        padding: theme.spacing.lg,
        ...theme.shadows.md,
    },

    // Estilos base para botones
    buttonBase: {
        borderRadius: theme.borderRadius.md,
        padding: theme.spacing.md,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 50,
    },

    // Botones de control direccional (cuadrados grandes)
    controlButton: {
        width: 90,
        height: 90,
        borderRadius: theme.borderRadius.lg,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(139, 92, 246, 0.2)',
        borderWidth: 2,
        borderColor: theme.colors.primary,
        ...theme.shadows.glow, // Efecto de resplandor
    },

    // Estado presionado del botón de control
    controlButtonPressed: {
        backgroundColor: 'rgba(139, 92, 246, 0.5)',
        transform: [{ scale: 0.95 }],
    },

    // Estilos de texto
    textPrimary: {
        color: theme.colors.textPrimary,
        ...theme.typography.body,
    },

    textSecondary: {
        color: theme.colors.textSecondary,
        ...theme.typography.caption,
    },

    textMuted: {
        color: theme.colors.textMuted,
        ...theme.typography.small,
    },

    // Encabezados
    heading1: {
        color: theme.colors.textPrimary,
        ...theme.typography.h1,
    },

    heading2: {
        color: theme.colors.textPrimary,
        ...theme.typography.h2,
    },

    heading3: {
        color: theme.colors.textPrimary,
        ...theme.typography.h3,
    },

    // Indicador de estado (punto de color)
    statusIndicator: {
        width: 12,
        height: 12,
        borderRadius: theme.borderRadius.full,
        marginRight: theme.spacing.sm,
    },

    // Estado conectado (verde brillante)
    statusConnected: {
        backgroundColor: theme.colors.success,
        ...theme.shadows.glow,
        shadowColor: theme.colors.success,
    },

    // Estado desconectado (rojo)
    statusDisconnected: {
        backgroundColor: theme.colors.danger,
    },

    // Utilidades de Layout
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    spaceBetween: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    // Utilidades de Espaciado (Márgenes y Padding)
    mt1: { marginTop: theme.spacing.sm },
    mt2: { marginTop: theme.spacing.md },
    mt3: { marginTop: theme.spacing.lg },
    mt4: { marginTop: theme.spacing.xl },

    mb1: { marginBottom: theme.spacing.sm },
    mb2: { marginBottom: theme.spacing.md },
    mb3: { marginBottom: theme.spacing.lg },
    mb4: { marginBottom: theme.spacing.xl },

    mx1: { marginHorizontal: theme.spacing.sm },
    mx2: { marginHorizontal: theme.spacing.md },
    mx3: { marginHorizontal: theme.spacing.lg },

    my1: { marginVertical: theme.spacing.sm },
    my2: { marginVertical: theme.spacing.md },
    my3: { marginVertical: theme.spacing.lg },

    p1: { padding: theme.spacing.sm },
    p2: { padding: theme.spacing.md },
    p3: { padding: theme.spacing.lg },
    p4: { padding: theme.spacing.xl },
});
