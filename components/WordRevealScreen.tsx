import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useGame } from '@/contexts/GameContext';
import { getRandomWord } from '@/data/words';
import { Eye, RotateCcw } from 'lucide-react-native';
import Animated, { FadeInDown, BounceIn, useSharedValue, useAnimatedStyle, withTiming, withSequence } from 'react-native-reanimated';

interface WordRevealScreenProps {
  onWordRevealed: () => void;
}

export function WordRevealScreen({ onWordRevealed }: WordRevealScreenProps) {
  const { settings, setCurrentWord, startGame } = useGame();
  const [currentWord, setDisplayWord] = useState(getRandomWord());
  const [countdown, setCountdown] = useState(3);
  const [showWord, setShowWord] = useState(false);
  
  const scaleValue = useSharedValue(1);
  const rotateValue = useSharedValue(0);

  const currentTeam = settings.teams[settings.currentTeamIndex];
  const drawer = `Jugador ${settings.currentPlayerIndex + 1}`;

  useEffect(() => {
    if (showWord && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
        scaleValue.value = withSequence(
          withTiming(1.2, { duration: 200 }),
          withTiming(1, { duration: 200 })
        );
      }, 1000);

      return () => clearTimeout(timer);
    } else if (showWord && countdown === 0) {
      const timer = setTimeout(() => {
        setCurrentWord(currentWord);
        startGame();
        onWordRevealed();
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [countdown, showWord]);

  const handleRevealWord = () => {
    setShowWord(true);
    setCountdown(3);
  };

  const handleNewWord = () => {
    const newWord = getRandomWord();
    setDisplayWord(newWord);
    rotateValue.value = withTiming(rotateValue.value + 360, { duration: 500 });
  };

  const animatedCountdownStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleValue.value }],
  }));

  const animatedRotateStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotateValue.value}deg` }],
  }));

  return (
    <View style={styles.container}>
      <Animated.View entering={FadeInDown.delay(200)} style={styles.header}>
        <Text style={styles.title}>Turno de Dibujar</Text>
      </Animated.View>

      <Animated.View entering={BounceIn.delay(400)} style={styles.teamContainer}>
        <View style={[styles.teamColor, { backgroundColor: currentTeam.color }]} />
        <View style={styles.teamInfo}>
          <Text style={styles.teamName}>{currentTeam.name}</Text>
          <Text style={styles.drawerName}>{drawer}</Text>
        </View>
      </Animated.View>

      <View style={styles.wordSection}>
        {!showWord ? (
          <Animated.View entering={FadeInDown.delay(600)} style={styles.wordRevealContainer}>
            <Text style={styles.instruction}>
              Solo el dibujante debe ver la palabra
            </Text>
            
            <View style={styles.wordPreview}>
              <Text style={styles.hiddenWord}>••••••••</Text>
              <Text style={styles.wordMeta}>
                {currentWord.category} • {currentWord.points} punto{currentWord.points !== 1 ? 's' : ''}
              </Text>
            </View>

            <View style={styles.wordActions}>
              <TouchableOpacity style={styles.newWordButton} onPress={handleNewWord}>
                <Animated.View style={animatedRotateStyle}>
                  <RotateCcw size={20} color="#F97316" strokeWidth={2} />
                </Animated.View>
                <Text style={styles.newWordText}>Nueva Palabra</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.revealButton} onPress={handleRevealWord}>
                <Eye size={24} color="#FFFFFF" strokeWidth={2} />
                <Text style={styles.revealButtonText}>Ver Palabra</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        ) : (
          <View style={styles.countdownContainer}>
            {countdown > 0 ? (
              <Animated.View style={[styles.countdownCircle, animatedCountdownStyle]}>
                <Text style={styles.countdownText}>{countdown}</Text>
              </Animated.View>
            ) : (
              <Animated.View entering={BounceIn} style={styles.startContainer}>
                <Text style={styles.startText}>¡Comienza a dibujar!</Text>
                <Text style={styles.currentWordDisplay}>{currentWord.word}</Text>
              </Animated.View>
            )}
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  teamContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 48,
  },
  teamColor: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 16,
  },
  teamInfo: {
    alignItems: 'center',
  },
  teamName: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  drawerName: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
    marginTop: 4,
  },
  wordSection: {
    flex: 1,
    justifyContent: 'center',
  },
  wordRevealContainer: {
    alignItems: 'center',
  },
  instruction: {
    fontSize: 18,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
    textAlign: 'center',
    marginBottom: 32,
  },
  wordPreview: {
    backgroundColor: '#1F2937',
    padding: 32,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 32,
    minWidth: 200,
  },
  hiddenWord: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: '#374151',
    letterSpacing: 4,
  },
  wordMeta: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
    marginTop: 8,
    textTransform: 'capitalize',
  },
  wordActions: {
    gap: 16,
    width: '100%',
    maxWidth: 300,
  },
  newWordButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1F2937',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
    borderWidth: 2,
    borderColor: '#F97316',
  },
  newWordText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#F97316',
  },
  revealButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3B82F6',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  revealButtonText: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  countdownContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  countdownCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  countdownText: {
    fontSize: 48,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  startContainer: {
    alignItems: 'center',
  },
  startText: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#10B981',
    textAlign: 'center',
    marginBottom: 16,
  },
  currentWordDisplay: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    textAlign: 'center',
    backgroundColor: '#1F2937',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
});