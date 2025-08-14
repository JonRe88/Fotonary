import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useGame } from '@/contexts/GameContext';
import { Team } from '@/types/game';
import { Plus, Trash2, CreditCard as Edit3, Users } from 'lucide-react-native';
import Animated, { FadeInRight, BounceIn } from 'react-native-reanimated';

const TEAM_COLORS = ['#3B82F6', '#10B981', '#F97316', '#EF4444', '#8B5CF6', '#F59E0B'];

export function TeamSetup() {
  const { settings, updateSettings } = useGame();
  const [editingTeam, setEditingTeam] = useState<string | null>(null);
  const [teamName, setTeamName] = useState('');
  const [addingPlayer, setAddingPlayer] = useState<string | null>(null);
  const [playerName, setPlayerName] = useState('');

  const addTeam = () => {
    if (settings.teams.length >= 6) {
      Alert.alert('Máximo alcanzado', 'Puedes tener máximo 6 equipos');
      return;
    }

    const usedColors = settings.teams.map(team => team.color);
    const availableColor = TEAM_COLORS.find(color => !usedColors.includes(color)) || TEAM_COLORS[0];

    const newTeam: Team = {
      id: Date.now().toString(),
      name: `Equipo ${settings.teams.length + 1}`,
      color: availableColor,
      score: 0,
      players: [],
    };

    updateSettings({
      teams: [...settings.teams, newTeam],
    });
  };

  const removeTeam = (teamId: string) => {
    if (settings.teams.length <= 2) {
      Alert.alert('Mínimo requerido', 'Necesitas al menos 2 equipos para jugar');
      return;
    }

    Alert.alert(
      'Eliminar Equipo',
      '¿Estás seguro de que quieres eliminar este equipo?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            const newTeams = settings.teams.filter(team => team.id !== teamId);
            updateSettings({ teams: newTeams });
          },
        },
      ]
    );
  };

  const updateTeamName = (teamId: string, name: string) => {
    const updatedTeams = settings.teams.map(team =>
      team.id === teamId ? { ...team, name } : team
    );
    updateSettings({ teams: updatedTeams });
    setEditingTeam(null);
    setTeamName('');
  };

  const addPlayer = (teamId: string, playerName: string) => {
    if (!playerName.trim()) return;

    const updatedTeams = settings.teams.map(team =>
      team.id === teamId 
        ? { ...team, players: [...team.players, playerName.trim()] }
        : team
    );
    updateSettings({ teams: updatedTeams });
    setAddingPlayer(null);
    setPlayerName('');
  };

  const removePlayer = (teamId: string, playerIndex: number) => {
    const updatedTeams = settings.teams.map(team =>
      team.id === teamId
        ? { ...team, players: team.players.filter((_, index) => index !== playerIndex) }
        : team
    );
    updateSettings({ teams: updatedTeams });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Configuración de Equipos</Text>
        
        <TouchableOpacity style={styles.addTeamButton} onPress={addTeam}>
          <Plus size={20} color="#FFFFFF" strokeWidth={2} />
          <Text style={styles.addTeamText}>Agregar Equipo</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.teamsContainer}>
        {settings.teams.map((team, index) => (
          <Animated.View 
            key={team.id} 
            entering={FadeInRight.delay(index * 100)}
            style={[styles.teamCard, { borderLeftColor: team.color }]}
          >
            <View style={styles.teamHeader}>
              <View style={styles.teamTitleContainer}>
                <View style={[styles.teamColor, { backgroundColor: team.color }]} />
                {editingTeam === team.id ? (
                  <TextInput
                    style={styles.teamNameInput}
                    value={teamName}
                    onChangeText={setTeamName}
                    onSubmitEditing={() => updateTeamName(team.id, teamName)}
                    onBlur={() => updateTeamName(team.id, teamName)}
                    autoFocus
                    placeholder="Nombre del equipo"
                    placeholderTextColor="#9CA3AF"
                  />
                ) : (
                  <Text style={styles.teamName}>{team.name}</Text>
                )}
              </View>

              <View style={styles.teamActions}>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => {
                    setEditingTeam(team.id);
                    setTeamName(team.name);
                  }}
                >
                  <Edit3 size={16} color="#9CA3AF" strokeWidth={2} />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => removeTeam(team.id)}
                >
                  <Trash2 size={16} color="#EF4444" strokeWidth={2} />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.playersSection}>
              <View style={styles.playersHeader}>
                <Users size={16} color="#9CA3AF" strokeWidth={2} />
                <Text style={styles.playersLabel}>
                  Jugadores ({team.players.length})
                </Text>
              </View>

              <View style={styles.playersList}>
                {team.players.map((player, playerIndex) => (
                  <Animated.View 
                    key={playerIndex} 
                    entering={BounceIn.delay(playerIndex * 50)}
                    style={styles.playerChip}
                  >
                    <Text style={styles.playerName}>{player}</Text>
                    <TouchableOpacity 
                      onPress={() => removePlayer(team.id, playerIndex)}
                      style={styles.removePlayerButton}
                    >
                      <Trash2 size={12} color="#EF4444" strokeWidth={2} />
                    </TouchableOpacity>
                  </Animated.View>
                ))}

                {addingPlayer === team.id ? (
                  <TextInput
                    style={styles.playerInput}
                    value={playerName}
                    onChangeText={setPlayerName}
                    onSubmitEditing={() => addPlayer(team.id, playerName)}
                    onBlur={() => {
                      if (playerName.trim()) {
                        addPlayer(team.id, playerName);
                      } else {
                        setAddingPlayer(null);
                        setPlayerName('');
                      }
                    }}
                    autoFocus
                    placeholder="Nombre del jugador"
                    placeholderTextColor="#9CA3AF"
                  />
                ) : (
                  <TouchableOpacity
                    style={styles.addPlayerButton}
                    onPress={() => {
                      setAddingPlayer(team.id);
                      setPlayerName('');
                    }}
                  >
                    <Plus size={16} color="#3B82F6" strokeWidth={2} />
                    <Text style={styles.addPlayerText}>Agregar Jugador</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </Animated.View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  addTeamButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3B82F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 4,
  },
  addTeamText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  teamsContainer: {
    gap: 16,
  },
  teamCard: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
  },
  teamHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  teamTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  teamColor: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 12,
  },
  teamName: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  teamNameInput: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    backgroundColor: '#374151',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    flex: 1,
  },
  teamActions: {
    flexDirection: 'row',
    gap: 8,
  },
  editButton: {
    padding: 6,
  },
  deleteButton: {
    padding: 6,
  },
  playersSection: {
    marginTop: 8,
  },
  playersHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  playersLabel: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#9CA3AF',
  },
  playersList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  playerChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#374151',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  playerName: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
  },
  removePlayerButton: {
    padding: 2,
  },
  playerInput: {
    backgroundColor: '#374151',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
    minWidth: 120,
  },
  addPlayerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#374151',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
    borderWidth: 1,
    borderColor: '#3B82F6',
    borderStyle: 'dashed',
  },
  addPlayerText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#3B82F6',
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
});