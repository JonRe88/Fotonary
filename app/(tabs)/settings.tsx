import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { useGame } from '@/contexts/GameContext';
import { TeamSetup } from '@/components/TeamSetup';
import { GameSettings as GameSettingsComponent } from '@/components/GameSettings';

export default function SettingsTab() {
  const [activeSection, setActiveSection] = useState<'teams' | 'game'>('teams');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Configuración</Text>
      </View>
      
      <View style={styles.navigation}>
        <View style={styles.navButtons}>
          <Text 
            style={[styles.navButton, activeSection === 'teams' && styles.activeNavButton]}
            onPress={() => setActiveSection('teams')}
          >
            Equipos
          </Text>
          <Text 
            style={[styles.navButton, activeSection === 'game' && styles.activeNavButton]}
            onPress={() => setActiveSection('game')}
          >
            Juego
          </Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeSection === 'teams' ? <TeamSetup /> : <GameSettingsComponent />}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
  },
  header: {
    padding: 24,
    paddingBottom: 16,
  },
  title: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  navigation: {
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  navButtons: {
    flexDirection: 'row',
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 4,
  },
  navButton: {
    flex: 1,
    textAlign: 'center',
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#9CA3AF',
    borderRadius: 8,
  },
  activeNavButton: {
    backgroundColor: '#3B82F6',
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
});