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
            <TeamDisplay
              match={currentMatch}
              onShare={handleShareMatch}
              onReset={handleRegenerateTeams}
              onSave={handleSaveMatch}
              onBack={prevStep}
            />
            <ScrollView>
              <FootballField match={currentMatch} />
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
    <Animated.View 
      entering={FadeIn.duration(500)}
      style={styles.container}
    >
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
    </Animated.View>
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
  },
  teamsContainer: {
    flex: 1,
  },
  nextButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#4c9eeb',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  nextButtonText: {
    color: '#fff',
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    marginRight: 8,
  },
  addPlayerButton: {
    position: 'absolute',
    bottom: 80,
    right: 20,
    backgroundColor: '#4caf50',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  addPlayerButtonText: {
    color: '#fff',
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
  },
});

export default CreateScreen;