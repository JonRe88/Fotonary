import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useGame } from '@/contexts/GameContext';
import { Play, Users, Clock } from 'lucide-react-native';
import Animated, { FadeInUp, BounceIn } from 'react-native-reanimated';

interface WelcomeScreenProps {
  onStartRound: () => void;
}

export function WelcomeScreen({ onStartRound }: WelcomeScreenProps) {
  const { settings } = useGame();
  const canStart = settings.teams.length >= 2 && settings.teams.every(team => team.players.length > 0);

  return (
    <View style={styles.container}>
      <Animated.View entering={FadeInUp.delay(200)} style={styles.header}>
        <Text style={styles.title}>🎨 Fotonary</Text>
        <Text style={styles.subtitle}>¡Dibuja, adivina y gana!</Text>
      </Animated.View>

      <Animated.View entering={FadeInUp.delay(400)} style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Users size={32} color="#3B82F6" strokeWidth={2} />
          <Text style={styles.statValue}>{settings.teams.length}</Text>
          <Text style={styles.statLabel}>Equipos</Text>
        </View>
        
        <View style={styles.statCard}>
          <Clock size={28} color="#10B981" strokeWidth={2} />
          <Text style={styles.statValue}>{settings.roundTime}s</Text>
          <Text style={styles.statLabel}>Por Ronda</Text>
        </View>
      </Animated.View>

      <Animated.View entering={FadeInUp.delay(600)} style={styles.teamsPreview}>
        <Text style={styles.teamsTitle}>Equipos Configurados</Text>
        {settings.teams.map((team, index) => (
          <Animated.View 
            key={team.id} 
            entering={BounceIn.delay(800 + index * 100)}
            style={[styles.teamCard, { borderLeftColor: team.color }]}
          >
            <View style={[styles.teamColor, { backgroundColor: team.color }]} />
            <View style={styles.teamInfo}>
              <Text style={styles.teamName}>{team.name}</Text>
              <Text style={styles.teamPlayers}>
                {team.players.length} jugador{team.players.length !== 1 ? 'es' : ''}
              </Text>
            </View>
            <Text style={styles.teamScore}>{team.score}</Text>
          </Animated.View>
        ))}
      </Animated.View>

      <Animated.View entering={FadeInUp.delay(1000)} style={styles.actionContainer}>
        <TouchableOpacity
          style={[styles.startButton, !canStart && styles.disabledButton]}
          onPress={onStartRound}
          disabled={!canStart}
        >
          <Play size={24} color="#FFFFFF" strokeWidth={2} />
          <Text style={styles.startButtonText}>Iniciar Ronda</Text>
        </TouchableOpacity>
        
        {!canStart && (
          <Text style={styles.warningText}>
            Configura al menos 2 equipos con jugadores para comenzar
          </Text>
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 18,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    marginTop: 16,
  },
  title: {
    fontSize: 38,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginVertical: 22,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#1F2937',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
    marginTop: 4,
  },
  teamsPreview: {
    flex: 1,
  },
  teamsTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  teamCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1F2937',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    borderLeftWidth: 4,
  },
  teamColor: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 12,
  },
  teamInfo: {
    flex: 1,
  },
  teamName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  teamPlayers: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
  },
  teamScore: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#3B82F6',
  },
  actionContainer: {
    alignItems: 'center',
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3B82F6',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 16,
    gap: 8,
  },
  disabledButton: {
    backgroundColor: '#374151',
  },
  startButtonText: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  warningText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#F59E0B',
    textAlign: 'center',
    marginTop: 12,
  },
});
