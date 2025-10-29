import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useGame } from '@/contexts/GameContext';
import { DrawingCanvas } from '@/components/DrawingCanvas';
import { GameTimer } from '@/components/GameTimer';
import { Check, X, Pause, Play } from 'lucide-react-native';
import Animated, { FadeInRight, FadeInLeft } from 'react-native-reanimated';

interface GameScreenProps {
  onRoundEnd: () => void;
}

export function GameScreen({ onRoundEnd }: GameScreenProps) {
  const { 
    gameState, 
    settings, 
    pauseGame, 
    resumeGame, 
    endRound, 
    updateTimeLeft 
  } = useGame();
  
  const timerRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (gameState.isPlaying && !gameState.isPaused) {
      timerRef.current = setInterval(() => {
        updateTimeLeft(Math.max(0, gameState.timeLeft - 1));
        
        if (gameState.timeLeft <= 1) {
          handleTimeUp();
        }
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [gameState.isPlaying, gameState.isPaused, gameState.timeLeft]);

  const handleTimeUp = () => {
    Alert.alert(
      '¡Se acabó el tiempo!',
      '¿El equipo logró adivinar la palabra?',
      [
        { text: 'No', onPress: () => handleRoundEnd(false) },
        { text: 'Sí', onPress: () => handleRoundEnd(true) },
      ]
    );
  };

  const handleRoundEnd = (scored: boolean) => {
    endRound(scored);
    onRoundEnd();
  };

  const handlePauseToggle = () => {
    if (gameState.isPaused) {
      resumeGame();
    } else {
      pauseGame();
    }
  };

  const currentTeam = settings.teams[settings.currentTeamIndex];
  const drawer = `Jugador ${settings.currentPlayerIndex + 1}`;

  return (
    <View style={styles.container}>
      {/* Header */}
      <Animated.View entering={FadeInLeft} style={styles.header}>
        <View style={styles.teamInfo}>
          <View style={[styles.teamColor, { backgroundColor: currentTeam.color }]} />
          <View>
            <Text style={styles.teamName}>{currentTeam.name}</Text>
            <Text style={styles.drawerName}>Dibuja: {drawer}</Text>
          </View>
        </View>
        
        <TouchableOpacity 
          style={styles.pauseButton}
          onPress={handlePauseToggle}
        >
          {gameState.isPaused ? (
            <Play size={20} color="#FFFFFF" strokeWidth={2} />
          ) : (
            <Pause size={20} color="#FFFFFF" strokeWidth={2} />
          )}
        </TouchableOpacity>
      </Animated.View>

      {/* Word Display */}
      <Animated.View entering={FadeInRight.delay(200)} style={styles.wordContainer}>
        <Text style={styles.wordLabel}>Palabra a dibujar:</Text>
        <Text style={styles.word}>{gameState.currentWord?.word || '---'}</Text>
        <Text style={styles.wordCategory}>
          {gameState.currentWord?.category} • {gameState.currentWord?.points} punto{gameState.currentWord?.points !== 1 ? 's' : ''}
        </Text>
      </Animated.View>

      {/* Timer */}
      <GameTimer />

      {/* Drawing Canvas */}
      <View style={styles.canvasContainer}>
        <DrawingCanvas disabled={gameState.isPaused} />
      </View>

      {/* Action Buttons */}
      <Animated.View entering={FadeInLeft.delay(400)} style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.actionButton, styles.failButton]}
          onPress={() => handleRoundEnd(false)}
        >
          <X size={24} color="#FFFFFF" strokeWidth={2} />
          <Text style={styles.actionButtonText}>No Adivinó</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.successButton]}
          onPress={() => handleRoundEnd(true)}
        >
          <Check size={22} color="#FFFFFF" strokeWidth={2} />
          <Text style={styles.actionButtonText}>¡Adivinó!</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#1F2937',
  },
  teamInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  teamColor: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 12,
  },
  teamName: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  drawerName: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
  },
  pauseButton: {
    backgroundColor: '#374151',
    padding: 12,
    borderRadius: 8,
  },
  wordContainer: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#1F2937',
    margin: 16,
    borderRadius: 12,
  },
  wordLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
  },
  word: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginTop: 4,
    textAlign: 'center',
  },
  wordCategory: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
    marginTop: 2,
    textTransform: 'capitalize',
  },
  canvasContainer: {
    flex: 1,
    margin: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    padding: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  failButton: {
    backgroundColor: '#EF4444',
  },
  successButton: {
    backgroundColor: '#10B981',
  },
  actionButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
});
