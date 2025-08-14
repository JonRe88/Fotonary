import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useGame } from '@/contexts/GameContext';
import { Clock, TriangleAlert as AlertTriangle } from 'lucide-react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withSequence,
  interpolateColor,
  Easing
} from 'react-native-reanimated';

export function GameTimer() {
  const { gameState, settings } = useGame();
  
  const progress = useSharedValue(1);
  const pulseScale = useSharedValue(1);
  const warningOpacity = useSharedValue(0);

  useEffect(() => {
    const timeProgress = gameState.timeLeft / settings.roundTime;
    progress.value = withTiming(timeProgress, { duration: 300 });

    // Warning animation when time is low
    if (gameState.timeLeft <= 10) {
      warningOpacity.value = withTiming(1, { duration: 200 });
      pulseScale.value = withSequence(
        withTiming(1.1, { duration: 200, easing: Easing.out(Easing.quad) }),
        withTiming(1, { duration: 200, easing: Easing.out(Easing.quad) })
      );
    } else {
      warningOpacity.value = withTiming(0, { duration: 200 });
      pulseScale.value = withTiming(1, { duration: 200 });
    }
  }, [gameState.timeLeft, settings.roundTime]);

  const animatedTimerStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      progress.value,
      [0, 0.3, 1],
      ['#EF4444', '#F97316', '#10B981']
    );

    return {
      width: `${progress.value * 100}%`,
      backgroundColor,
    };
  });

  const animatedContainerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
  }));

  const animatedWarningStyle = useAnimatedStyle(() => ({
    opacity: warningOpacity.value,
  }));

  const isLowTime = gameState.timeLeft <= 10;
  const minutes = Math.floor(gameState.timeLeft / 60);
  const seconds = gameState.timeLeft % 60;

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.timerContainer, animatedContainerStyle]}>
        <View style={styles.timerHeader}>
          <Clock size={20} color="#FFFFFF" strokeWidth={2} />
          <Text style={styles.timerLabel}>Tiempo Restante</Text>
          {isLowTime && (
            <Animated.View style={animatedWarningStyle}>
              <AlertTriangle size={20} color="#F59E0B" strokeWidth={2} />
            </Animated.View>
          )}
        </View>

        <View style={styles.timerDisplay}>
          <Text style={[styles.timerText, isLowTime && styles.warningText]}>
            {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
          </Text>
        </View>

        <View style={styles.progressBarContainer}>
          <Animated.View style={[styles.progressBar, animatedTimerStyle]} />
        </View>
      </Animated.View>

      {gameState.isPaused && (
        <Animated.View entering={Animated.FadeInUp} style={styles.pausedOverlay}>
          <Text style={styles.pausedText}>⏸️ PAUSADO</Text>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 16,
    marginBottom: 8,
  },
  timerContainer: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 16,
  },
  timerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 12,
  },
  timerLabel: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#9CA3AF',
  },
  timerDisplay: {
    alignItems: 'center',
    marginBottom: 16,
  },
  timerText: {
    fontSize: 48,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  warningText: {
    color: '#EF4444',
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#374151',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  pausedOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  pausedText: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#F59E0B',
  },
});