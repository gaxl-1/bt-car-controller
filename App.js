import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import HomeScreen from './screens/HomeScreen';

/**
 * Main App Component
 * Entry point for the Bluetooth Car Controller app
 */

export default function App() {
  return (
    <PaperProvider>
      <HomeScreen />
    </PaperProvider>
  );
}
