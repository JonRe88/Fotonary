import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useGame } from '@/contexts/GameContext';
import { ArrowRight, RotateCcw, Trophy } from 'lucide-react-native';
import Animated, { FadeInDown, BounceIn } from 'react-native-reanimated';

interface RoundEndScreenProps {
  onNextRound: () => void;
  onBackToMenu: () => void;
}

export function RoundEndScreen({ onNextRound, onBackToMenu }: RoundEndScreenProps) {
  const { settings, gameState, nextTurn, resetGame } = useGame();
  
  const lastRound = gameState.roundHistory[gameState.roundHistory.length - 1];
  const lastTeam = settings.teams.find(team => team.id === lastRound?.teamId);
  const sortedTeams = [...settings.teams].sort((a, b) => b.score - a.score);
  const isGameComplete = sortedTeams[0].score >= settings.maxScore;

  const handleNextRound = () => {
    nextTurn();
    onNextRound();
  };

  const handleNewGame = () => {
    resetGame();
    onBackToMenu();
  };

  if (isGameComplete) {
    const winner = sortedTeams[0];
    
    return (
      <View style={styles.container}>
        <Animated.View entering={BounceIn.delay(200)} style={styles.header}>
          <Trophy size={64} color="#F59E0B" strokeWidth={2} />
          <Text style={styles.gameCompleteTitle}>¡Juego Completado!</Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(400)} style={styles.winnerSection}>
          <Text style={styles.winnerLabel}>🏆 Equipo Ganador</Text>
          <View style={[styles.winnerCard, { backgroundColor: winner.color }]}>
            <Text style={styles.winnerName}>{winner.name}</Text>
            <Text style={styles.winnerScore}>{winner.score} puntos</Text>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(600)} style={styles.finalScores}>
          <Text style={styles.scoresTitle}>Puntuación Final</Text>
          {sortedTeams.map((team, index) => (
            <View key={team.id} style={styles.scoreRow}>
              <Text style={styles.position}>{index + 1}º</Text>
              <View style={[styles.teamColorSmall, { backgroundColor: team.color }]} />
              <Text style={styles.scoreTeamName}>{team.name}</Text>
              <Text style={styles.finalScore}>{team.score}</Text>
            </View>
          ))}
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(800)} style={styles.actions}>
          <TouchableOpacity style={styles.newGameButton} onPress={handleNewGame}>
            <RotateCcw size={20} color="#FFFFFF" strokeWidth={2} />
            <Text style={styles.newGameButtonText}>Nuevo Juego</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Animated.View entering={FadeInDown.delay(200)} style={styles.header}>
        <Text style={styles.roundEndTitle}>Ronda Terminada</Text>
      </Animated.View>

      <Animated.View entering={BounceIn.delay(400)} style={styles.roundResult}>
        <View style={[styles.resultTeamCard, { backgroundColor: lastTeam?.color }]}>
          <Text style={styles.resultTeamName}>{lastTeam?.name}</Text>
          <Text style={styles.resultWord}>"{lastRound?.word}"</Text>
          <Text style={[
            styles.resultStatus,
            lastRound?.scored ? styles.successResult : styles.failResult
          ]}>
            {lastRound?.scored ? '✅ ¡Adivinado!' : '❌ No adivinado'}
          </Text>
        </View>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(600)} style={styles.currentScores}>
        <Text style={styles.scoresTitle}>Puntuaciones Actuales</Text>
        {sortedTeams.map((team) => (
          <View key={team.id} style={styles.scoreRow}>
            <View style={[styles.teamColorSmall, { backgroundColor: team.color }]} />
            <Text style={styles.scoreTeamName}>{team.name}</Text>
            <Text style={styles.currentScore}>{team.score}</Text>
          </View>
        ))}
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(800)} style={styles.actions}>
        <TouchableOpacity style={styles.nextButton} onPress={handleNextRound}>
          <Text style={styles.nextButtonText}>Siguiente Turno</Text>
          <ArrowRight size={20} color="#FFFFFF" strokeWidth={2} />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.menuButton} onPress={onBackToMenu}>
          <Text style={styles.menuButtonText}>Volver al Menú</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
    padding: 24,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  roundEndTitle: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  gameCompleteTitle: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: '#F59E0B',
    textAlign: 'center',
    marginTop: 16,
  },
  roundResult: {
    alignItems: 'center',
    marginBottom: 32,
  },
  resultTeamCard: {
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    minWidth: 250,
  },
  resultTeamName: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  resultWord: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginVertical: 8,
  },
  resultStatus: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  successResult: {
    color: '#FFFFFF',
  },
  failResult: {
    color: '#FFFFFF',
  },
  winnerSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  winnerLabel: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#F59E0B',
    marginBottom: 16,
  },
  winnerCard: {
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    minWidth: 200,
  },
  winnerName: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  winnerScore: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginTop: 4,
  },
  currentScores: {
    marginBottom: 32,
  },
  finalScores: {
    marginBottom: 32,
  },
  scoresTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 16,
    textAlign: 'center',
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1F2937',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  position: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#F59E0B',
    width: 32,
  },
  teamColorSmall: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 12,
  },
  scoreTeamName: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  currentScore: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#3B82F6',
  },
  finalScore: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  actions: {
    gap: 12,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3B82F6',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  nextButtonText: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  newGameButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10B981',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  newGameButtonText: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  menuButton: {
    alignItems: 'center',
    backgroundColor: '#374151',
    paddingVertical: 12,
    borderRadius: 8,
  },
  menuButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#9CA3AF',
  },
});