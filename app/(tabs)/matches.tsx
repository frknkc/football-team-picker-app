import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useMatch } from '@/context/MatchContext';
import { Match } from '@/types';
import { Trash2, Share2, Users } from 'lucide-react-native';
import * as Sharing from 'expo-sharing';
import Animated, { FadeIn } from 'react-native-reanimated';

const MatchesScreen = () => {
  const { savedMatches, deleteMatch } = useMatch();
  const router = useRouter();
  const [expandedMatch, setExpandedMatch] = useState<string | null>(null);

  const toggleExpand = (matchId: string) => {
    setExpandedMatch(expandedMatch === matchId ? null : matchId);
  };

  const confirmDelete = (match: Match) => {
    Alert.alert(
      'Delete Match',
      `Are you sure you want to delete this match?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => deleteMatch(match.id),
          style: 'destructive',
        },
      ]
    );
  };

  const shareMatch = async (match: Match) => {
    const teamAPlayers = match.teamA.players
      .map((p) => `- ${p.name} (${p.position}, Skill: ${p.skillLevel})`)
      .join('\n');
    
    const teamBPlayers = match.teamB.players
      .map((p) => `- ${p.name} (${p.position}, Skill: ${p.skillLevel})`)
      .join('\n');
    
    const message = `⚽ Football Match - ${match.format} ⚽\n\n` +
      `Date: ${new Date(match.createdAt).toLocaleDateString()}\n\n` +
      `TEAM A:\n${teamAPlayers}\n\n` +
      `TEAM B:\n${teamBPlayers}`;
    
    try {
      await Sharing.shareAsync(
        `data:text/plain;base64,${Buffer.from(message).toString('base64')}`,
        { mimeType: 'text/plain', dialogTitle: 'Share Match Details' }
      );
    } catch (error) {
      console.error('Error sharing match:', error);
      Alert.alert('Error', 'Could not share match details');
    }
  };

  const renderMatchItem = ({ item }: { item: Match }) => {
    const isExpanded = expandedMatch === item.id;
    
    return (
      <Animated.View 
        entering={FadeIn.duration(500)}
        style={styles.matchCard}
      >
        <TouchableOpacity 
          style={styles.matchHeader}
          onPress={() => toggleExpand(item.id)}
        >
          <View>
            <Text style={styles.matchFormat}>{item.format}</Text>
            <Text style={styles.matchDate}>
              {new Date(item.createdAt).toLocaleDateString()}
            </Text>
          </View>
          <Users size={24} color="#4c9eeb" />
        </TouchableOpacity>
        
        {isExpanded && (
          <View style={styles.matchDetails}>
            <View style={styles.teamContainer}>
              <View style={styles.teamHeader}>
                <View style={[styles.teamColor, { backgroundColor: item.teamA.color }]} />
                <Text style={styles.teamName}>{item.teamA.name}</Text>
              </View>
              {item.teamA.players.map((player) => (
                <View key={player.id} style={styles.playerItem}>
                  <Text style={styles.playerName}>{player.name}</Text>
                  <Text style={styles.playerPosition}>{player.position}</Text>
                </View>
              ))}
            </View>
            
            <View style={styles.teamContainer}>
              <View style={styles.teamHeader}>
                <View style={[styles.teamColor, { backgroundColor: item.teamB.color }]} />
                <Text style={styles.teamName}>{item.teamB.name}</Text>
              </View>
              {item.teamB.players.map((player) => (
                <View key={player.id} style={styles.playerItem}>
                  <Text style={styles.playerName}>{player.name}</Text>
                  <Text style={styles.playerPosition}>{player.position}</Text>
                </View>
              ))}
            </View>
            
            <View style={styles.actionsContainer}>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => shareMatch(item)}
              >
                <Share2 size={18} color="#4c9eeb" />
                <Text style={styles.actionText}>Share</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.actionButton, styles.deleteButton]}
                onPress={() => confirmDelete(item)}
              >
                <Trash2 size={18} color="#f44336" />
                <Text style={[styles.actionText, styles.deleteText]}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Saved Matches</Text>
      
      {savedMatches.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Users size={50} color="#ccc" />
          <Text style={styles.emptyText}>No saved matches yet</Text>
          <TouchableOpacity
            style={styles.createButton}
            onPress={() => router.push('/create')}
          >
            <Text style={styles.createButtonText}>Create New Match</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={savedMatches}
          renderItem={renderMatchItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 20,
    marginBottom: 16,
  },
  listContainer: {
    paddingBottom: 20,
  },
  matchCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  matchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  matchFormat: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
  },
  matchDate: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  matchDetails: {
    padding: 16,
  },
  teamContainer: {
    marginBottom: 16,
  },
  teamHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  teamColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  teamName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
  },
  playerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  playerName: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
  },
  playerPosition: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666',
  },
  actionsContainer: {
    flexDirection: 'row',
    marginTop: 8,
    justifyContent: 'space-between',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 4,
    justifyContent: 'center',
  },
  deleteButton: {
    backgroundColor: '#ffebee',
  },
  actionText: {
    fontFamily: 'Inter-Medium',
    marginLeft: 8,
    color: '#4c9eeb',
  },
  deleteText: {
    color: '#f44336',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#888',
    marginTop: -16,
    marginBottom: 20,
  },
  createButton: {
    backgroundColor: '#4c9eeb',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  createButtonText: {
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
    fontSize: 16,
  },
});

export default MatchesScreen;