import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import { useMatch } from '../context/MatchContext';
import { Player, PlayerPosition } from '../types';
import { POSITION_COLORS, getTeamSize } from '../utils/constants';
import { CreditCard as Edit, X } from 'lucide-react-native';
import PlayerForm from './PlayerForm';
import Animated, { FadeIn, SlideInLeft } from 'react-native-reanimated';

const PlayerList: React.FC = () => {
  const { players, removePlayer, currentFormat } = useMatch();
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);

  const handleDelete = (player: Player) => {
    Alert.alert(
      'Remove Player',
      `Are you sure you want to remove ${player.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Remove', onPress: () => removePlayer(player.id), style: 'destructive' },
      ]
    );
  };

  const handleEdit = (player: Player) => {
    setEditingPlayer(player);
  };

  const handleEditComplete = () => {
    setEditingPlayer(null);
  };

  const getPositionColor = (position: PlayerPosition) => {
    return POSITION_COLORS[position];
  };

  const renderPositionCount = () => {
    const counts: Record<PlayerPosition, number> = {
      Goalkeeper: 0,
      Defender: 0,
      Midfielder: 0,
      Forward: 0,
    };

    players.forEach((player) => {
      counts[player.position]++;
    });

    const teamSize = getTeamSize(currentFormat);
    const totalRequired = teamSize * 2;
    const currentTotal = players.length;
    
    return (
      <View style={styles.positionCountContainer}>
        <Text style={styles.countTitle}>
          Players: {currentTotal}/{totalRequired}
        </Text>
        <View style={styles.countsRow}>
          {Object.entries(counts).map(([position, count]) => (
            <View key={position} style={styles.countItem}>
              <View
                style={[
                  styles.countBadge,
                  { backgroundColor: getPositionColor(position as PlayerPosition) },
                ]}
              >
                <Text style={styles.countBadgeText}>{count}</Text>
              </View>
              <Text style={styles.countText}>{position}</Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  const renderItem = ({ item }: { item: Player }) => (
    <Animated.View 
      entering={SlideInLeft.delay(100 * players.indexOf(item)).duration(300)}
      style={styles.playerCard}
    >
      <View style={styles.playerInfo}>
        <View
          style={[
            styles.positionBadge,
            { backgroundColor: getPositionColor(item.position) },
          ]}
        >
          <Text style={styles.positionBadgeText}>
            {item.position.charAt(0)}
          </Text>
        </View>
        <View>
          <Text style={styles.playerName}>{item.name}</Text>
          <Text style={styles.playerPosition}>{item.position}</Text>
        </View>
      </View>
      
      <View style={styles.skillContainer}>
        <Text style={styles.skillLabel}>Skill</Text>
        <View style={styles.skillBadge}>
          <Text style={styles.skillText}>{item.skillLevel}</Text>
        </View>
      </View>
      
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleEdit(item)}
        >
          <Edit size={18} color="#4c9eeb" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => handleDelete(item)}
        >
          <X size={18} color="#f44336" />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );

  if (editingPlayer) {
    return (
      <PlayerForm 
        editPlayer={editingPlayer} 
        onComplete={handleEditComplete} 
      />
    );
  }

  return (
    <View style={styles.container}>
      {renderPositionCount()}
      
      <Text style={styles.title}>Player List</Text>

      {players.length > 0 ? (
        <FlatList
          data={players}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <Animated.View 
          entering={FadeIn.duration(500)}
          style={styles.emptyContainer}
        >
          <Text style={styles.emptyText}>No players added yet.</Text>
          <Text style={styles.emptySubtext}>Add players using the form above.</Text>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  listContainer: {
    paddingBottom: 80,
  },
  playerCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  playerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 2,
  },
  positionBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  positionBadgeText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  playerName: {
    fontSize: 16,
    fontWeight: '500',
  },
  playerPosition: {
    fontSize: 14,
    color: '#666',
  },
  skillContainer: {
    alignItems: 'center',
    flex: 1,
  },
  skillLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  skillBadge: {
    backgroundColor: '#f0f0f0',
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  skillText: {
    fontWeight: '600',
    fontSize: 16,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  deleteButton: {
    backgroundColor: '#ffebee',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
  },
  positionCountContainer: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  countTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
  },
  countsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  countItem: {
    alignItems: 'center',
  },
  countBadge: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  countBadgeText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
  countText: {
    fontSize: 12,
    color: '#666',
  },
});

export default PlayerList;