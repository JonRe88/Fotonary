import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { useGame } from '@/contexts/GameContext';
import { Crown, Award, Users } from 'lucide-react-native';

export default function ResultsTab() {
  const { settings, gameState } = useGame();
  
  const sortedTeams = [...settings.teams].sort((a, b) => b.score - a.score);
  const winningTeam = sortedTeams[0];
  const totalRounds = gameState.roundHistory.length;
  const successfulRounds = gameState.roundHistory.filter(round => round.scored).length;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Resultados</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Winner Section */}
        <View style={styles.winnerSection}>
          <Crown size={48} color="#F59E0B" strokeWidth={2} />
          <Text style={styles.winnerTitle}>¡Equipo Ganador!</Text>
          <View style={[styles.winnerCard, { backgroundColor: winningTeam.color }]}>
            <Text style={styles.winnerName}>{winningTeam.name}</Text>
            <Text style={styles.winnerScore}>{winningTeam.score} puntos</Text>
          </View>
        </View>

        {/* Leaderboard */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tabla de Posiciones</Text>
          {sortedTeams.map((team, index) => (
            <View key={team.id} style={styles.teamRow}>
              <View style={styles.position}>
                <Text style={styles.positionText}>{index + 1}</Text>
              </View>
              <View style={[styles.teamColor, { backgroundColor: team.color }]} />
              <Text style={styles.teamName}>{team.name}</Text>
              <Text style={styles.teamScore}>{team.score}</Text>
            </View>
          ))}
        </View>

        {/* Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Estadísticas</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Users size={32} color="#3B82F6" strokeWidth={2} />
              <Text style={styles.statValue}>{totalRounds}</Text>
              <Text style={styles.statLabel}>Rondas Jugadas</Text>
            </View>
            <View style={styles.statCard}>
              <Award size={32} color="#10B981" strokeWidth={2} />
              <Text style={styles.statValue}>{successfulRounds}</Text>
              <Text style={styles.statLabel}>Palabras Adivinadas</Text>
            </View>
          </View>
        </View>

        {/* Recent Rounds */}
        {gameState.roundHistory.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Últimas Rondas</Text>
            {gameState.roundHistory.slice(-5).reverse().map((round, index) => {
              const team = settings.teams.find(t => t.id === round.teamId);
              return (
                <View key={index} style={styles.roundRow}>
                  <View style={[styles.roundColor, { backgroundColor: team?.color }]} />
                  <View style={styles.roundInfo}>
                    <Text style={styles.roundTeam}>{team?.name}</Text>
                    <Text style={styles.roundWord}>"{round.word}"</Text>
                  </View>
                  <View style={[
                    styles.roundResult,
                    { backgroundColor: round.scored ? '#10B981' : '#EF4444' }
                  ]}>
                    <Text style={styles.roundResultText}>
                      {round.scored ? '✓' : '✗'}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        )}
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
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  winnerSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  winnerTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#F59E0B',
    marginTop: 8,
    marginBottom: 16,
  },
  winnerCard: {
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    minWidth: 200,
  },
  winnerName: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  winnerScore: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginTop: 4,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  teamRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1F2937',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  position: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#374151',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  positionText: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  teamColor: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 12,
  },
  teamName: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  teamScore: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#3B82F6',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#1F2937',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
    marginTop: 4,
    textAlign: 'center',
  },
  roundRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1F2937',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  roundColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 12,
  },
  roundInfo: {
    flex: 1,
  },
  roundTeam: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  roundWord: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
  },
  roundResult: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roundResultText: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
});