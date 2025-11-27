import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    Modal,
    TouchableOpacity,
    StyleSheet,
    Switch,
    TextInput,
    ScrollView,
    Linking,
    Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../styles/theme';
import { globalStyles } from '../styles/globalStyles';
import SettingsService from '../services/SettingsService';

/**
 * Componente Modal de Configuración e Información
 * -----------------------------------------------
 * Permite al usuario modificar preferencias y ver información de la app.
 */

const SettingsModal = ({ visible, onClose }) => {
    const [activeTab, setActiveTab] = useState('settings'); // 'settings' o 'info'
    const [settings, setSettings] = useState(SettingsService.getSettings());

    // Estado local para el mapeo de botones (para editar)
    const [mapping, setMapping] = useState(settings.buttonMapping);

    // Cargar configuración al abrir
    useEffect(() => {
        if (visible) {
            const current = SettingsService.getSettings();
            setSettings(current);
            setMapping(current.buttonMapping);
        }
    }, [visible]);

    // Guardar cambios al cerrar o modificar
    const handleSave = async () => {
        const newSettings = {
            ...settings,
            buttonMapping: mapping,
        };
        await SettingsService.saveSettings(newSettings);
        setSettings(newSettings);
        Alert.alert('Guardado', 'Configuración actualizada correctamente');
    };

    const toggleVibration = (value) => {
        const newSettings = { ...settings, vibrationEnabled: value };
        setSettings(newSettings);
        SettingsService.saveSettings(newSettings);
    };

    const setControlMode = (mode) => {
        const newSettings = { ...settings, controlMode: mode };
        setSettings(newSettings);
        SettingsService.saveSettings(newSettings);
    };

    const updateMapping = (key, value) => {
        // Solo permitir un caracter
        const char = value.length > 0 ? value.charAt(value.length - 1).toUpperCase() : '';
        setMapping({ ...mapping, [key]: char });
    };

    const openLink = (url) => {
        Linking.openURL(url).catch(err => console.error("Couldn't load page", err));
    };

    const renderSettingsTab = () => (
        <ScrollView style={styles.tabContent}>
            {/* Sección: General */}
            <Text style={styles.sectionTitle}>General</Text>
            <View style={styles.settingRow}>
                <Text style={styles.settingLabel}>Vibración (Haptic)</Text>
                <Switch
                    value={settings.vibrationEnabled}
                    onValueChange={toggleVibration}
                    trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
                    thumbColor={theme.colors.textPrimary}
                />
            </View>

            {/* Sección: Modo de Control */}
            <Text style={styles.sectionTitle}>Modo de Control</Text>
            <View style={styles.modeSelector}>
                <TouchableOpacity
                    style={[
                        styles.modeButton,
                        settings.controlMode === 'continuous' && styles.modeButtonActive
                    ]}
                    onPress={() => setControlMode('continuous')}
                >
                    <Text style={styles.modeText}>Continuo (Mantener)</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[
                        styles.modeButton,
                        settings.controlMode === 'switch' && styles.modeButtonActive
                    ]}
                    onPress={() => setControlMode('switch')}
                >
                    <Text style={styles.modeText}>Interruptor (Toque)</Text>
                </TouchableOpacity>
            </View>

            {/* Sección: Mapeo de Botones */}
            <Text style={styles.sectionTitle}>Mapeo de Comandos</Text>
            <Text style={styles.sectionSubtitle}>Personaliza los caracteres enviados al Arduino</Text>

            <View style={styles.mappingContainer}>
                <View style={styles.mappingRow}>
                    <Text style={styles.mappingLabel}>Adelante (▲)</Text>
                    <TextInput
                        style={styles.input}
                        value={mapping.forward}
                        onChangeText={(t) => updateMapping('forward', t)}
                        maxLength={1}
                    />
                </View>
                <View style={styles.mappingRow}>
                    <Text style={styles.mappingLabel}>Atrás (▼)</Text>
                    <TextInput
                        style={styles.input}
                        value={mapping.backward}
                        onChangeText={(t) => updateMapping('backward', t)}
                        maxLength={1}
                    />
                </View>
                <View style={styles.mappingRow}>
                    <Text style={styles.mappingLabel}>Izquierda (◄)</Text>
                    <TextInput
                        style={styles.input}
                        value={mapping.left}
                        onChangeText={(t) => updateMapping('left', t)}
                        maxLength={1}
                    />
                </View>
                <View style={styles.mappingRow}>
                    <Text style={styles.mappingLabel}>Derecha (►)</Text>
                    <TextInput
                        style={styles.input}
                        value={mapping.right}
                        onChangeText={(t) => updateMapping('right', t)}
                        maxLength={1}
                    />
                </View>
                <View style={styles.mappingRow}>
                    <Text style={styles.mappingLabel}>Parar (Stop)</Text>
                    <TextInput
                        style={styles.input}
                        value={mapping.stop}
                        onChangeText={(t) => updateMapping('stop', t)}
                        maxLength={1}
                    />
                </View>
            </View>

            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <LinearGradient
                    colors={theme.gradients.primary}
                    style={styles.saveGradient}
                >
                    <Text style={styles.saveText}>Guardar Cambios</Text>
                </LinearGradient>
            </TouchableOpacity>
        </ScrollView>
    );

    const renderInfoTab = () => (
        <ScrollView style={styles.tabContent}>
            <View style={styles.infoContainer}>
                <Text style={styles.appVersion}>BT Car Controller v1.1.0</Text>

                <View style={styles.devCard}>
                    <Text style={styles.devTitle}>Desarrollado por</Text>
                    <Text style={styles.devName}>Jairo Gael Mota Lopez</Text>
                    <Text style={styles.devRole}>Ing. Desarrollo de Software</Text>
                </View>

                <Text style={styles.linksTitle}>Enlaces</Text>

                <TouchableOpacity
                    style={styles.linkButton}
                    onPress={() => openLink('https://github.com/gaxl-1/bt-car-controller.git')}
                >
                    <LinearGradient
                        colors={['#333', '#000']}
                        style={styles.linkGradient}
                    >
                        <Text style={styles.linkIcon}>🐙</Text>
                        <Text style={styles.linkText}>GitHub Repo</Text>
                    </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.linkButton}
                    onPress={() => openLink('https://www.instagram.com/gaxl.1/?utm_source=ig_web_button_share_sheet')}
                >
                    <LinearGradient
                        colors={['#833AB4', '#FD1D1D', '#F77737']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.linkGradient}
                    >
                        <Text style={styles.linkIcon}>📸</Text>
                        <Text style={styles.linkText}>Instagram</Text>
                    </LinearGradient>
                </TouchableOpacity>

                <Text style={styles.copyright}>© 2025 Jairo Gael Mota Lopez</Text>
            </View>
        </ScrollView>
    );

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <LinearGradient
                        colors={[theme.colors.backgroundLight, theme.colors.background]}
                        style={styles.modalGradient}
                    >
                        {/* Header */}
                        <View style={styles.header}>
                            <Text style={styles.title}>Ajustes</Text>
                            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                                <Text style={styles.closeIcon}>✕</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Tabs */}
                        <View style={styles.tabBar}>
                            <TouchableOpacity
                                style={[styles.tab, activeTab === 'settings' && styles.activeTab]}
                                onPress={() => setActiveTab('settings')}
                            >
                                <Text style={[styles.tabText, activeTab === 'settings' && styles.activeTabText]}>
                                    Configuración
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.tab, activeTab === 'info' && styles.activeTab]}
                                onPress={() => setActiveTab('info')}
                            >
                                <Text style={[styles.tabText, activeTab === 'info' && styles.activeTabText]}>
                                    Información
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {/* Content */}
                        {activeTab === 'settings' ? renderSettingsTab() : renderInfoTab()}

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
        justifyContent: 'flex-end',
    },
    modalContent: {
        height: '90%',
        borderTopLeftRadius: theme.borderRadius.xl,
        borderTopRightRadius: theme.borderRadius.xl,
        overflow: 'hidden',
    },
    modalGradient: {
        flex: 1,
        padding: theme.spacing.lg,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.md,
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
        fontSize: 20,
        color: theme.colors.textPrimary,
    },
    tabBar: {
        flexDirection: 'row',
        backgroundColor: 'rgba(0,0,0,0.2)',
        borderRadius: theme.borderRadius.md,
        padding: 4,
        marginBottom: theme.spacing.lg,
    },
    tab: {
        flex: 1,
        paddingVertical: theme.spacing.sm,
        alignItems: 'center',
        borderRadius: theme.borderRadius.sm,
    },
    activeTab: {
        backgroundColor: theme.colors.primary,
    },
    tabText: {
        color: theme.colors.textSecondary,
        fontWeight: '600',
    },
    activeTabText: {
        color: '#FFF',
    },
    tabContent: {
        flex: 1,
    },
    sectionTitle: {
        ...theme.typography.h3,
        color: theme.colors.textPrimary,
        marginTop: theme.spacing.md,
        marginBottom: theme.spacing.sm,
    },
    sectionSubtitle: {
        ...theme.typography.caption,
        color: theme.colors.textSecondary,
        marginBottom: theme.spacing.md,
    },
    settingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.05)',
        padding: theme.spacing.md,
        borderRadius: theme.borderRadius.md,
        marginBottom: theme.spacing.md,
    },
    settingLabel: {
        color: theme.colors.textPrimary,
        fontSize: 16,
    },
    modeSelector: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: theme.spacing.lg,
    },
    modeButton: {
        flex: 1,
        padding: theme.spacing.md,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: theme.borderRadius.md,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'transparent',
    },
    modeButtonActive: {
        backgroundColor: 'rgba(139, 92, 246, 0.2)',
        borderColor: theme.colors.primary,
    },
    modeText: {
        color: theme.colors.textPrimary,
        fontSize: 14,
    },
    mappingContainer: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: theme.borderRadius.md,
        padding: theme.spacing.md,
        marginBottom: theme.spacing.lg,
    },
    mappingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.sm,
    },
    mappingLabel: {
        color: theme.colors.textSecondary,
        width: 120,
    },
    input: {
        backgroundColor: 'rgba(0,0,0,0.3)',
        color: theme.colors.primaryLight,
        borderRadius: theme.borderRadius.sm,
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.xs,
        width: 60,
        textAlign: 'center',
        fontSize: 18,
        fontWeight: 'bold',
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    saveButton: {
        marginTop: theme.spacing.md,
        marginBottom: theme.spacing.xl,
        borderRadius: theme.borderRadius.md,
        overflow: 'hidden',
    },
    saveGradient: {
        padding: theme.spacing.md,
        alignItems: 'center',
    },
    saveText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 16,
    },
    infoContainer: {
        alignItems: 'center',
        paddingVertical: theme.spacing.md,
    },
    appVersion: {
        color: theme.colors.textSecondary,
        marginBottom: theme.spacing.lg,
    },
    devCard: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        padding: theme.spacing.lg,
        borderRadius: theme.borderRadius.lg,
        alignItems: 'center',
        width: '100%',
        marginBottom: theme.spacing.xl,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    devTitle: {
        color: theme.colors.textMuted,
        fontSize: 12,
        textTransform: 'uppercase',
        marginBottom: theme.spacing.xs,
    },
    devName: {
        color: theme.colors.textPrimary,
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: theme.spacing.xs,
    },
    devRole: {
        color: theme.colors.primaryLight,
        fontSize: 14,
    },
    linksTitle: {
        color: theme.colors.textSecondary,
        marginBottom: theme.spacing.md,
        alignSelf: 'flex-start',
    },
    linkButton: {
        width: '100%',
        marginBottom: theme.spacing.md,
        borderRadius: theme.borderRadius.md,
        overflow: 'hidden',
    },
    linkGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: theme.spacing.md,
    },
    linkIcon: {
        fontSize: 24,
        marginRight: theme.spacing.md,
    },
    linkText: {
        color: '#FFF',
        fontWeight: '600',
        fontSize: 16,
    },
    copyright: {
        color: theme.colors.textMuted,
        fontSize: 12,
        marginTop: theme.spacing.xl,
    },
});

export default SettingsModal;
