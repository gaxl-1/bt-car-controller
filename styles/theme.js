/**
 * Configuración del Tema (Theme)
 * ------------------------------
 * Define la paleta de colores centralizada, gradientes, espaciado y configuraciones
 * de animación para mantener la consistencia visual en toda la aplicación.
 */

export const theme = {
    colors: {
        // Paleta Principal - Tema vibrante púrpura/azul
        primary: '#8B5CF6',      // Color principal (Violeta)
        primaryDark: '#7C3AED',  // Versión oscura para estados activos
        primaryLight: '#A78BFA', // Versión clara para brillos

        // Colores de Acento
        accent: '#3B82F6',       // Azul brillante
        accentDark: '#2563EB',   // Azul oscuro

        // Colores de Estado
        success: '#10B981',      // Verde para éxito/conectado
        successLight: '#34D399',
        danger: '#EF4444',       // Rojo para error/desconectado
        dangerLight: '#F87171',
        warning: '#F59E0B',      // Amarillo para advertencias

        // Colores de Fondo (Modo Oscuro)
        background: '#0F172A',      // Fondo principal muy oscuro (Azul noche)
        backgroundLight: '#1E293B', // Fondo secundario para tarjetas
        backgroundCard: '#1E293B',  // Fondo específico para tarjetas

        // Colores de Texto
        textPrimary: '#F8FAFC',   // Blanco casi puro para texto principal
        textSecondary: '#CBD5E1', // Gris claro para subtítulos
        textMuted: '#64748B',     // Gris oscuro para texto deshabilitado

        // Elementos de UI
        border: '#334155',        // Color de bordes
        borderLight: '#475569',
        overlay: 'rgba(0, 0, 0, 0.5)', // Fondo semitransparente para modales
    },

    // Definiciones de Gradientes (usados con expo-linear-gradient)
    gradients: {
        primary: ['#8B5CF6', '#3B82F6'],    // Gradiente principal Púrpura -> Azul
        background: ['#0F172A', '#1E293B'], // Gradiente de fondo sutil
        button: ['#8B5CF6', '#7C3AED'],     // Gradiente para botones
        success: ['#10B981', '#059669'],    // Gradiente verde
        danger: ['#EF4444', '#DC2626'],     // Gradiente rojo
    },

    // Sistema de Espaciado (múltiplos de 4px)
    spacing: {
        xs: 4,
        sm: 8,
        md: 16,
        lg: 24,
        xl: 32,
        xxl: 48,
    },

    // Radios de Borde
    borderRadius: {
        sm: 8,
        md: 12,
        lg: 16,
        xl: 24,
        full: 9999, // Para círculos perfectos
    },

    // Sombras predefinidas (estilo iOS/Android)
    shadows: {
        sm: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 2,
        },
        md: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 4.65,
            elevation: 4,
        },
        lg: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.37,
            shadowRadius: 7.49,
            elevation: 8,
        },
        // Efecto de resplandor (Glow)
        glow: {
            shadowColor: '#8B5CF6',
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.5,
            shadowRadius: 10,
            elevation: 5,
        },
    },

    // Tipografía
    typography: {
        h1: {
            fontSize: 32,
            fontWeight: 'bold',
            letterSpacing: -0.5,
        },
        h2: {
            fontSize: 24,
            fontWeight: 'bold',
            letterSpacing: -0.3,
        },
        h3: {
            fontSize: 20,
            fontWeight: '600',
            letterSpacing: -0.2,
        },
        body: {
            fontSize: 16,
            fontWeight: 'normal',
        },
        caption: {
            fontSize: 14,
            fontWeight: 'normal',
        },
        small: {
            fontSize: 12,
            fontWeight: 'normal',
        },
    },

    // Duraciones de animación (ms)
    animation: {
        fast: 150,
        normal: 250,
        slow: 350,
    },
};
