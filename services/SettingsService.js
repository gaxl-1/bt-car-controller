import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Servicio de Configuración (SettingsService)
 * -------------------------------------------
 * Maneja la persistencia de las preferencias del usuario.
 * Utiliza AsyncStorage para guardar y recuperar datos.
 */

const SETTINGS_KEY = '@bt_car_settings';

// Configuración por defecto
const DEFAULT_SETTINGS = {
    vibrationEnabled: true,
    controlMode: 'continuous', // 'continuous' (mantener) o 'switch' (tocar)
    buttonMapping: {
        forward: 'F',
        backward: 'B',
        left: 'L',
        right: 'R',
        stop: 'S',
    },
};

class SettingsService {
    constructor() {
        this.settings = { ...DEFAULT_SETTINGS };
        this.listeners = [];
    }

    /**
     * Carga la configuración guardada al iniciar la app
     */
    async loadSettings() {
        try {
            const jsonValue = await AsyncStorage.getItem(SETTINGS_KEY);
            if (jsonValue != null) {
                const savedSettings = JSON.parse(jsonValue);
                // Fusionar con defaults para asegurar que existan todas las claves (en caso de updates)
                this.settings = {
                    ...DEFAULT_SETTINGS,
                    ...savedSettings,
                    buttonMapping: {
                        ...DEFAULT_SETTINGS.buttonMapping,
                        ...(savedSettings.buttonMapping || {}),
                    },
                };
            }
            return this.settings;
        } catch (e) {
            console.error('Error al cargar configuración:', e);
            return DEFAULT_SETTINGS;
        }
    }

    /**
     * Guarda la configuración actual
     * @param {Object} newSettings - Objeto con los cambios a guardar
     */
    async saveSettings(newSettings) {
        try {
            this.settings = { ...this.settings, ...newSettings };
            const jsonValue = JSON.stringify(this.settings);
            await AsyncStorage.setItem(SETTINGS_KEY, jsonValue);
            this.notifyListeners();
            return true;
        } catch (e) {
            console.error('Error al guardar configuración:', e);
            return false;
        }
    }

    /**
     * Obtiene la configuración actual en memoria
     */
    getSettings() {
        return this.settings;
    }

    /**
     * Resetea la configuración a los valores por defecto
     */
    async resetSettings() {
        await this.saveSettings(DEFAULT_SETTINGS);
        return this.settings;
    }

    /**
     * Suscribe un listener para cambios en la configuración
     */
    addListener(callback) {
        this.listeners.push(callback);
    }

    /**
     * Elimina un listener
     */
    removeListener(callback) {
        this.listeners = this.listeners.filter(l => l !== callback);
    }

    notifyListeners() {
        this.listeners.forEach(callback => callback(this.settings));
    }
}

export default new SettingsService();
