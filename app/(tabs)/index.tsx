import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { useGame } from '@/contexts/GameContext';
import { WelcomeScreen } from '@/components/WelcomeScreen';
import { GameScreen } from '@/components/GameScreen';
import { WordRevealScreen } from '@/components/WordRevealScreen';
import { RoundEndScreen } from '@/components/RoundEndScreen';

export default function GameTab() {
  const { gameState, settings } = useGame();
  const [gamePhase, setGamePhase] = useState<'welcome' | 'word-reveal' | 'playing' | 'round-end'>('welcome');

  const handleStartRound = () => {
    setGamePhase('word-reveal');
  };

  const handleWordRevealed = () => {
    setGamePhase('playing');
  };

  const handleRoundEnd = () => {
    setGamePhase('round-end');
  };

  const handleNextRound = () => {
    setGamePhase('word-reveal');
  };

  const handleBackToMenu = () => {
    setGamePhase('welcome');
  };

  const renderScreen = () => {
    switch (gamePhase) {
      case 'welcome':
        return <WelcomeScreen onStartRound={handleStartRound} />;
      case 'word-reveal':
        return <WordRevealScreen onWordRevealed={handleWordRevealed} />;
      case 'playing':
        return <GameScreen onRoundEnd={handleRoundEnd} />;
      case 'round-end':
        return <RoundEndScreen onNextRound={handleNextRound} onBackToMenu={handleBackToMenu} />;
      default:
        return <WelcomeScreen onStartRound={handleStartRound} />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {renderScreen()}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
  },
  content: {
    flex: 1,
  },
});