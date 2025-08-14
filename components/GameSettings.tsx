import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useGame } from '@/contexts/GameContext';
import { Clock, Target, RotateCcw, Settings as SettingsIcon } from 'lucide-react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';

const TIME_OPTIONS = [30, 45, 60, 90, 120];
const SCORE_OPTIONS = [10, 15, 20, 25, 30];

export function GameSettings() {
  const { settings, updateSettings, resetGame } = useGame();

  const handleTimeChange = (time: number) => {
    updateSettings({ roundTime: time });
  };

  const handleMaxScoreChange = (maxScore: number) => {
    updateSettings({ maxScore });
  };

  const handleResetGame = () => {
    Alert.alert(
      'Reiniciar Juego',
      '¿Estás seguro de que quieres reiniciar el juego? Se perderán todos los puntos.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Reiniciar',
          style: 'destructive',
          onPress: resetGame,
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Animated.View entering={FadeInUp} style={styles.header}>
        <SettingsIcon size={24} color="#3B82F6" strokeWidth={2} />
        <Text style={styles.title}>Configuración del Juego</Text>
      </Animated.View>

      {/* Round Time Settings */}
      <Animated.View entering={FadeInUp.delay(200)} style={styles.section}>
        <View style={styles.sectionHeader}>
          <Clock size={20} color="#10B981" strokeWidth={2} />
          <Text style={styles.sectionTitle}>Tiempo por Ronda</Text>
        </View>
        
        <View style={styles.optionsContainer}>
          {TIME_OPTIONS.map((time) => (
            <TouchableOpacity
              key={time}
              style={[
                styles.optionButton,
                settings.roundTime === time && styles.selectedOption,
              ]}
              onPress={() => handleTimeChange(time)}
            >
              <Text
                style={[
                  styles.optionText,
                  settings.roundTime === time && styles.selectedOptionText,
                ]}
              >
                {time}s
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </Animated.View>

      {/* Max Score Settings */}
      <Animated.View entering={FadeInUp.delay(400)} style={styles.section}>
        <View style={styles.sectionHeader}>
          <Target size={20} color="#F97316" strokeWidth={2} />
          <Text style={styles.sectionTitle}>Puntuación Máxima</Text>
        </View>
        
        <View style={styles.optionsContainer}>
          {SCORE_OPTIONS.map((score) => (
            <TouchableOpacity
              key={score}
              style={[
                styles.optionButton,
                settings.maxScore === score && styles.selectedOption,
              ]}
              onPress={() => handleMaxScoreChange(score)}
            >
              <Text
                style={[
                  styles.optionText,
                  settings.maxScore === score && styles.selectedOptionText,
                ]}
              >
                {score}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </Animated.View>

      {/* Current Settings Summary */}
      <Animated.View entering={FadeInUp.delay(600)} style={styles.summarySection}>
        <Text style={styles.summaryTitle}>Configuración Actual</Text>
        
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Tiempo por ronda:</Text>
            <Text style={styles.summaryValue}>{settings.roundTime} segundos</Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Puntuación para ganar:</Text>
            <Text style={styles.summaryValue}>{settings.maxScore} puntos</Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Equipos configurados:</Text>
            <Text style={styles.summaryValue}>{settings.teams.length}</Text>
          </View>
        </View>
      </Animated.View>

      {/* Reset Game */}
      <Animated.View entering={FadeInUp.delay(800)} style={styles.resetSection}>
        <TouchableOpacity style={styles.resetButton} onPress={handleResetGame}>
          <RotateCcw size={20} color="#EF4444" strokeWidth={2} />
          <Text style={styles.resetButtonText}>Reiniciar Juego</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionButton: {
    backgroundColor: '#374151',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    minWidth: 60,
    alignItems: 'center',
  },
  selectedOption: {
    backgroundColor: '#3B82F6',
  },
  optionText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#9CA3AF',
  },
  selectedOptionText: {
    color: '#FFFFFF',
  },
  summarySection: {
    marginBottom: 32,
  },
  summaryTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  summaryCard: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  summaryLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
  },
  summaryValue: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  resetSection: {
    alignItems: 'center',
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1F2937',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
    borderWidth: 2,
    borderColor: '#EF4444',
  },
  resetButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#EF4444',
  },
});