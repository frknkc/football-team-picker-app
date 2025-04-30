import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Match } from '@/types';
import { Share, RefreshCw, Save, ArrowLeft } from 'lucide-react-native';

interface TeamDisplayProps {
  match: Match;
  onShare: () => void;
  onReset: () => void;
  onSave: () => void;
  onBack: () => void;
}

const TeamDisplay: React.FC<TeamDisplayProps> = ({
    match,
    onShare,
    onReset,
    onSave,
    onBack,
  }) => {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <ArrowLeft size={24} color="#666" />
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Generated Teams</Text>
          <View style={{ width: 60 }} /> 
        </View>
  
        <View style={styles.teamsContainer}>
          <View style={styles.teamSection}>
            <Text style={styles.teamTitle}>Team A</Text>
            {match.teamA.players.map((player) => (
              <View key={player.id} style={styles.playerCard}>
                <Text style={styles.playerName}>{player.name}</Text>
                <Text style={styles.playerDetails}>
                  {player.position} • Skill: {player.skillLevel}
                </Text>
              </View>
            ))}
          </View>
  
          <View style={styles.divider} />
  
          <View style={styles.teamSection}>
            <Text style={styles.teamTitle}>Team B</Text>
            {match.teamB.players.map((player) => (
              <View key={player.id} style={styles.playerCard}>
                <Text style={styles.playerName}>{player.name}</Text>
                <Text style={styles.playerDetails}>
                  {player.position} • Skill: {player.skillLevel}
                </Text>
              </View>
            ))}
          </View>
        </View>
  
        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionButton} onPress={onReset}>
            <RefreshCw size={20} color="#fff" />
            <Text style={styles.actionText}>Regenerate</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={onShare}>
            <Share size={20} color="#fff" />
            <Text style={styles.actionText}>Share</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.saveButton]}
            onPress={onSave}
          >
            <Save size={20} color="#fff" />
            <Text style={styles.actionText}>Save Match</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
    header: {
      height: 60, // sabit yükseklik
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      borderBottomWidth: 1,
      borderBottomColor: '#e0e0e0',
    },
    backButton: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    backText: {
      marginLeft: 4,
      color: '#666',
      fontFamily: 'Inter-Medium',
    },
    title: {
      fontSize: 20,
      fontFamily: 'Inter-SemiBold',
      color: '#333',
    },
    teamsContainer: {
      flex: 1,
      flexDirection: 'row',
      paddingHorizontal: 16,
      paddingTop: 20,
    },
    teamSection: {
      flex: 1,
    },
    teamTitle: {
      fontSize: 16,
      fontFamily: 'Inter-SemiBold',
      color: '#333',
      marginBottom: 12,
      textAlign: 'center',
    },
    divider: {
      width: 1,
      backgroundColor: '#e0e0e0',
      marginHorizontal: 12,
    },
    playerCard: {
      backgroundColor: '#f5f5f5',
      borderRadius: 8,
      paddingVertical: 8,
      paddingHorizontal: 12,
      marginBottom: 6,
    },
    playerName: {
      fontSize: 14,
      fontFamily: 'Inter-SemiBold',
      color: '#333',
      marginBottom: 2,
    },
    playerDetails: {
      fontSize: 12,
      fontFamily: 'Inter-Regular',
      color: '#666',
    },
    actions: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      height: 70, // sabit yükseklik
      alignItems: 'center',
      borderTopWidth: 1,
      borderTopColor: '#e0e0e0',
      paddingHorizontal: 16,
    },
    actionButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#4c9eeb',
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: 20,
    },
    saveButton: {
      backgroundColor: '#4caf50',
    },
    actionText: {
      color: '#fff',
      marginLeft: 6,
      fontSize: 14,
      fontFamily: 'Inter-Medium',
    },
  });
  
  export default TeamDisplay;