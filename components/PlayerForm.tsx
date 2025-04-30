import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useMatch } from '../context/MatchContext';
import { Player, PlayerPosition } from '../types';
import { POSITION_COLORS, SKILL_LEVELS } from '../utils/constants';
import { generateId } from '../utils/teamGenerator';
import { Shield, Star, UserCheck } from 'lucide-react-native';
import Animated, { FadeIn, SlideInRight } from 'react-native-reanimated';

interface PlayerFormProps {
  editPlayer?: Player;
  onComplete?: () => void;
}

const PlayerForm: React.FC<PlayerFormProps> = ({ editPlayer, onComplete }) => {
  const { addPlayer, updatePlayer, players } = useMatch();
  const [name, setName] = useState(editPlayer?.name || '');
  const [position, setPosition] = useState<PlayerPosition>(
    editPlayer?.position || 'Midfielder'
  );
  const [skillLevel, setSkillLevel] = useState(editPlayer?.skillLevel || 3);
  const [error, setError] = useState<string | null>(null);

  const positions: PlayerPosition[] = [
    'Goalkeeper',
    'Defender',
    'Midfielder',
    'Forward',
  ];

  // Find how many goalkeepers we already have (excluding the current player if editing)
  const existingGoalkeepers = players.filter(
    (p) => p.position === 'Goalkeeper' && p.id !== editPlayer?.id
  ).length;

  const handleSubmit = () => {
    // Reset error
    setError(null);

    // Validate name
    if (!name.trim()) {
      setError('Please enter a player name');
      return;
    }

    // Check if we already have two goalkeepers and trying to add another
    if (position === 'Goalkeeper' && existingGoalkeepers >= 2 && !editPlayer) {
      setError('Maximum of 2 goalkeepers reached');
      return;
    }

    const playerData: Player = {
      id: editPlayer?.id || generateId(),
      name: name.trim(),
      position,
      skillLevel,
    };

    if (editPlayer) {
      updatePlayer(playerData);
    } else {
      addPlayer(playerData);
    }

    // Clear form
    if (!editPlayer) {
      setName('');
      setPosition('Midfielder');
      setSkillLevel(3);
    }

    if (onComplete) {
      onComplete();
    }
  };

  return (
    <Animated.View 
      entering={FadeIn.duration(500)}
      style={styles.container}
    >
      <ScrollView>
        <Text style={styles.title}>
          {editPlayer ? 'Edit Player' : 'Add New Player'}
        </Text>

        {error && (
          <Animated.View 
            entering={SlideInRight.duration(300)}
            style={styles.errorContainer}
          >
            <Text style={styles.errorText}>{error}</Text>
          </Animated.View>
        )}

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Player Name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Enter player name"
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Position</Text>
          <View style={styles.positionsContainer}>
            {positions.map((pos) => (
              <TouchableOpacity
                key={pos}
                style={[
                  styles.positionButton,
                  position === pos && styles.selectedPosition,
                  position === pos && { backgroundColor: POSITION_COLORS[pos] },
                  pos === 'Goalkeeper' && existingGoalkeepers >= 2 && !editPlayer
                    ? styles.disabledPosition
                    : null,
                ]}
                onPress={() => setPosition(pos)}
                disabled={pos === 'Goalkeeper' && existingGoalkeepers >= 2 && !editPlayer}
              >
                {pos === 'Goalkeeper' && (
                  <Shield size={18} color={position === pos ? '#fff' : '#666'} />
                )}
                {pos === 'Defender' && (
                  <UserCheck size={18} color={position === pos ? '#fff' : '#666'} />
                )}
                {pos === 'Midfielder' && (
                  <UserCheck size={18} color={position === pos ? '#fff' : '#666'} />
                )}
                {pos === 'Forward' && (
                  <Star size={18} color={position === pos ? '#fff' : '#666'} />
                )}
                <Text
                  style={[
                    styles.positionText,
                    position === pos && styles.selectedPositionText,
                  ]}
                >
                  {pos}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {position === 'Goalkeeper' && (
            <Text style={styles.positionNote}>
              Each team requires exactly one goalkeeper
            </Text>
          )}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Skill Level (1-5)</Text>
          <View style={styles.skillLevelsContainer}>
            {SKILL_LEVELS.map((level) => (
              <TouchableOpacity
                key={level}
                style={[
                  styles.skillButton,
                  skillLevel === level && styles.selectedSkill,
                ]}
                onPress={() => setSkillLevel(level)}
              >
                <Text
                  style={[
                    styles.skillText,
                    skillLevel === level && styles.selectedSkillText,
                  ]}
                >
                  {level}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.skillLabelContainer}>
            <Text style={styles.skillLabelText}>Beginner</Text>
            <Text style={styles.skillLabelText}>Advanced</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>
            {editPlayer ? 'Update Player' : 'Add Player'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
  },
  errorContainer: {
    backgroundColor: '#ffebee',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: '#d32f2f',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: '#444',
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  positionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 8,
  },
  positionButton: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    minWidth: '45%',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  selectedPosition: {
    borderColor: 'transparent',
  },
  disabledPosition: {
    backgroundColor: '#e0e0e0',
    opacity: 0.5,
  },
  positionText: {
    marginLeft: 6,
    fontSize: 14,
    color: '#666',
  },
  selectedPositionText: {
    color: '#fff',
    fontWeight: '500',
  },
  positionNote: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
    marginTop: 4,
  },
  skillLevelsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  skillButton: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  selectedSkill: {
    backgroundColor: '#4c9eeb',
    borderColor: 'transparent',
  },
  skillText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
  },
  selectedSkillText: {
    color: '#fff',
  },
  skillLabelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  skillLabelText: {
    fontSize: 12,
    color: '#666',
  },
  submitButton: {
    backgroundColor: '#4c9eeb',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default PlayerForm;