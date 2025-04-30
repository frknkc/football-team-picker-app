import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Share,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useMatch } from '@/context/MatchContext';
import FormatSelector from '@/components/FormatSelector';
import PlayerForm from '@/components/PlayerForm';
import PlayerList from '@/components/PlayerList';
import FootballField from '@/components/FootballField';
import TeamDisplay from '@/components/TeamDisplay';
import { getTeamSize } from '@/utils/constants';
import { validatePlayerDistribution } from '@/utils/teamGenerator';
import { CircleArrowRight as ArrowRightCircle } from 'lucide-react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

const CreateScreen = () => {
  const {
    currentFormat,
    players,
    currentMatch,
    generateMatch,
    saveMatch,
  } = useMatch();
  const router = useRouter();
  const [step, setStep] = useState<'format' | 'players' | 'teams'>('format');
  const [showingPlayerForm, setShowingPlayerForm] = useState(false);

  const teamSize = getTeamSize(currentFormat);
  const totalPlayersNeeded = teamSize * 2;
  
  const nextStep = () => {
    if (step === 'format') {
      setStep('players');
    } else if (step === 'players') {
      // Validate we have enough players
      if (players.length < totalPlayersNeeded) {
        Alert.alert(
          'Not Enough Players',
          `You need ${totalPlayersNeeded} players for a ${currentFormat} match.`
        );
        return;
      }

      // Validate player distribution
      // if (!validatePlayerDistribution(players, currentFormat)) {
      //   Alert.alert(
      //     'Invalid Player Distribution',
      //     'You need at least one goalkeeper for each team.'
      //   );
      //   return;
      // }

      // Generate teams
      generateMatch();
      setStep('teams');
    }
  };

  const prevStep = () => {
    if (step === 'teams') {
      setStep('players');
    } else if (step === 'players') {
      setStep('format');
    }
  };

  const handleSaveMatch = () => {
    if (currentMatch) {
      saveMatch(currentMatch);
      Alert.alert(
        'Match Saved',
        'Your match has been saved successfully.',
        [{ text: 'OK', onPress: () => router.push('/matches') }]
      );
    }
  };

  const handleShareMatch = async () => {
    if (!currentMatch) return;

    const teamAPlayers = currentMatch.teamA.players
      .map((p) => `- ${p.name} (${p.position}, Skill: ${p.skillLevel})`)
      .join('\n');
    
    const teamBPlayers = currentMatch.teamB.players
      .map((p) => `- ${p.name} (${p.position}, Skill: ${p.skillLevel})`)
      .join('\n');
    
    const message = `⚽ Football Match - ${currentMatch.format} ⚽\n\n` +
      `TEAM A:\n${teamAPlayers}\n\n` +
      `TEAM B:\n${teamBPlayers}`;
    
    try {
      await Share.share({
        message,
        title: 'Football Match Teams',
      });
    } catch (error) {
      console.error('Error sharing match:', error);
    }
  };

  const handleRegenerateTeams = () => {
    generateMatch();
  };

  const renderStepContent = () => {
    switch (step) {
      case 'format':
        return <FormatSelector />;
      case 'players':
        return (
          <View style={styles.playersContainer}>
            {showingPlayerForm ? (
              <PlayerForm onComplete={() => setShowingPlayerForm(false)} />
            ) : (
              <>
                <PlayerList />
                <TouchableOpacity
                  style={styles.addPlayerButton}
                  onPress={() => setShowingPlayerForm(true)}
                >
                  <Text style={styles.addPlayerButtonText}>Add Player</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        );
      case 'teams':
        if (!currentMatch) return null;
        return (
          <View style={styles.teamsContainer}>
            <ScrollView 
              style={styles.teamScrollView}
              contentContainerStyle={styles.teamScrollContent}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.fieldWrapper}>
                <FootballField 
                  key={currentMatch.id}
                  match={currentMatch} 
                />
              </View>
              <View style={styles.actionButtons}>
                <TouchableOpacity
                  style={[styles.actionButton, styles.backButton]}
                  onPress={prevStep}
                >
                  <Text style={styles.actionButtonText}>Back</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionButton, styles.regenerateButton]}
                  onPress={handleRegenerateTeams}
                >
                  <Text style={styles.actionButtonText}>Regenerate</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionButton, styles.saveButton]}
                  onPress={handleSaveMatch}
                >
                  <Text style={styles.actionButtonText}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionButton, styles.shareButton]}
                  onPress={handleShareMatch}
                >
                  <Text style={styles.actionButtonText}>Share</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        );
    }
  };

  const renderNextButton = () => {
    if (step === 'teams') return null;
    
    return (
      <TouchableOpacity style={styles.nextButton} onPress={nextStep}>
        <Text style={styles.nextButtonText}>
          {step === 'format' ? 'Next: Add Players' : 'Generate Teams'}
        </Text>
        <ArrowRightCircle size={20} color="#fff" />
      </TouchableOpacity>
    );
  };

  const renderStepIndicator = () => {
    return (
      <View style={styles.stepIndicatorContainer}>
        <View
          style={[
            styles.stepDot,
            step === 'format' ? styles.activeStep : styles.completedStep,
          ]}
        />
        <View style={styles.stepLine} />
        <View
          style={[
            styles.stepDot,
            step === 'players'
              ? styles.activeStep
              : step === 'teams'
              ? styles.completedStep
              : styles.inactiveStep,
          ]}
        />
        <View style={styles.stepLine} />
        <View
          style={[
            styles.stepDot,
            step === 'teams' ? styles.activeStep : styles.inactiveStep,
          ]}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {step !== 'teams' && (
        <View style={styles.header}>
          <Text style={styles.title}>
            {step === 'format' ? 'Select Format' : 'Add Players'}
          </Text>
          {renderStepIndicator()}
        </View>
      )}
      
      {renderStepContent()}
      
      {renderNextButton()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 20,
    marginBottom: 16,
    textAlign: 'center',
  },
  stepIndicatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  activeStep: {
    backgroundColor: '#4c9eeb',
  },
  completedStep: {
    backgroundColor: '#4caf50',
  },
  inactiveStep: {
    backgroundColor: '#e0e0e0',
  },
  stepLine: {
    height: 2,
    width: 40,
    backgroundColor: '#e0e0e0',
  },
  playersContainer: {
    flex: 1,
    padding: 16,
  },
  teamsContainer: {
    flex: 1,
  },
  teamScrollView: {
    flex: 1,
  },
  teamScrollContent: {
    flexGrow: 1,
    paddingBottom: 100, // Space for buttons
  },
  fieldWrapper: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  nextButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#4c9eeb',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
    gap: 8,
    zIndex: 1000, // Ensure button is above other content
  },
  nextButtonText: {
    color: '#fff',
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
  },
  addPlayerButton: {
    backgroundColor: '#4caf50',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 80, // Space for next button
  },
  addPlayerButtonText: {
    color: '#fff',
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 20,
    gap: 8,
  },
  actionButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonText: {
    color: '#fff',
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
  },
  backButton: {
    backgroundColor: '#666',
  },
  regenerateButton: {
    backgroundColor: '#4c9eeb',
  },
  saveButton: {
    backgroundColor: '#4caf50',
  },
  shareButton: {
    backgroundColor: '#ff9800',
  },
});

export default CreateScreen;