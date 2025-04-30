import React from 'react';
import { View, Text, StyleSheet, Dimensions, Image, Platform } from 'react-native';
import { Match, Player, FieldPosition } from '../types';
import { FIELD_POSITIONS, POSITION_COLORS, TEAM_COLORS } from '../utils/constants';
import Animated, { FadeIn } from 'react-native-reanimated';

interface FootballFieldProps {
  match: Match;
}

const FootballField: React.FC<FootballFieldProps> = ({ match }) => {
  const fieldPositions = FIELD_POSITIONS[match.format];
  
  const findPlayerForPosition = (
    position: FieldPosition,
    team: 'teamA' | 'teamB'
  ): Player | undefined => {
    const teamPlayers = team === 'teamA' ? match.teamA.players : match.teamB.players;
    const exactPositionPlayers = teamPlayers.filter(
      (p) => p.position === position.position
    );
    return exactPositionPlayers[0];
  };

  const renderPlayer = (position: FieldPosition, index: number) => {
    const player = findPlayerForPosition(position, position.team);
    if (!player) return null;
    
    const teamColor = position.team === 'teamA' ? TEAM_COLORS.teamA : TEAM_COLORS.teamB;
    const positionColor = POSITION_COLORS[position.position];
    
    return (
      <Animated.View
        key={`${position.team}-${index}`}
        entering={FadeIn.delay(100 * index).duration(500)}
        style={[
          styles.playerMarker,
          {
            left: `${position.x}%`,
            top: `${position.y}%`,
            backgroundColor: teamColor,
            borderColor: positionColor,
          },
        ]}
      >
        <Text style={styles.playerNumber}>{player.position.charAt(0)}</Text>
        <View style={styles.playerNameContainer}>
          <Text style={styles.playerName}>{player.name}</Text>
          <Text style={styles.playerSkill}>Skill: {player.skillLevel}</Text>
        </View>
      </Animated.View>
    );
  };

  const calculateTeamAverage = (team: 'teamA' | 'teamB') => {
    const players = team === 'teamA' ? match.teamA.players : match.teamB.players;
    const total = players.reduce((sum, player) => sum + player.skillLevel, 0);
    return (total / players.length).toFixed(1);
  };

  return (
    <View style={styles.container}>
      <View style={styles.teamsContainer}>
        <View style={styles.teamSection}>
          <View style={[styles.teamHeader, { backgroundColor: TEAM_COLORS.teamA }]}>
            <Text style={styles.teamName}>{match.teamA.name}</Text>
            <Text style={styles.teamAvg}>Avg. Skill: {calculateTeamAverage('teamA')}</Text>
          </View>
          {match.teamA.players.map((player) => (
            <View key={player.id} style={styles.playerRow}>
              <Text style={styles.playerRowName}>{player.name}</Text>
              <Text style={styles.playerRowPosition}>{player.position}</Text>
              <Text style={styles.playerRowSkill}>Skill: {player.skillLevel}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.fieldContainer}>
        <Image
          source={require('../assets/images/football-field.png')}
          style={styles.fieldImage}
          resizeMode="contain"
        />
        <View style={styles.playersOverlay}>
          {fieldPositions.teamA.map((position, index) => renderPlayer(position, index))}
          {fieldPositions.teamB.map((position, index) => renderPlayer(position, index))}
        </View>
      </View>

      <View style={styles.teamsContainer}>
        <View style={styles.teamSection}>
          <View style={[styles.teamHeader, { backgroundColor: TEAM_COLORS.teamB }]}>
            <Text style={styles.teamName}>{match.teamB.name}</Text>
            <Text style={styles.teamAvg}>Avg. Skill: {calculateTeamAverage('teamB')}</Text>
          </View>
          {match.teamB.players.map((player) => (
            <View key={player.id} style={styles.playerRow}>
              <Text style={styles.playerRowName}>{player.name}</Text>
              <Text style={styles.playerRowPosition}>{player.position}</Text>
              <Text style={styles.playerRowSkill}>Skill: {player.skillLevel}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

const { width } = Dimensions.get('window');
const fieldWidth = Math.min(width - 32, 400);
const fieldHeight = fieldWidth * 1.4;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingBottom: 100, // Add padding to avoid overlap with buttons
  },
  teamsContainer: {
    paddingHorizontal: 16,
    marginVertical: 10,
  },
  teamSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  teamHeader: {
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  teamName: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  teamAvg: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  playerRow: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    alignItems: 'center',
  },
  playerRowName: {
    flex: 2,
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  playerRowPosition: {
    flex: 1,
    fontSize: 14,
    color: '#666',
    fontFamily: 'Inter-Regular',
  },
  playerRowSkill: {
    flex: 1,
    fontSize: 14,
    textAlign: 'right',
    color: '#666',
    fontFamily: 'Inter-Regular',
  },
  fieldContainer: {
    width: fieldWidth,
    height: fieldHeight,
    alignSelf: 'center',
    marginVertical: 20,
    position: 'relative',
  },
  fieldImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  playersOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  playerMarker: {
    position: 'absolute',
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    transform: [{ translateX: -17 }, { translateY: -17 }],
    zIndex: 10,
  },
  playerNumber: {
    color: '#fff',
    fontFamily: 'Inter-Bold',
    fontSize: 14,
  },
  playerNameContainer: {
    position: 'absolute',
    top: 36,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    alignItems: 'center',
    minWidth: 80,
  },
  playerName: {
    color: '#fff',
    fontSize: 10,
    fontFamily: 'Inter-Medium',
    textAlign: 'center',
  },
  playerSkill: {
    color: '#ddd',
    fontSize: 8,
    fontFamily: 'Inter-Regular',
  },
});

export default FootballField;